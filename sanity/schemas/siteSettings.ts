import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title Prefix",
      type: "string",
      description: "Shown before the cycling word (e.g. 'minpark.')",
      initialValue: "minpark.",
    }),
    defineField({
      name: "words",
      title: "Cycling Words",
      type: "array",
      of: [{ type: "string" }],
      description:
        "List of words that cycle after the title prefix (e.g. city, design, research).",
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      type: "text",
      rows: 4,
      description: "Shown under the heading, centered.",
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
      name: "heroVideoUrl",
      title: "Hero Video URL (Vimeo / YouTube / MP4)",
      type: "url",
      description:
        "If set, this plays below the intro. Vimeo / YouTube embed URLs work, or a direct .mp4 link. Prefer Vimeo for best quality.",
    }),
    defineField({
      name: "heroVideoFile",
      title: "Hero Video File (upload)",
      type: "file",
      options: { accept: "video/*" },
      description:
        "Alternative to Hero Video URL. Direct upload (smaller files only — use Vimeo link above for high quality long videos).",
    }),
    defineField({
      name: "heroPoster",
      title: "Hero Poster Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Still frame shown (with a blur-up) while the hero video loads. Use a 16:9 frame from the video.",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Site Settings" };
    },
  },
});
