/**
 * One taxonomy, used by both the home page groups and the Work index.
 *
 * The order is the argument: evidence-producing work first, spatial proposals
 * second, the magazine third, things physically built last. It keeps the
 * design work visible without letting it introduce her.
 */
export const TRACKS = [
  {
    key: "research",
    label: "Research",
    blurb:
      "Policy research, comparative studies and appraisals: work whose output is evidence.",
  },
  {
    key: "planning",
    label: "Planning & Design",
    blurb:
      "Masterplans, strategies and spatial proposals, from the regional scale down to the block.",
  },
  {
    key: "editorial",
    label: "Editorial & Events",
    blurb: "MPLAN Mag, and the workshops and launches around it.",
  },
  {
    key: "built",
    label: "Built Work",
    blurb: "Things that got made at full size.",
  },
] as const;

export type TrackKey = (typeof TRACKS)[number]["key"];

/** Groups projects by track, in TRACKS order, dropping empty groups. */
export function groupByTrack<T extends { track?: string }>(items: T[]) {
  const groups = TRACKS.map(({ key, label, blurb }) => ({
    key,
    label,
    blurb,
    items: items.filter((p) => (p.track ?? "") === key),
  }));

  const untracked = items.filter(
    (p) => !TRACKS.some((t) => t.key === (p.track ?? ""))
  );
  if (untracked.length > 0) {
    groups.push({
      key: "other" as never,
      label: "Other" as never,
      blurb: "" as never,
      items: untracked,
    });
  }

  return groups.filter((g) => g.items.length > 0);
}
