import { defineField, defineType } from "sanity";

/**
 * The header of every inner page: the small uppercase label, the big title,
 * and the short line of prose under it. Reused five times by `pageIntros`.
 */
export const pageHeaderSchema = defineType({
  name: "pageHeader",
  title: "Page header",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "eyebrow",
      title: "Label above the title",
      type: "string",
      description:
        "Small uppercase line above the title. On Projects and Publications, leaving this blank shows the number of entries instead.",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The big heading. Leave blank to keep the current one.",
    }),
    defineField({
      name: "intro",
      title: "Description under the title",
      type: "text",
      rows: 3,
      description:
        "The short paragraph under the heading. What you type here is exactly what the page shows; clear it and the line disappears.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "intro" } },
});

export const pageIntrosSchema = defineType({
  name: "pageIntros",
  title: "Page Intros",
  type: "document",
  description:
    "The heading and the short description at the top of each inner page.",
  fields: [
    defineField({
      name: "work",
      title: "Projects page",
      type: "pageHeader",
      initialValue: {
        eyebrow: "",
        title: "Projects",
        intro:
          "Research, planning and design, the magazine, and the things that got built. Filter by what the work produced.",
      },
    }),
    defineField({
      name: "film",
      title: "Observations page",
      type: "pageHeader",
      initialValue: {
        eyebrow: "Field recordings",
        title: "Observations",
        intro:
          "A collection of moving images and observations exploring how people use and inhabit public space.",
      },
    }),
    defineField({
      name: "publications",
      title: "Publications page",
      type: "pageHeader",
      initialValue: {
        eyebrow: "",
        title: "Publications",
        intro:
          "Commissioned reports, dissertations and articles.",
      },
    }),
    defineField({
      name: "about",
      title: "About page",
      type: "pageHeader",
      initialValue: {
        eyebrow: "Who this is",
        title: "About",
        intro: "",
      },
    }),
  ],
  preview: { prepare: () => ({ title: "Page Intros" }) },
});
