import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

/**
 * Generated rather than kept as a static file so the origin always matches
 * NEXT_PUBLIC_SITE_URL. The previous public/sitemap.xml carried a preview host
 * literally, which pointed every indexed URL at the wrong domain.
 */
const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/poggenpohl", priority: 0.9 },
  { path: "/poggenpohl/taglio", priority: 0.8 },
  { path: "/poggenpohl/alvolo", priority: 0.8 },
  { path: "/poggenpohl/solitaire", priority: 0.8 },
  { path: "/poggenpohl/modo", priority: 0.8 },
  { path: "/poggenpohl/segmento", priority: 0.8 },
  { path: "/showroom", priority: 0.9 },
  { path: "/process", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}
