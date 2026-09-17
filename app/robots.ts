import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

/** Generated so the Sitemap line tracks the configured origin. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to index behind the form endpoint.
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
