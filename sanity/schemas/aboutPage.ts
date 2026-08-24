import { defineField, defineType } from "sanity";

export const aboutPageSchema = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "About",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Main biography text.",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      description: "Photo of you, shown alongside the bio.",
    }),
    defineField({
      name: "contactIntro",
      title: "Contact intro",
      type: "text",
      rows: 3,
      description: "Short paragraph above the contact email.",
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "links",
      title: "Contact links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "url", type: "url", title: "URL" },
          ],
        },
      ],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      description:
        "Degrees, newest first. Shown as a dated list under the bio — the thing a PhD panel looks for.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "years",
              type: "string",
              title: "Years",
              description: "e.g. 2023–2024",
            },
            {
              name: "institution",
              type: "string",
              title: "Institution",
              validation: (r) => r.required(),
            },
            {
              name: "degree",
              type: "string",
              title: "Degree",
              description: "e.g. MSc City Planning, BArch Architecture.",
            },
            {
              name: "focus",
              type: "string",
              title: "Focus / result",
              description:
                "e.g. Thesis: green belt governance in London and Seoul (Distinction).",
            },
          ],
          preview: {
            select: { title: "institution", subtitle: "degree" },
          },
        },
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Section title" },
            {
              name: "items",
              type: "array",
              title: "Items",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "year", type: "string", title: "Year" },
                    { name: "text", type: "string", title: "Text" },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
      description:
        "Grouped lists like Exhibitions, Press, Representation.",
    }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
