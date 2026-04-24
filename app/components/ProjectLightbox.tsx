"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project, ProjectImage } from "../../sanity/queries";

type Props = {
  project: Project;
  startIndex: number;
  onClose: () => void;
};

type Slide =
  | { kind: "info" }
  | { kind: "image"; image: ProjectImage; index: number };

export default function ProjectLightbox({
  project,
  startIndex,
  onClose,
}: Props) {
  const slides: Slide[] = [
    { kind: "info" },
    ...project.images.map((image, index) => ({
      kind: "image" as const,
      image,
      index,
    })),
  ];
  const total = slides.length;

  const initial = Math.min(Math.max(0, startIndex), total - 1);
  const [i, setI] = useState(initial);

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

  const current = slides[i];
  const imageCount = project.images.length;
  const counter =
    current.kind === "info" ? "Info" : `${current.index + 1} / ${imageCount}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div onClick={(e) => e.stopPropagation()}>
          {current.kind === "info" ? (
            <InfoSlide project={project} />
          ) : (
            (() => {
              const w = current.image.width ?? 4;
              const h = current.image.height ?? 3;
              const aspect = w / h;
              return (
                <div
                  className="relative"
                  style={{
                    height: "72vh",
                    aspectRatio: `${aspect}`,
                    maxWidth: "calc(100vw - 8rem)",
                  }}
                >
                  <Image
                    src={current.image.url ?? ""}
                    alt={current.image.alt || project.title}
                    fill
                    sizes="90vw"
                    priority
                    placeholder={current.image.lqip ? "blur" : "empty"}
                    blurDataURL={current.image.lqip ?? undefined}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              );
            })()
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-6 z-10 text-white text-[14px] hover:underline"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white text-[28px] px-3 py-2 hover:opacity-70"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white text-[28px] px-3 py-2 hover:opacity-70"
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}

      <div className="absolute bottom-5 left-6 right-6 flex items-baseline justify-between gap-6 text-white/80 text-[13px] pointer-events-none">
        <span>{project.title}</span>
        <span>{counter}</span>
      </div>
    </div>
  );
}

function InfoSlide({ project }: { project: Project }) {
  const meta = [project.year, project.role, project.location]
    .filter(Boolean)
    .join(" · ");

  const paragraphs = project.body
    ? project.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="text-white overflow-y-auto"
      style={{
        width: "min(720px, calc(100vw - 8rem))",
        maxHeight: "calc(100vh - 8rem)",
      }}
    >
      <div className="w-full text-left">
        <h2 className="text-[26px] sm:text-[32px] leading-[1.2]">
          {project.title}
        </h2>
        {meta && <div className="mt-2 text-white/70 text-[14px]">{meta}</div>}

        {(project.client || project.partners) && (
          <dl className="mt-5 space-y-1 text-[14px] inline-block text-left">
            {project.client && (
              <div className="flex gap-2">
                <dt className="text-white/60 shrink-0">As part of:</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            {project.partners && (
              <div className="flex gap-2">
                <dt className="text-white/60 shrink-0">In partnership with:</dt>
                <dd>{project.partners}</dd>
              </div>
            )}
          </dl>
        )}

        {project.summary && (
          <p className="mt-6 text-[16px] leading-[1.55] text-white/90">
            {project.summary}
          </p>
        )}

        {paragraphs.length > 0 && (
          <div className="mt-12 space-y-4 text-[14px] leading-[1.75] text-white/85 text-left">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
