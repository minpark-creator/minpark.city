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
      name: "timeline",
      title: "Timeline",
      type: "array",
      of: [{ type: "timelineEntry" }],
      description:
        "The collaboration timeline on the home page, one entry per piece of work. Order here does not matter — the site sorts entries by when they finished, newest first. Add the organisations under 'Organisations' first; each entry then points at one or more of them, and an organisation may appear on as many entries as it needs to.",
    }),
    defineField({
      name: "logos",
      title: "Logos (old, replaced by Organisations)",
      type: "array",
      readOnly: true,
      hidden: ({ value }) => !Array.isArray(value) || value.length === 0,
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
            { name: "timelineGroup", type: "string", title: "Timeline group" },
            { name: "years", type: "string", title: "Years" },
            {
              name: "description",
              type: "text",
              rows: 3,
              title: "What the work was",
            },
            { name: "url", type: "url", title: "Link (optional)" },
            { name: "height", type: "number", title: "Display height (px)" },
          ],
          preview: {
            select: { title: "name", subtitle: "years", media: "image" },
          },
        },
      ],
      description:
        "Kept only so nothing typed here is lost. Logos now live as their own Organisation documents and the copy lives in Timeline above, which is what the site reads. Once the timeline reads correctly this list can be emptied.",
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
