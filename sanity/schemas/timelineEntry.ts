import { defineField, defineType, type StringRule } from "sanity";
import { YEAR_MONTH, formatTimelineDate } from "../timeline";

const yearMonthRule = (label: string) => (rule: StringRule) =>
  rule.regex(YEAR_MONTH, {
    name: `${label} must be written as 2025 or 2025-06`,
  });

/**
 * One row of the home-page timeline: a piece of work, the months it ran, and
 * the organisations it was done with. Several organisations on one entry share
 * a single row — the MOLIT and LH briefing was one briefing, not two — and the
 * same organisation is free to appear again on a later entry.
 */
export const timelineEntrySchema = defineType({
  name: "timelineEntry",
  title: "Timeline entry",
  type: "object",
  fields: [
    defineField({
      name: "organisations",
      title: "Organisations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "organisation" }] }],
      description:
        "Whose logos sit on this row. Add two when one piece of work was done with both — they share this row and this description. The same organisation can also appear on other entries.",
      validation: (r) => r.min(1).error("Pick at least one organisation."),
    }),
    defineField({
      name: "start",
      title: "Started",
      type: "string",
      description:
        "Year and month, e.g. 2024-03. A bare year (2024) is allowed but sorts as if it ran to the end of that year.",
      validation: yearMonthRule("Started"),
    }),
    defineField({
      name: "end",
      title: "Ended",
      type: "string",
      description:
        "Year and month, e.g. 2026-02. This is what the timeline sorts on: entries run newest-finished first. Leave blank and tick 'Still ongoing' for work that has not finished.",
      hidden: ({ parent }) => !!parent?.ongoing,
      validation: yearMonthRule("Ended"),
    }),
    defineField({
      name: "ongoing",
      title: "Still ongoing",
      type: "boolean",
      description: "Sorts to the top of the timeline and reads as '– present'.",
      initialValue: false,
    }),
    defineField({
      name: "dateLabel",
      title: "Date label override (optional)",
      type: "string",
      description:
        "Leave blank. The dates above are written out automatically (2024.03 – 2026.02); fill this in only when a row needs to read differently.",
    }),
    defineField({
      name: "description",
      title: "What the work was",
      type: "text",
      rows: 4,
      description:
        "The paragraph shown next to the logos: what you actually did, and what came out of it.",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      description: "description",
      start: "start",
      end: "end",
      ongoing: "ongoing",
      dateLabel: "dateLabel",
      media: "organisations.0.logo",
      org0: "organisations.0.name",
      org1: "organisations.1.name",
    },
    prepare(v) {
      const orgs = [v.org0, v.org1].filter(Boolean).join(" + ");
      const date = formatTimelineDate(v);
      return {
        title: [date, orgs].filter(Boolean).join("  ·  ") || "New entry",
        subtitle: v.description,
        media: v.media,
      };
    },
  },
});
