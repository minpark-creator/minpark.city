"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProjectImage } from "../../sanity/queries";

type Props = {
  images: ProjectImage[];
};

/** How long each hero photo holds before the next one starts fading in. */
const HOLD_MS = 5000;
/** Crossfade duration. Long and slow so the swap reads as a dissolve. */
const FADE_MS = 1600;
/** Delay before we start pulling the rest of the set into cache. */
const PRELOAD_DELAY_MS = 2000;

type Frame = { idx: number; key: number };

/**
 * Slideshow hero background with zero blank-frame guarantee.
 *
 * Photos run in Studio order, starting from the first one. Because that start
 * is deterministic, the opening LQIP data-URI is just server-rendered as a CSS
 * background — it is in the initial HTML, so a blurry photo is on screen at
 * first paint and the full-res image fades in over it. The viewer never sees
 * a black or grey frame, only blurry photo → sharp photo.
 *
 * From there the hero advances through the set on a timer. Each step pushes a
 * new frame that fades in *on top of* the outgoing one, which stays fully
 * opaque underneath — cross-dissolving two layers that both ramp (one up, one
 * down) would briefly let the dark LQIP show through the gap.
 */
export default function HeroBackdrop({ images }: Props) {
  // The opening frame is known at render time, so it ships in the server HTML
  // rather than waiting on an effect.
  const [frames, setFrames] = useState<Frame[]>([{ idx: 0, key: 0 }]);
  const [preload, setPreload] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;

    const preloadTimer = window.setTimeout(
      () => setPreload(true),
      PRELOAD_DELAY_MS
    );
    if (images.length < 2) return () => window.clearTimeout(preloadTimer);

    let idx = 0;
    let key = 0;
    const tick = window.setInterval(() => {
      idx = (idx + 1) % images.length;
      key += 1;
      const next = { idx, key };
      // Only the outgoing frame and the incoming one need to stay mounted;
      // anything older is fully covered and just costs memory.
      setFrames((f) => [...f, next].slice(-2));
    }, HOLD_MS);

    return () => {
      window.clearTimeout(preloadTimer);
      window.clearInterval(tick);
    };
  }, [images]);

  if (images.length === 0) return null;

  const firstLqip = images[0]?.lqip;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        id="hero-lqip"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          transform: "scale(1.08)",
          filter: "blur(14px)",
          backgroundImage: firstLqip ? `url('${firstLqip}')` : undefined,
        }}
      />

      {/* Later frames come later in the DOM, so they paint over earlier ones
          without needing an explicit z-index. */}
      {frames.map((f) => (
        <HeroFrame
          key={f.key}
          image={images[f.idx]}
          priority={f.key === 0}
        />
      ))}

      {/*
        Off-screen preloader: once the first hero photo is in, we render the
        rest at 1×1 with the same `sizes="100vw"` the visible <Image> uses so
        Next picks the same srcset entry. They land in cache well before the
        timer reaches them, which is what keeps each swap instant.
      */}
      {preload && (
        <div
          className="absolute pointer-events-none opacity-0"
          style={{ left: -9999, top: -9999, width: 1, height: 1 }}
        >
          {images.map((img, i) =>
            img.url ? (
              <div
                key={`preload-${i}`}
                className="relative"
                style={{ width: 1, height: 1 }}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="100vw"
                  quality={92}
                  loading="eager"
                  placeholder="empty"
                />
              </div>
            ) : null
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}

function HeroFrame({
  image,
  priority,
}: {
  image: ProjectImage | undefined;
  priority: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  // A cached image can fire `onLoad` before the browser ever paints the
  // opacity-0 frame, and a transition that never sees its start value just
  // snaps. Waiting two animation frames guarantees opacity 0 is on screen
  // first, so the ramp to 1 actually runs. rAF is starved in a backgrounded
  // tab though, and a hero stuck at opacity 0 is far worse than a missed
  // fade — so a timer releases it regardless.
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPainted(true));
    });
    const fallback = window.setTimeout(() => setPainted(true), 100);
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!image?.url) return null;

  return (
    <Image
      src={image.url}
      alt=""
      fill
      sizes="100vw"
      quality={92}
      // The opening frame is the LCP element, so it gets a <link rel=preload>
      // in the head. Later frames are already warm from the off-screen
      // preloader; they just need to skip lazy-loading. (Next 16 deprecated
      // `priority` in favour of these two — and warns against combining them.)
      {...(priority ? { preload: true } : { loading: "eager" as const })}
      placeholder="empty"
      onLoad={() => setLoaded(true)}
      className="object-cover transition-opacity ease-out"
      style={{
        opacity: loaded && painted ? 1 : 0,
        transitionDuration: `${FADE_MS}ms`,
      }}
    />
  );
}
