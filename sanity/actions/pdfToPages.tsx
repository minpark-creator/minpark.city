"use client";

import { useEffect, useRef, useState } from "react";
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from "sanity";
import { apiVersion } from "../env";
import { countPdfPages, rasterisePdf } from "../pdf/rasterise";

/**
 * "PDF → page images": renders every page of the project's uploaded PDF into
 * the `images` array, so the existing lightbox flips through the document one
 * page at a time. Nothing about the public site changes — by the time a
 * visitor sees it, a PDF page is just another image.
 *
 * Rendering happens here, in the editor's browser, rather than in a webhook
 * or a build step: it needs a canvas, it only runs a handful of times a year,
 * and doing it in Studio keeps the whole thing inside the CMS.
 */

/** Shape we read off the document. Sanity hands actions a loose SanityDocument. */
type ProjectDoc = {
  title?: string;
  images?: { _key?: string; pdfPage?: number }[];
  pdf?: { asset?: { _ref?: string } };
};

type Phase =
  | { step: "loading" }
  | { step: "ready"; pageCount: number }
  | { step: "working"; done: number; total: number; label: string }
  | { step: "done"; added: number }
  | { step: "error"; message: string };

function randomKey() {
  return Math.random().toString(36).slice(2, 12);
}

/** Pages this action generated last time, which a re-run should clear out. */
function generatedKeys(doc: ProjectDoc | null): string[] {
  return (doc?.images ?? [])
    .filter((img) => typeof img?.pdfPage === "number" && img._key)
    .map((img) => img._key as string);
}

// Named `use…` because a document action *is* a hook — Studio calls it from a
// hook collection on every render, which is why it can hold state at all.
// Sanity's own actions (`useScheduleAction`) are named the same way, and it is
// what keeps react-hooks/rules-of-hooks satisfied.
export const usePdfToPagesAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { id, type, draft, published, onComplete } = props;
  const doc = (draft ?? published) as ProjectDoc | null;

  const client = useClient({ apiVersion });
  const { patch } = useDocumentOperation(id, type);

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>({ step: "loading" });

  // The fetched PDF, kept across the confirm step so we only download it once.
  const bufferRef = useRef<ArrayBuffer | null>(null);
  // Set on unmount / close so a long run stops patching a document the editor
  // has already navigated away from.
  const cancelledRef = useRef(false);

  const assetRef = doc?.pdf?.asset?._ref;
  const existing = generatedKeys(doc);

  // Plain functions rather than useCallback: the compiler memoizes what is
  // worth memoizing, and hand-written dep arrays here only went stale.
  const close = () => {
    cancelledRef.current = true;
    setOpen(false);
    setPhase({ step: "loading" });
    bufferRef.current = null;
    onComplete();
  };

  // On open, resolve the asset URL, download it and count the pages, so the
  // confirm step can say "42 pages" rather than asking blind.
  useEffect(() => {
    if (!open || !assetRef) return;
    cancelledRef.current = false;
    let live = true;

    (async () => {
      try {
        const url = await client.fetch<string | null>(
          `*[_id == $ref][0].url`,
          { ref: assetRef }
        );
        if (!url) throw new Error("Could not resolve the PDF's URL.");
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Downloading the PDF failed (${res.status}).`);
        const buf = await res.arrayBuffer();
        const pageCount = await countPdfPages(buf);
        if (!live) return;
        bufferRef.current = buf;
        setPhase({ step: "ready", pageCount });
      } catch (err) {
        if (!live) return;
        setPhase({ step: "error", message: (err as Error).message });
      }
    })();

    return () => {
      live = false;
    };
  }, [open, assetRef, client]);

  const run = async () => {
    const buf = bufferRef.current;
    if (!buf) return;

    try {
      // Clear last run's pages first. Doing it up front means a re-run that
      // fails halfway still leaves a coherent document rather than two
      // interleaved sets of pages.
      if (existing.length > 0) {
        patch.execute([
          { unset: existing.map((key) => `images[_key=="${key}"]`) },
        ]);
      }

      setPhase({ step: "working", done: 0, total: 0, label: "Rendering" });

      const title = doc?.title ?? "Page";
      let added = 0;

      await rasterisePdf(buf, async ({ page, total, blob }) => {
        if (cancelledRef.current) throw new Error("Cancelled.");

        setPhase({
          step: "working",
          done: page - 1,
          total,
          label: `Uploading page ${page}`,
        });

        const asset = await client.assets.upload("image", blob, {
          filename: `${slugish(title)}-p${String(page).padStart(3, "0")}.jpg`,
          contentType: "image/jpeg",
        });

        if (cancelledRef.current) throw new Error("Cancelled.");

        // Append page by page rather than in one patch at the end: a 60-page
        // run is minutes long, and the editor should see it filling in.
        patch.execute([
          { setIfMissing: { images: [] } },
          {
            insert: {
              after: "images[-1]",
              items: [
                {
                  _key: randomKey(),
                  _type: "image",
                  pdfPage: page,
                  alt: `${title} — page ${page} of ${total}`,
                  asset: { _type: "reference", _ref: asset._id },
                },
              ],
            },
          },
        ]);

        added = page;
        setPhase({ step: "working", done: page, total, label: "Rendering" });
      });

      setPhase({ step: "done", added });
    } catch (err) {
      if (cancelledRef.current) return;
      setPhase({ step: "error", message: (err as Error).message });
    }
  };

  if (type !== "project") return null;

  return {
    label: "PDF → page images",
    title: assetRef
      ? "Render every page of the uploaded PDF into Images & Videos"
      : "Upload a PDF to this project first, and save",
    disabled: !assetRef,
    onHandle: () => setOpen(true),
    dialog: open && {
      type: "dialog" as const,
      header: "PDF → page images",
      onClose: phase.step === "working" ? () => {} : close,
      content: (
        <DialogBody
          phase={phase}
          replacing={existing.length}
          onRun={run}
          onClose={close}
        />
      ),
    },
  };
};

usePdfToPagesAction.displayName = "PdfToPagesAction";

function slugish(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "page"
  );
}

/**
 * Plain markup rather than @sanity/ui components: @sanity/ui is nested inside
 * the `sanity` package here, not a top-level dependency, and importing a
 * second copy of it would put a second styled-components theme context in the
 * tree. The dialog chrome around this is Studio's own.
 */
function DialogBody({
  phase,
  replacing,
  onRun,
  onClose,
}: {
  phase: Phase;
  replacing: number;
  onRun: () => void;
  onClose: () => void;
}) {
  const text: React.CSSProperties = { fontSize: 14, lineHeight: 1.5, margin: 0 };
  const muted: React.CSSProperties = { ...text, opacity: 0.65, marginTop: 8 };

  if (phase.step === "loading") {
    return <p style={text}>Reading the PDF…</p>;
  }

  if (phase.step === "error") {
    return (
      <div>
        <p style={{ ...text, color: "#f36" }}>{phase.message}</p>
        <p style={muted}>
          If the worker file is missing, run <code>npm install</code> once to
          restore <code>public/vendor/pdf.worker.min.mjs</code>.
        </p>
        <Actions>
          <Button onClick={onClose}>Close</Button>
        </Actions>
      </div>
    );
  }

  if (phase.step === "done") {
    return (
      <div>
        <p style={text}>
          Added {phase.added} page{phase.added === 1 ? "" : "s"} to Images &
          Videos.
        </p>
        <p style={muted}>
          They are on the draft — publish the project to put them live.
        </p>
        <Actions>
          <Button onClick={onClose} tone="primary">
            Done
          </Button>
        </Actions>
      </div>
    );
  }

  if (phase.step === "working") {
    const pct = phase.total ? Math.round((phase.done / phase.total) * 100) : 0;
    return (
      <div>
        <p style={text}>
          {phase.label}
          {phase.total ? ` — ${phase.done} / ${phase.total}` : "…"}
        </p>
        <div
          style={{
            marginTop: 12,
            height: 4,
            borderRadius: 2,
            background: "rgba(127,127,127,0.25)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: "currentColor",
              transition: "width 200ms ease-out",
            }}
          />
        </div>
        <p style={muted}>Keep this tab open until it finishes.</p>
      </div>
    );
  }

  return (
    <div>
      <p style={text}>
        {phase.pageCount} page{phase.pageCount === 1 ? "" : "s"} will be
        rendered at 2400px and added to Images &amp; Videos, in order.
      </p>
      {replacing > 0 && (
        <p style={muted}>
          The {replacing} page{replacing === 1 ? "" : "s"} generated last time
          will be removed first. Photos you uploaded by hand are left alone.
        </p>
      )}
      <p style={muted}>
        Long documents take a while — roughly a second a page.
      </p>
      <Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onRun} tone="primary">
          Render {phase.pageCount} page{phase.pageCount === 1 ? "" : "s"}
        </Button>
      </Actions>
    </div>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
        marginTop: 20,
      }}
    >
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "primary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        font: "inherit",
        fontSize: 13,
        padding: "8px 14px",
        borderRadius: 3,
        cursor: "pointer",
        border: "1px solid rgba(127,127,127,0.4)",
        background: tone === "primary" ? "#2276fc" : "transparent",
        color: tone === "primary" ? "#fff" : "inherit",
      }}
    >
      {children}
    </button>
  );
}
