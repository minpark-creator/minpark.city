import type { MetadataRoute } from "next";
import { getProjects } from "../sanity/queries";

const BASE = "https://minpark.city";

/**
 * Every page a visitor can reach, including one entry per project now that
 * projects have their own URLs. Regenerated on the same 60s window the pages
 * themselves use, so a project added in Studio shows up without a deploy.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/publications`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/film`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...staticPages, ...projectPages];
}
