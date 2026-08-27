import { defineField, defineType } from "sanity";

/**
 * One organisation — a logo and a name, nothing more.
 *
 * Organisations are deliberately their own documents rather than rows inside
 * Site Settings, because one organisation takes part in several pieces of
 * work: LH appears once alongside MOLIT on the 2025 policy briefing and again
 * on its own later on. A document can be referenced by as many timeline
 * entries as needed; an array row inside Site Settings could only ever
 * belong to one.
 */
export const organisationSchema = defineType({
  name: "organisation",
  title: "Organisation",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "Full name, e.g. Korea Land and Housing Corporation. Used as the logo's alt text and shown when no logo image is uploaded.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortName",
      title: "Short name",
      type: "string",
      description:
        "Optional abbreviation, e.g. LH. Only used to label this organisation inside Studio, never on the site.",
    }),
    defineField({
      name: "logo",
      title: "Logo image",
      type: "image",
      options: { hotspot: true },
      description: "Transparent PNG or SVG works best.",
    }),
    defineField({
      name: "height",
      title: "Display height (px)",
      type: "number",
      description:
        "Per-logo height tuning. Default 48. Try 32–72 to visually balance logos that differ in aspect ratio.",
      validation: (r) => r.min(16).max(120),
      initialValue: 48,
    }),
    defineField({
      name: "url",
      title: "Link (optional)",
      type: "url",
      description: "Makes the logo clickable in the marquee.",
    }),
    defineField({
      name: "showInMarquee",
      title: "Show in the scrolling logo strip",
      type: "boolean",
      description:
        "On by default. Turn off to keep an organisation in the timeline but out of the strip at the top of the home page.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Marquee order",
      type: "number",
      description:
        "Lower numbers scroll past first. Organisations without a number go last, alphabetically.",
    }),
  ],
  orderings: [
    {
      name: "marquee",
      title: "Marquee order",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "shortName", media: "logo" },
  },
});
