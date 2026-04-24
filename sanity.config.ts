"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "minpark.city",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("About Page")
              .child(
                S.document().schemaType("aboutPage").documentId("aboutPage")
              ),
            S.listItem()
              .title("Contact Page")
              .child(
                S.document().schemaType("contactPage").documentId("contactPage")
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("journalEntry").title("Journal"),
            S.documentTypeListItem("film").title("Films"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
