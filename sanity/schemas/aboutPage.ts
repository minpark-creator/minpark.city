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
