import { projectSchema } from "./project";
import { publicationSchema } from "./publication";
import { siteSettingsSchema } from "./siteSettings";
import { filmSchema } from "./film";
import { aboutPageSchema } from "./aboutPage";
import { pageHeaderSchema, pageIntrosSchema } from "./pageIntros";

export const schemaTypes = [
  projectSchema,
  publicationSchema,
  siteSettingsSchema,
  aboutPageSchema,
  pageIntrosSchema,
  pageHeaderSchema,
  filmSchema,
];
