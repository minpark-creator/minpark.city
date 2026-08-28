import type { LogoItem, TimelineEntry } from "../../sanity/queries";

type Props = {
  entries: TimelineEntry[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
};

/**
 * Every logo arrives with its own baked-in whitespace, so equal pixel heights
 * still read as ragged. A fixed box with the logo centred inside it lines the
 * rows up regardless; the per-logo Display height then tunes optical weight
 * inside that box.
 */
function RowLogos({ logos }: { logos: LogoItem[] }) {
  return (
    <div className="mt-4 h-10 sm:h-12 flex flex-wrap items-center gap-x-6 gap-y-3">
      {logos.map((logo, i) =>
        logo.image?.url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={logo._key ?? i}
            src={logo.image.url}
            alt={logo.name ?? ""}
            style={{
              height: `${Math.max(16, Math.min(120, logo.height ?? 48))}px`,
            }}
            className="w-auto max-h-10 sm:max-h-12 max-w-[150px] object-contain object-left"
            loading="lazy"
          />
        ) : (
          <span key={logo._key ?? i} className="font-display text-[16px] text-brand">
            {logo.name}
          </span>
        )
      )}
    </div>
  );
}

/**
 * The collaboration timeline. Entries arrive already sorted (newest-finished
 * first) and already dated, so this only lays them out.
 */
export default function CollaborationTimeline({
  entries,
  eyebrow,
  heading,
  intro,
}: Props) {
  const rows = entries ?? [];
  if (rows.length === 0) return null;

  return (
    <section className="pt-12 sm:pt-16">
      {eyebrow && <p className="label eyebrow">{eyebrow}</p>}
      {heading && (
        <h2 className="display mt-3 text-[24px] sm:text-[37px]">{heading}</h2>
      )}
      {intro && (
        <p className="mt-5 max-w-[70ch] text-[15px] sm:text-[16px] leading-[1.7] text-muted">
          {intro}
        </p>
      )}

      {/* Each row draws its own length of rail and its own node, both anchored
          to the same left edge, so they cannot drift apart. */}
      <ol className="mt-10 sm:mt-14 pl-16 sm:pl-28">
        {rows.map((row, i) => (
          <li
            key={row._key ?? i}
            className="relative pb-10 sm:pb-14 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute left-[-28px] sm:left-[-40px] top-0 bottom-0 w-px bg-rule"
            />
            <span
              aria-hidden
              className="absolute left-[-28px] sm:left-[-40px] top-[6px] w-[7px] h-[7px] -translate-x-1/2 bg-foreground"
            />

            <div className="grid grid-cols-12 gap-x-4 sm:gap-x-8 gap-y-4">
              <div className="col-span-12 sm:col-span-3">
                <p className="label text-accent-ink">{row.dateText}</p>
                <RowLogos logos={row.logos} />
              </div>

              <p className="col-span-12 sm:col-span-9 text-[15px] sm:text-[16px] leading-[1.7] max-w-[70ch]">
                {row.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
