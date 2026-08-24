import type { LogoItem } from "../../sanity/queries";

type Props = {
  logos: LogoItem[];
  heading?: string;
};

type Row = {
  key: string;
  logos: LogoItem[];
  years?: string;
  description: string;
};

/** The last four-digit year mentioned, used to sort rows newest first. */
function lastYear(years?: string) {
  const found = (years ?? "").match(/\d{4}/g);
  return found ? Number(found[found.length - 1]) : 0;
}

/**
 * Logos sharing a `timelineGroup` collapse into one row — a piece of work
 * done for two organisations is one piece of work, not two.
 */
function toRows(logos: LogoItem[]): Row[] {
  const order: string[] = [];
  const groups = new Map<string, LogoItem[]>();

  for (const logo of logos) {
    const key = logo.timelineGroup?.trim() || logo._key || (logo.name ?? "");
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(logo);
  }

  return order
    .map((key) => {
      const members = groups.get(key)!;
      // One description and one date range per row: the first member that
      // carries them wins, so only one logo in a pair needs filling in.
      const described = members.find((m) => m.description?.trim());
      return {
        key,
        logos: members,
        years: members.find((m) => m.years?.trim())?.years,
        description: described?.description?.trim() ?? "",
      };
    })
    .filter((row) => row.description)
    .sort((a, b) => lastYear(b.years) - lastYear(a.years));
}

export default function CollaborationTimeline({ logos, heading }: Props) {
  const rows = toRows(logos ?? []);
  if (rows.length === 0) return null;

  return (
    <section className="pt-10 sm:pt-14">
      {heading && <h2 className="text-[16px] pb-2">{heading}</h2>}

      <ul>
        {rows.map((row) => (
          <li
            key={row.key}
            className="grid grid-cols-12 gap-x-4 sm:gap-x-8 gap-y-3 py-6 sm:py-8 border-t border-black/10"
          >
            <div className="col-span-4 sm:col-span-2 text-[13px] sm:text-[14px] text-muted">
              {row.years}
            </div>

            {/*
              Every logo arrives with its own baked-in whitespace, so equal
              pixel heights still read as ragged. A fixed box with the logo
              centred inside it lines the row up regardless; the per-logo
              Display height then tunes optical weight inside that box.
            */}
            <div className="col-span-8 sm:col-span-3 self-start h-10 sm:h-12 flex flex-wrap items-center gap-x-6 gap-y-3">
              {row.logos.map((logo, i) =>
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
                  <span key={logo._key ?? i} className="text-[15px]">
                    {logo.name}
                  </span>
                )
              )}
            </div>

            <p className="col-span-12 sm:col-span-7 text-[14px] sm:text-[15px] leading-[1.55] max-w-[62ch]">
              {row.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
