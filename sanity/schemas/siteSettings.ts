import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      type: "text",
      rows: 4,
      description: "Shown under the heading, centered.",
    }),
    defineField({
      name: "heroImages",
      title: "Hero Background Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Background photos behind the mp mark + intro on the home page. One is picked at random on every page load. Upload landscape photos for best results.",
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              type: "image",
              options: { hotspot: true },
              title: "Logo image",
            },
            { name: "name", type: "string", title: "Name" },
            { name: "url", type: "url", title: "Link (optional)" },
            {
              name: "height",
              type: "number",
              title: "Display height (px)",
              description:
                "Per-logo height tuning. Default 48. Try 32–72 to visually balance logos that differ in aspect ratio.",
              validation: (r) => r.min(16).max(120),
              initialValue: 48,
            },
          ],
          preview: {
            select: { title: "name", media: "image" },
          },
        },
      ],
      description:
        "Logos of institutions / clients shown in a horizontal marquee under the intro. Adjust 'Display height' on each logo to visually balance.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      description:
        "Used by the 'email' tab in the footer, which opens a pre-addressed Gmail compose window. Leave blank to fall back to the email on the About page.",
    }),
    defineField({
      name: "socialLinks",
      title: "Footer Links",
      type: "array",
      description:
        "Tabs shown in the footer after 'email', in this order. Labels are lower-cased automatically and get an ↗ to mark them as external.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. linkedin, blog, instagram",
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
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
