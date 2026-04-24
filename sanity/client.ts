import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, projectId, hasSanity } from "./env";

export const client = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = hasSanity
  ? imageUrlBuilder({ projectId, dataset })
  : null;

export function urlFor(source: unknown) {
  if (!builder || !source) return null;
  return builder.image(source as never);
}
