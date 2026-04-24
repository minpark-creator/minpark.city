import type { ProjectImage } from "../../sanity/queries";

type Props = {
  image?: ProjectImage;
  alt: string;
  className?: string;
};

export default function ProjectThumb({ image, alt, className = "" }: Props) {
  const src = image?.url ?? null;
  const safeAlt = image?.alt || alt;

  if (src) {
    return (
      <img
        src={src}
        alt={safeAlt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
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
