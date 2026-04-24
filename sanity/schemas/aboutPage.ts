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
