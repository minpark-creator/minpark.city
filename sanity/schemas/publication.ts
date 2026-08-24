import { defineField, defineType } from "sanity";

export const publicationSchema = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  description:
    "Peer-reviewed, commissioned, or formally published work. Kept apart from Essays, which are personal writing.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      description: "Shown as the small label above the title.",
      options: {
        list: [
          { title: "Report", value: "Report" },
          { title: "Thesis", value: "Thesis" },
          { title: "Article", value: "Article" },
          { title: "Chapter", value: "Chapter" },
          { title: "Conference paper", value: "Conference paper" },
          { title: "Analysis", value: "Analysis" },
        ],
      },
      initialValue: "Report",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      description: "Displayed year (e.g. 2026 or 2024–2026). Use 'date' for sorting.",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Used when sorting, newest first.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Manual sort. Lower numbers appear first.",
    }),
    defineField({
      name: "venue",
      title: "Publisher / venue",
      type: "string",
      description:
        "Who published or hosted it. e.g. C40 Knowledge Hub, University College London, MPlan Mag.",
    }),
    defineField({
      name: "authors",
      title: "Authors / role",
      type: "string",
      description:
        "e.g. Co-author with C40 Cities, Sole author, Lead researcher. Leave blank if it is sole-authored and obvious.",
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 5,
      description: "Two or three sentences. What it asked, and what it found.",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      description: "e.g. 'full report', 'pdf', 'summary'.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (r) => r.required(),
            },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", kind: "kind", year: "year", venue: "venue" },
    prepare({ title, kind, year, venue }) {
      return {
        title,
        subtitle: [kind, year, venue].filter(Boolean).join(" · "),
      };
    },
  },
});
