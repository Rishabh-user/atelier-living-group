import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import CategoryFilters from "@/components/blog/CategoryFilters";
import PageBanner from "@/components/PageBanner";
import PostGrid from "@/components/blog/PostGrid";
import {
  blogAvailable,
  categoryHref,
  countPublished,
  getCategoryBySlug,
  listCategoriesSafe,
  listPublished,
  slugify,
} from "@/lib/blog";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";

const PER_PAGE = 9;

const banner = [
  {
    src: "/products/modo/modo-p04.jpg",
    alt: "A Poggenpohl +MODO island in warm stone",
  },
  {
    src: "/products/solitaire/solitaire-p01.jpg",
    alt: "A Poggenpohl Solitaire showcase cabinet beside a kitchen island",
  },
  {
    src: "/products/segmento/segmento-p05.jpg",
    alt: "A Poggenpohl +SEGMENTO island in a house of stone and timber",
  },
];


export const metadata: Metadata = pageMetadata({
  title: "Blog | Kitchen Design Ideas and Poggenpohl News",
  description:
    "Ideas on luxury kitchen design, materials, planning and living well, from the Atelier Living Group team in Atlanta.",
  path: "/blog",
});

const ld = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": abs("/blog"),
    name: "Atelier Living Group Blog",
    url: abs("/blog"),
    publisher: { "@id": abs("/#business") },
  },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page: rawPage } = await searchParams;

  // Older links used /blog?category=Materials. Those now live on their own page.
  if (category) {
    const match = await getCategoryBySlug(slugify(category));
    if (match) permanentRedirect(categoryHref(match.name));
  }

  const page = Math.max(1, Number(rawPage) || 1);
  const [total, posts, categories] = await Promise.all([
    countPublished(),
    listPublished({ limit: PER_PAGE, offset: (page - 1) * PER_PAGE }),
    listCategoriesSafe(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <JsonLd data={ld} />

      <PageBanner
        crumb="Blog"
        title="Ideas for the way you live."
        intro="Notes on kitchen design, materials and planning, from the studio and showroom in Buckhead."
        tag="Atelier Living Group Blog"
        shots={banner}
      />

      <nav className="blog-filter-bar" aria-label="Blog categories">
        <div className="shell">
          <CategoryFilters categories={categories} />
        </div>
      </nav>

      <PostGrid
        posts={posts}
        // The newest post leads the first page.
        lead={page === 1 ? posts[0] : undefined}
        page={page}
        pages={pages}
        basePath="/blog"
        empty={
          <div className="blog-empty">
            <h2>
              {blogAvailable() ? "New articles are on the way." : "The blog is coming soon."}
            </h2>
            <p>
              We are preparing our first stories. In the meantime, the showroom is
              the best place to see the work.
            </p>
            <Link className="text-link" href="/showroom" scroll={false}>
              Visit the showroom
            </Link>
          </div>
        }
      />

      <ConsultationBand
        eyebrow="Talk to us"
        title="Have a project in mind?"
        copy="Tell us about the residence and how you want to live in it. We will take you through the options and prepare a plan for your space."
      />
    </>
  );
}
