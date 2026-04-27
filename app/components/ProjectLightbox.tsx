"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project, ProjectImage } from "../../sanity/queries";

type Props = {
  project: Project;
  /**
   * Original 0-based index of the image the user clicked, or `null` if they
   * opened the project from a title (info-only). The lightbox always starts
   * on the info slide; the image slides are then ordered so this image
   * comes first when the user presses next.
   */
  imageStart: number | null;
  onClose: () => void;
};

type ImageSlide = { kind: "image"; image: ProjectImage; index: number };
type Slide = { kind: "info" } | ImageSlide;

export default function ProjectLightbox({
  project,
  imageStart,
  onClose,
}: Props) {
  // Reorder image slides so the clicked image is first after info.
  const ordered: ProjectImage[] = (() => {
    const n = project.images.length;
    if (n === 0) return [];
    const start = imageStart != null && imageStart >= 0 && imageStart < n
      ? imageStart
      : 0;
    return Array.from({ length: n }, (_, k) => project.images[(start + k) % n]);
  })();

  // For the counter we still want to show "5 / 10" using the original upload
  // index, so keep both around.
  const slides: Slide[] = [
    { kind: "info" },
    ...ordered.map((image, k) => {
      const originalIndex =
        (imageStart != null && imageStart >= 0 ? imageStart : 0) + k;
      const wrapped = originalIndex % project.images.length;
      return { kind: "image" as const, image, index: wrapped };
    }),
  ];
  const total = slides.length;

  // Always land on info first.
  const [i, setI] = useState(0);

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

      {/*
        Off-screen preloader: while the user is on any slide we render every
        other image at 1×1 with the same `sizes="90vw"` the visible <Image>
        uses, so Next picks the same srcset entry. The browser fetches them
        in the background and the cache is hot by the time the user navigates,
        which is what makes "텍스트 페이지에 머무는 동안 다른 이미지 로딩"
        actually fast.
      */}
      <div
        aria-hidden
        className="absolute pointer-events-none opacity-0"
        style={{ left: -9999, top: -9999, width: 1, height: 1 }}
      >
        {project.images.map((img, idx) => {
          if (!img.url) return null;
          return (
            <div
              key={`preload-${idx}`}
              className="relative"
              style={{ width: 1, height: 1 }}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="90vw"
                quality={95}
                loading="eager"
                placeholder="empty"
              />
            </div>
          );
        })}
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
  // `loaded` flips on the Image's onLoad / video onCanPlay event. We start at
  // 0 opacity + a small downward offset and ease to 1 / 0 — a fade-in with a
  // tiny slide-up. (Pure opacity ramp is a "fade-in"; layered with the
  // previous frame visible underneath would be a "cross-dissolve" / "crossfade".)
  // `key` on this component remounts SlideImage per slide so every navigation
  // triggers a fresh animation.
  const [loaded, setLoaded] = useState(false);
  const isVideo = !!image.videoUrl;

  return (
    <div
      className="relative"
      style={{
        height: "72vh",
        aspectRatio: `${aspect}`,
        maxWidth: "calc(100vw - 8rem)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out"
        style={{ opacity: loaded ? 0 : 1 }}
      >
        <span className="block w-7 h-7 rounded-full border-2 border-white/30 border-t-white/90 animate-spin" />
      </div>
      {isVideo ? (
        <video
          src={image.videoUrl ?? undefined}
          poster={image.url ?? undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          onCanPlay={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
          style={{
            objectFit: "contain",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(8px)",
          }}
        />
      ) : (
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
          className="transition-all duration-700 ease-out"
          style={{
            objectFit: "contain",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(8px)",
          }}
        />
      )}
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
      className="text-white overflow-y-auto overscroll-contain"
      style={{
        width: "min(720px, calc(100vw - 8rem))",
        maxHeight: "calc(100vh - 8rem)",
      }}
    >
      <div className="w-full text-left pr-2">
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
          <div className="mt-12 space-y-4 text-[16px] leading-[1.55] text-white/90 text-left pb-2">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
