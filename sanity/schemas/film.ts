import { defineField, defineType } from "sanity";

export const filmSchema = defineType({
  name: "film",
  title: "Film",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (Vimeo / YouTube / MP4)",
      type: "url",
      description:
        "Recommended — paste a Vimeo or YouTube link for best quality. Or a direct .mp4 URL.",
    }),
    defineField({
      name: "videoFile",
      title: "Video File (upload)",
      type: "file",
      options: { accept: "video/*" },
      description:
        "Alternative to Video URL. Only use for short / small clips; long videos should go on Vimeo.",
    }),
    defineField({
      name: "poster",
      title: "Poster image (thumbnail)",
      type: "image",
      options: { hotspot: true },
      description: "Shown before the video plays. Optional.",
    }),
  ],
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "poster" },
  },
});
