import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";
import { categoryHref, listCategoriesSafe, listPublished } from "@/lib/blog";

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
  { path: "/poggenpohl/venovo", priority: 0.8 },
  { path: "/media", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/service-areas", priority: 0.6 },
  { path: "/showroom", priority: 0.9 },
  { path: "/our-work", priority: 0.9 },
  { path: "/materials", priority: 0.8 },
  { path: "/catalogue", priority: 0.7 },
  { path: "/blog", priority: 0.7 },
  { path: "/process", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const posts = await listPublished({ limit: 500 });
  const categoryList = await listCategoriesSafe();

  const pages = routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority,
  }));

  const categories = categoryList.map(({ name }) => ({
    url: `${siteUrl}${categoryHref(name)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const articles = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...categories, ...articles];
}
