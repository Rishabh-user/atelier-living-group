import type { Metadata } from "next";

import { siteUrl } from "@/content/site";

/**
 * Per-page metadata builder.
 *
 * Every page previously set only title/description/canonical, so all five
 * inner pages inherited the homepage's Open Graph card: a link to /showroom
 * shared on social read as the homepage. This keeps the canonical, the OG URL
 * and the Twitter card in step from one call.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = "/og.png",
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt = "Atelier Living Group — luxury German kitchens in Atlanta",
}: {
  /** Page title without the site-name suffix; the layout template adds it. */
  title: string;
  description: string;
  /** Route path with a leading slash, e.g. "/showroom". */
  path: string;
  image?: string;
  /** Must match the file. Social cards crop to the dimensions declared here,
   *  so a portrait photo described as 1200x630 renders badly. */
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const images = [
    { url: image, width: imageWidth, height: imageHeight, alt: imageAlt },
  ];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Atelier Living Group",
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Absolute URL for a public asset or route, for use inside JSON-LD. */
export const abs = (path: string) => `${siteUrl}${path}`;

type Crumb = { name: string; path: string };

/**
 * BreadcrumbList matching the visible "Home / Page" trail in PageBanner.
 * Google renders these in the results snippet in place of the bare URL.
 */
export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}
