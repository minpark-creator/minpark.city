import type { MetadataRoute } from "next";

/**
 * Everything is public except the Studio, which is behind auth anyway and has
 * nothing a search engine should hold.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/studio" },
    sitemap: "https://minpark.city/sitemap.xml",
  };
}
