import type { LogoItem } from "../../sanity/queries";

type Props = {
  logos: LogoItem[];
};

function LogoTile({ item }: { item: LogoItem }) {
  const hasImage = !!item.image?.url;
  const h = Math.max(16, Math.min(120, item.height ?? 48));
  const content = hasImage ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={item.image!.url as string}
      alt={item.name ?? ""}
      style={{ height: `${h}px`, width: "auto" }}
      className="object-contain max-w-[180px]"
      loading="lazy"
    />
  ) : (
    <span className="text-[13px] text-muted font-medium whitespace-nowrap">
      {item.name ?? ""}
    </span>
  );

  const tileClass =
    "shrink-0 inline-flex items-center justify-center h-20 sm:h-24 w-[160px] sm:w-[200px] lg:w-[220px]";

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={tileClass}
      >
        {content}
      </a>
    );
  }
  return <span className={tileClass}>{content}</span>;
}

export default function LogoMarquee({ logos }: Props) {
  if (!logos || logos.length === 0) return null;
  const doubled = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden py-8 sm:py-10 select-none mt-8 sm:mt-12">
      <div
        className="flex items-center marquee-track"
        style={{ width: "max-content" }}
      >
        {doubled.map((logo, i) => (
          <LogoTile key={`${logo._key ?? logo.name ?? ""}-${i}`} item={logo} />
        ))}
      </div>
    </div>
  );
}
