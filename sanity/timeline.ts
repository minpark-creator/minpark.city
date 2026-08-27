/**
 * Date handling for the collaboration timeline, shared by the Studio schema
 * and the site. Kept free of any `sanity` import so the site can use it
 * without pulling the Studio bundle in.
 *
 * Dates are written as "2025" or "2025-06": a year, optionally narrowed to a
 * month. Month precision exists so the timeline can be ordered by when each
 * piece of work actually finished rather than by which year it happened to
 * touch — two things labelled "2025" are not the same distance in the past.
 */

/** 2024, 2024-03 — a year, optionally narrowed to a month. */
export const YEAR_MONTH = /^\d{4}(-(0[1-9]|1[0-2]))?$/;

export type TimelineDates = {
  start?: string;
  end?: string;
  ongoing?: boolean;
  dateLabel?: string;
};

/** "2025-06" → 24305. A bare year takes the month named by `yearOnly`. */
function monthIndex(value: string | undefined, yearOnly: 1 | 12) {
  if (!value) return null;
  const [y, m] = value.trim().split("-");
  const year = Number(y);
  if (!Number.isFinite(year) || !y) return null;
  const month = Number(m) || yearOnly;
  return year * 12 + month - 1;
}

/**
 * How recently an entry finished, which is what the timeline sorts on.
 * Ongoing work outranks everything finished; an entry with no end falls back
 * to its start so it still lands roughly where it belongs. A bare year counts
 * as December, i.e. "some time in 2025" ranks behind a dated 2025-11.
 */
export function timelineRank(entry: TimelineDates) {
  if (entry.ongoing) return Number.MAX_SAFE_INTEGER;
  return monthIndex(entry.end, 12) ?? monthIndex(entry.start, 12) ?? -1;
}

/** Tie-break: of two things that ended together, the later start is fresher. */
export function timelineStartRank(entry: TimelineDates) {
  return monthIndex(entry.start, 1) ?? monthIndex(entry.end, 1) ?? -1;
}

/** Newest-finished first. */
export function compareTimeline(a: TimelineDates, b: TimelineDates) {
  return (
    timelineRank(b) - timelineRank(a) ||
    timelineStartRank(b) - timelineStartRank(a)
  );
}

/** "2025-06" → "2025.06", "2025" → "2025". */
function formatPoint(value?: string) {
  const [y, m] = (value ?? "").trim().split("-");
  if (!y) return "";
  return m ? `${y}.${m}` : y;
}

/**
 * The date text shown next to the logos. Derived from the same fields the
 * sort uses, so the label and the order can never disagree — unless the
 * editor deliberately overrides it with `dateLabel`.
 */
export function formatTimelineDate(entry: TimelineDates) {
  if (entry.dateLabel?.trim()) return entry.dateLabel.trim();
  const start = formatPoint(entry.start);
  const end = formatPoint(entry.end);
  if (entry.ongoing) return start ? `${start} – present` : "present";
  if (start && end) return start === end ? start : `${start} – ${end}`;
  return start || end;
}
