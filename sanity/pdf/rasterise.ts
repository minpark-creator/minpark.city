/**
 * Turns a PDF into one JPEG per page, in the browser.
 *
 * This only ever runs inside Studio (from the "PDF → page images" document
 * action), never on the public site — pdf.js is a ~450KB import, and the
 * visitor-facing lightbox just wants ordinary images.
 */

/** Long edge of a rendered page, in pixels. Matches the 2400px the lightbox asks the CDN for. */
const TARGET_LONG_EDGE = 2400;

/** JPEG quality for the uploaded page. */
const JPEG_QUALITY = 0.92;

export type RasterisedPage = {
  /** 1-based page number, as printed in a PDF reader. */
  page: number;
  total: number;
  blob: Blob;
  width: number;
  height: number;
};

type Pdfjs = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<Pdfjs> | null = null;

/**
 * Loads pdf.js once, pointed at the worker copied into `public/vendor/` by
 * `scripts/copy-pdf-worker.mjs`. Without a worker pdf.js renders on the main
 * thread and freezes the whole Studio for the length of the document.
 */
function loadPdfjs(): Promise<Pdfjs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

/** How many pages the document has, without rendering any of them. */
export async function countPdfPages(data: ArrayBuffer): Promise<number> {
  const pdfjs = await loadPdfjs();
  // getDocument detaches the buffer it is handed, so give it a copy — the
  // caller still needs the original to render from.
  // In pdf.js 6 `destroy()` lives on the loading task, not the document, and
  // it is what tears the worker down — skipping it leaks a worker per call.
  const task = pdfjs.getDocument({ data: data.slice(0) });
  try {
    const doc = await task.promise;
    return doc.numPages;
  } finally {
    await task.destroy();
  }
}

/**
 * Renders each page to a JPEG and hands it to `onPage` before moving on, so
 * the caller can upload it and let the blob go. Rendering everything up front
 * would hold a 40-page deck's worth of bitmaps in memory at once.
 */
export async function rasterisePdf(
  data: ArrayBuffer,
  onPage: (page: RasterisedPage) => Promise<void>
): Promise<number> {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({ data: data.slice(0) });
  const doc = await task.promise;

  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);

      // Scale so the long edge lands on TARGET_LONG_EDGE, but never blow a
      // small page up more than 4× — past that you are only enlarging the
      // renderer's own antialiasing.
      const base = page.getViewport({ scale: 1 });
      const fit = TARGET_LONG_EDGE / Math.max(base.width, base.height);
      const viewport = page.getViewport({ scale: Math.min(fit, 4) });

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get a 2D canvas context.");

      await page.render({
        canvas,
        viewport,
        // PDF pages are transparent wherever the paper shows through. JPEG has
        // no alpha, so an unpainted background would come out black.
        background: "rgb(255,255,255)",
      }).promise;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(new Error(`Page ${n} failed to encode.`)),
          "image/jpeg",
          JPEG_QUALITY
        );
      });

      await onPage({
        page: n,
        total: doc.numPages,
        blob,
        width: canvas.width,
        height: canvas.height,
      });

      // Release the bitmap before the next page allocates its own.
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }

    return doc.numPages;
  } finally {
    await task.destroy();
  }
}
