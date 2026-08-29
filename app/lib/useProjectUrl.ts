"use client";

import { useEffect, useRef } from "react";

/**
 * Mirrors an open project into the address bar as `/work/<slug>` while the
 * lightbox is up, so a project can be linked to, shared and reopened — the
 * URL is the only thing the lightbox used to be missing.
 *
 * Opening pushes one history entry. Closing takes it back off, whether the
 * user closed with the button, with Escape, or with the browser's Back. The
 * real page at that URL is rendered by app/work/[slug]/page.tsx, so a reload
 * or a pasted link lands on the same project rather than on nothing.
 */
export function useProjectUrl(slug: string | null | undefined, onClose: () => void) {
  // `onClose` is a fresh closure on every render; holding it in a ref keeps
  // the effect keyed on the slug alone, so it pushes exactly once per open.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // Whether our entry is still on the stack. Back pops it for us; closing
  // from the UI means we have to pop it ourselves.
  const pushed = useRef(false);

  useEffect(() => {
    if (!slug) return;

    window.history.pushState(null, "", `/work/${slug}`);
    pushed.current = true;

    const onPop = () => {
      pushed.current = false;
      closeRef.current();
    };
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      if (pushed.current) {
        pushed.current = false;
        window.history.back();
      }
    };
  }, [slug]);
}
