import Image from "next/image";
import type { ProjectImage } from "../../sanity/queries";

type Props = {
  image?: ProjectImage;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function ProjectThumb({
  image,
  alt,
  className = "",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px",
  priority = false,
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
