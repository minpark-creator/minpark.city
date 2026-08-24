import { projectSchema } from "./project";
import { publicationSchema } from "./publication";
import { siteSettingsSchema } from "./siteSettings";
import { journalEntrySchema } from "./journalEntry";
import { filmSchema } from "./film";
import { aboutPageSchema } from "./aboutPage";

export const schemaTypes = [
  projectSchema,
  publicationSchema,
  siteSettingsSchema,
  aboutPageSchema,
  journalEntrySchema,
  filmSchema,
];
