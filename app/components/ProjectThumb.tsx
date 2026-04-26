import Image from "next/image";
import type { ProjectImage } from "../../sanity/queries";

type Props = {
  image?: ProjectImage;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

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
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ backgroundColor: "#efeae2" }}
      aria-label={safeAlt}
    />
  );
}
