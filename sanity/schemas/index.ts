import { projectSchema } from "./project";
import { siteSettingsSchema } from "./siteSettings";
import { journalEntrySchema } from "./journalEntry";
import { filmSchema } from "./film";
import { aboutPageSchema } from "./aboutPage";

export const schemaTypes = [
  projectSchema,
  siteSettingsSchema,
  aboutPageSchema,
  journalEntrySchema,
  filmSchema,
];
