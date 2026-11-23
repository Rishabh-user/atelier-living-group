import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import CategoryFilters from "@/components/blog/CategoryFilters";
import PageBanner from "@/components/PageBanner";
import PostGrid from "@/components/blog/PostGrid";
import {
  categoryCopy,
  categoryHref,
  countPublished,
  getCategoryBySlug,
  listCategoriesSafe,
  listPublished,
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


export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const found = await getCategoryBySlug((await params).category);
  if (!found) return { title: "Category not found", robots: { index: false } };
  return pageMetadata({
    title: `${found.name} | Blog`,
    description: categoryCopy(found).description,
    path: categoryHref(found.name),
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const found = await getCategoryBySlug((await params).category);
  if (!found) notFound();

  const name = found.name;
  const info = categoryCopy(found);
  const categories = await listCategoriesSafe();
  const page = Math.max(1, Number((await searchParams).page) || 1);

  const [total, posts] = await Promise.all([
    countPublished(name),
    listPublished({ category: name, limit: PER_PAGE, offset: (page - 1) * PER_PAGE }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const path = categoryHref(name);

  const ld = [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": abs(path),
      name: `${name} | Atelier Living Group Blog`,
      description: info.description,
      url: abs(path),
      isPartOf: { "@id": abs("/blog") },
    },
  ];

  return (
    <>
      <JsonLd data={ld} />

      <PageBanner
        crumb={name}
        trail={[{ label: "Blog", href: "/blog" }]}
        title={name}
        intro={info.intro}
        tag={`Blog \u00b7 ${total} ${total === 1 ? "article" : "articles"}`}
        shots={banner}
      />

      <nav className="blog-filter-bar" aria-label="Blog categories">
        <div className="shell">
          <CategoryFilters categories={categories} current={name} />
        </div>
      </nav>

      <PostGrid
        posts={posts}
        lead={page === 1 && posts.length > 2 ? posts[0] : undefined}
        page={page}
        pages={pages}
        basePath={path}
        empty={
          <div className="blog-empty">
            <h2>No {name.toLowerCase()} articles yet.</h2>
            <p>New articles are added regularly. Browse everything in the meantime.</p>
            <Link className="text-link" href="/blog" scroll={false}>
              See all articles
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
