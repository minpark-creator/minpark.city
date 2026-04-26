"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
            <SlideImage
              key={current.image.url ?? current.index}
              image={current.image}
              alt={current.image.alt || project.title}
            />
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

function SlideImage({
  image,
  alt,
}: {
  image: ProjectImage;
  alt: string;
}) {
  const w = image.width ?? 4;
  const h = image.height ?? 3;
  const aspect = w / h;
  // `loaded` flips on the Image's onLoad event. We start at 0 opacity and
  // ease to 1 — this is a fade-in (sometimes called a cross-dissolve when
  // the previous slide stays under the new one). React's `key` on this
  // component remounts SlideImage per slide, so each navigation triggers
  // a fresh fade.
  const [loaded, setLoaded] = useState(false);
  // First paint guard so the transition actually animates from 0 → 1
  // instead of the browser skipping the initial frame.
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  return (
    <div
      className="relative"
      style={{
        height: "72vh",
        aspectRatio: `${aspect}`,
        maxWidth: "calc(100vw - 8rem)",
      }}
    >
      {/* Spinner shown while the image is loading */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out"
        style={{ opacity: loaded ? 0 : 1 }}
      >
        <span className="block w-7 h-7 rounded-full border-2 border-white/30 border-t-white/90 animate-spin" />
      </div>
      <Image
        src={image.url ?? ""}
        alt={alt}
        fill
        sizes="90vw"
        quality={95}
        priority
        placeholder={image.lqip ? "blur" : "empty"}
        blurDataURL={image.lqip ?? undefined}
        onLoad={() => setLoaded(true)}
        className="transition-opacity duration-700 ease-out"
        style={{ objectFit: "contain", opacity: loaded ? 1 : 0 }}
      />
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

        {paragraphs.length > 0 && (
          <div className="mt-12 space-y-4 text-[16px] leading-[1.55] text-white/90 text-left">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
