import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/db/schema";
import { formatDate, readingMinutes } from "@/lib/blog";

/** A post on the blog list and under "Keep reading". */
export default function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <article className="blog-card" data-featured={featured}>
      <Link href={`/blog/${post.slug}`} scroll={false}>
        <span className="blog-card-media">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverAlt ?? ""}
              fill
              sizes={featured ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"}
            />
          ) : (
            <span className="blog-card-blank" aria-hidden="true">
              Atelier
            </span>
          )}
        </span>
        <span className="blog-card-body">
          <span className="blog-card-meta">
            {post.category}
            <i aria-hidden="true" />
            {formatDate(post.publishedAt)}
            <i aria-hidden="true" />
            {readingMinutes(post.content)} min read
          </span>
          <h3>{post.title}</h3>
          {post.excerpt ? <p>{post.excerpt}</p> : null}
          <span className="blog-card-more">Read the article</span>
        </span>
      </Link>
    </article>
  );
}
