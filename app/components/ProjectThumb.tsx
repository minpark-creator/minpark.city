"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectImage } from "../../sanity/queries";

type Props = {
  image?: ProjectImage;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

/**
 * Project thumbnail. Renders next/image with an LQIP blur placeholder
 * underneath, then on `onLoad` eases the sharp image in with a small
 * slide-up — a "fade + reveal" rather than a hard pop. The blur stays
 * visible during the swap so there's no flash of empty box.
 */
export default function ProjectThumb({
  image,
  alt,
  className = "",
  // Default sizes assume the gallery grid: up to 4 columns inside a 1200px
  // container, so a single tile is ~25vw on large screens. We let the browser
  // pick the largest matching srcset entry, then up the JPEG quality so the
  // 2× DPR rendering looks crisp.
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
  quality = 92,
}: Props) {
  const src = image?.url ?? null;
  const safeAlt = image?.alt || alt;
  const [loaded, setLoaded] = useState(false);

  if (src) {
    return (
      <Image
        src={src}
        alt={safeAlt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={image?.lqip ? "blur" : "empty"}
        blurDataURL={image?.lqip ?? undefined}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-all duration-700 ease-out ${className}`}
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(6px)",
        }}
      />
    );
  }

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ backgroundColor: "transparent" }}
      aria-label={safeAlt}
    />
  );
}
