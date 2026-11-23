import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import Markdown from "@/components/Markdown";
import PostCard from "@/components/blog/PostCard";
import {
  categoryHref,
  formatDate,
  getPublishedBySlug,
  listPublished,
  readingMinutes,
} from "@/lib/blog";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";

// Posts are rendered on first visit, then cached; publishing refreshes them.
export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const description =
    post.seoDescription || post.excerpt || `${post.title}, from the Atelier Living Group blog.`;
  const base = pageMetadata({
    title: post.title,
    description,
    path: `/blog/${post.slug}`,
    ...(post.coverImage
      ? {
          image: post.coverImage,
          imageWidth: 1600,
          imageHeight: 900,
          imageAlt: post.coverAlt || post.title,
        }
      : {}),
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);
  if (!post) notFound();

  const related = await listPublished({ limit: 3, excludeId: post.id, category: post.category });
  const more =
    related.length >= 3
      ? related
      : [...related, ...(await listPublished({ limit: 6, excludeId: post.id }))]
          .filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i)
          .slice(0, 3);

  const url = abs(`/blog/${post.slug}`);
  const ld = [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.category, path: categoryHref(post.category) },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": url,
      mainEntityOfPage: url,
      headline: post.title,
      description: post.seoDescription || post.excerpt || undefined,
      datePublished: post.publishedAt ?? post.createdAt,
      dateModified: post.updatedAt,
      image: post.coverImage
        ? [post.coverImage.startsWith("http") ? post.coverImage : abs(post.coverImage)]
        : undefined,
      author: { "@type": "Organization", name: "Atelier Living Group" },
      publisher: { "@id": abs("/#business") },
    },
  ];

  return (
    <>
      <JsonLd data={ld} />

      <article>
        <header className="post-head">
          <div className="shell post-head-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog">Blog</Link>
              <span aria-hidden="true">/</span>
              <Link href={categoryHref(post.category)}>{post.category}</Link>
            </nav>
            <p className="post-category">
              <Link href={categoryHref(post.category)}>{post.category}</Link>
            </p>
            <h1>{post.title}</h1>
            {post.excerpt ? <p className="post-standfirst">{post.excerpt}</p> : null}
            <p className="post-meta">
              <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
              <i aria-hidden="true" />
              {readingMinutes(post.content)} min read
              <i aria-hidden="true" />
              Atelier Living Group
            </p>
          </div>
        </header>

        {post.coverImage ? (
          <div className="shell post-cover">
            <div className="post-cover-frame">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || ""}
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1300px"
              />
            </div>
          </div>
        ) : null}

        <div className="shell post-layout">
          <Markdown>{post.content}</Markdown>
        </div>

        <div className="post-foot-wrap">
          <div className="post-foot">
            <Link className="text-link" href="/blog" scroll={false}>
              ← All articles
            </Link>
            <a
              className="text-link"
              href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}`}
            >
              Share by email
            </a>
          </div>
        </div>
      </article>

      {more.length ? (
        <section className="blog-list post-more" aria-label="Keep reading">
          <div className="shell">
            <p className="eyebrow dark">Keep reading</p>
            <h2>More from the blog.</h2>
            <ul className="blog-grid">
              {more.map((item) => (
                <li key={item.id}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ConsultationBand
        eyebrow="Talk to us"
        title="Turn the ideas into a plan."
        copy="Tell us about the residence and how you want to live in it. We will take you through the options and prepare a plan for your space."
      />
    </>
  );
}
