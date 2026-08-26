import { defineField, defineType } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      description: "Used for the URL: /works/<slug>.",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      description: "Displayed year (e.g. 2026). Use 'date' for sorting.",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Used when sorting by date.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Manual sort. Lower numbers appear first.",
    }),
    defineField({
      name: "client",
      title: "As part of",
      type: "string",
      description: "Affiliation or commissioning body. e.g. C40 Cities, Academic work, Holcim Foundation.",
    }),
    defineField({
      name: "partners",
      title: "In partnership with",
      type: "string",
      description: "Collaborators or partner organisations.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. London (Stratford), Riyadh, Seoul.",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. Lead researcher, Urban strategist.",
    }),
    defineField({
      name: "summary",
      title: "Summary (unused)",
      type: "text",
      rows: 3,
      description:
        "Not shown anywhere on the site. The home page lists role / affiliation / year, and the lightbox shows Body. Kept so existing text isn't lost.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 10,
      description: "Long-form project description. Paragraphs separated by blank lines.",
    }),
    defineField({
      name: "links",
      title: "External Links",
      type: "array",
      description:
        "Optional links shown on the main page as '<label> here →'.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Link name shown in '<label> here →', lower-cased automatically. e.g. 'full report', 'linkedin post'.",
              validation: (r) => r.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (r) => r.required(),
            },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Images & Videos",
      type: "array",
      description:
        "Each item is an image, optionally with a video. The image acts as the thumbnail/poster; if a video is set, the lightbox plays it muted on loop.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt text" },
            {
              name: "video",
              title: "Video (optional)",
              type: "file",
              options: { accept: "video/*" },
              description:
                "If set, the lightbox plays this video in place of the image. The image is used as the poster + thumbnail.",
            },
          ],
        },
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "featured",
      title: "Featured image numbers",
      type: "array",
      of: [{ type: "number" }],
      description:
        "1-based image numbers used for thumbnails. e.g. [6, 3, 5] uses image 6 as the project cover, and Selected shows 6, 3, 5 in that order. Leave empty to fall back to images 1, 2, 3.",
      validation: (r) => r.unique(),
    }),
    defineField({
      name: "track",
      title: "Track",
      type: "string",
      description:
        "Groups the project on the home page and on Work. Research first, then Planning & Design, Editorial & Events, Built Work. Leave blank and it lands under 'Other'.",
      options: {
        list: [
          { title: "Research", value: "research" },
          { title: "Planning & Design", value: "planning" },
          { title: "Editorial & Events", value: "editorial" },
          { title: "Built Work", value: "built" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "isSelected",
      title: "Show in Featured",
      type: "boolean",
      description:
        "When on, this project appears in Featured Projects on the home page.",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      client: "client",
      selected: "isSelected",
      media: "images.0",
    },
    prepare({ title, year, client, selected, media }) {
      const parts = [year, client].filter(Boolean).join(" · ");
      return {
        title,
        subtitle: `${parts}${selected ? "  ★" : ""}`,
        media,
      };
    },
  },
});
