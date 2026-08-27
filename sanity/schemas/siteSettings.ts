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
            {
              name: "timelineGroup",
              type: "string",
              title: "Timeline group",
              description:
                "Give two logos the same word here (e.g. 'greenbelts') and they share one row in the timeline, with one description between them. Leave blank for a row of its own.",
            },
            {
              name: "years",
              type: "string",
              title: "Years",
              description:
                "e.g. 2024–2026, or 2025. Shown in the timeline under the logo strip.",
            },
            {
              name: "description",
              type: "text",
              rows: 3,
              title: "What the work was",
              description:
                "The paragraph shown next to this logo in the home-page timeline: what you actually did with them, and what came out of it. Leave blank to keep the organisation out of the timeline.",
            },
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
            select: { title: "name", subtitle: "years", media: "image" },
          },
        },
      ],
      description:
        "Logos of the organisations you have been paid or selected to work with, shown in a horizontal marquee under the intro. Fill in 'Years' and 'What the work was'; those two feed the timeline underneath. Adjust 'Display height' to visually balance.",
    }),
    defineField({
      name: "logosEyebrow",
      title: "Timeline: small line above the heading",
      type: "string",
      description:
        "The little uppercase line above the timeline heading on the home page.",
      initialValue: "Since 2023",
    }),
    defineField({
      name: "logosNote",
      title: "Timeline: heading",
      type: "string",
      description:
        "The big heading above the collaboration timeline on the home page.",
      initialValue: "Professional Collaborations",
    }),
    defineField({
      name: "logosIntro",
      title: "Timeline: description under the heading",
      type: "text",
      rows: 3,
      description:
        "Optional paragraph between the heading and the first row. Leave blank to omit it.",
    }),
    defineField({
      name: "cv",
      title: "CV (PDF)",
      type: "file",
      options: { accept: ".pdf" },
      description:
        "Upload your CV. When set, a 'cv' tab appears in the footer. Re-upload to replace it; the link never changes.",
    }),
    defineField({
      name: "footerName",
      title: "Footer: name",
      type: "string",
      description: "First line of the footer address block.",
      initialValue: "Min Park",
    }),
    defineField({
      name: "location",
      title: "Footer: location",
      type: "string",
      description: "e.g. London, UK. Shown under the name in the footer.",
    }),
    defineField({
      name: "origin",
      title: "Footer: origin",
      type: "string",
      description: "e.g. From Seoul, South Korea.",
    }),
    defineField({
      name: "availability",
      title: "Footer: availability",
      type: "string",
      description:
        "One line on where you would consider working. e.g. Could be anywhere.",
    }),
    defineField({
      name: "contactNote",
      title: "Footer: contact note",
      type: "string",
      description: "Short line under the email. e.g. Email reaches me fastest.",
    }),
    defineField({
      name: "phone",
      title: "Footer: phone (optional)",
      type: "string",
      description:
        "Shown under the email. Leave blank to omit it.",
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
