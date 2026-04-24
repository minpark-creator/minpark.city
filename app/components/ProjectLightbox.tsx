"use client";

import { useEffect, useState } from "react";
import type { ProjectImage } from "../../sanity/queries";

type Props = {
  images: ProjectImage[];
  startIndex: number;
  title: string;
  onClose: () => void;
};

export default function ProjectLightbox({
  images,
  startIndex,
  title,
  onClose,
}: Props) {
  const [i, setI] = useState(startIndex);
  const total = images.length;

  const prev = () => setI((x) => (x - 1 + total) % total);
  const next = () => setI((x) => (x + 1) % total);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (!total) return null;
  const img = images[i];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-6 text-white text-[14px] hover:underline"
        aria-label="Close"
      >
        Close
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-[28px] px-3 py-2 hover:opacity-70"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-[28px] px-3 py-2 hover:opacity-70"
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <figure
        className="max-w-[92vw] max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {img?.url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={img.url}
            alt={img.alt || title}
            className="max-w-[92vw] max-h-[82vh] object-contain"
          />
        ) : (
          <div
            className="w-[60vw] h-[70vh]"
            style={{ backgroundColor: "#efeae2" }}
          />
        )}
        <figcaption className="pt-3 text-white/80 text-[13px] flex items-baseline justify-between gap-6">
          <span>{title}</span>
          <span>
            {i + 1} / {total}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
