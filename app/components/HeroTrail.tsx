"use client";

import { useCallback, useRef, useState } from "react";
import type { ProjectImage } from "../../sanity/queries";

type Shot = { id: number; src: string; x: number; y: number };

type Props = {
  images: ProjectImage[];
  children: React.ReactNode;
};

/** How far the pointer must travel before the next image is laid down. */
const STEP = 110;
/** How long each image stays before it is removed from the DOM. */
const LIFE = 900;
/** How many can be on screen at once. */
const MAX = 12;

/**
 * Dragging the pointer across the statement lays down a trail of photographs,
 * each one appearing where the cursor passed and fading out behind it. The
 * images come from the same Studio field the old hero band used, so nothing
 * new has to be uploaded.
 *
 * Pointer-driven only: on touch there is no hover, so the statement simply
 * stands on its own.
 */
export default function HeroTrail({ images, children }: Props) {
  const [shots, setShots] = useState<Shot[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const seq = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (images.length === 0 || e.pointerType !== "mouse") return;
      const box = wrap.current?.getBoundingClientRect();
      if (!box) return;

      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const prev = last.current;
      if (prev && Math.hypot(x - prev.x, y - prev.y) < STEP) return;
      last.current = { x, y };

      const n = seq.current++;
      const src = images[n % images.length]?.url;
      if (!src) return;

      const shot: Shot = { id: n, src, x, y };
      setShots((s) => [...s, shot].slice(-MAX));
      window.setTimeout(
        () => setShots((s) => s.filter((item) => item.id !== n)),
        LIFE
      );
    },
    [images]
  );

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={() => (last.current = null)}
      className="relative"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {shots.map((shot) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={shot.id}
            src={shot.src}
            alt=""
            className="absolute w-[200px] sm:w-[260px] aspect-[4/3] object-cover rounded-xl trail-shot"
            style={{ left: shot.x, top: shot.y }}
          />
        ))}
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
