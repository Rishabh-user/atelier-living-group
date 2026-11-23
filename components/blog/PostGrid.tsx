import Link from "next/link";

import PostCard from "@/components/blog/PostCard";
import Reveal from "@/components/Reveal";
import type { Post } from "@/db/schema";

/**
 * The article list shared by the blog and the category pages: an optional lead
 * post, a grid, and newer / older links.
 */
export default function PostGrid({
  posts,
  lead,
  page,
  pages,
  basePath,
  empty,
}: {
  posts: Post[];
  /** Shown large above the grid. Must be one of `posts`. */
  lead?: Post;
  page: number;
  pages: number;
  basePath: string;
  empty: React.ReactNode;
}) {
  const rest = lead ? posts.filter((post) => post.id !== lead.id) : posts;
  const href = (n: number) => (n > 1 ? `${basePath}?page=${n}` : basePath);

  return (
    <section className="blog-list" aria-label="Articles">
      <div className="shell">
        {posts.length === 0 ? (
          empty
        ) : (
          <>
            {lead ? (
              <Reveal>
                <PostCard post={lead} featured />
              </Reveal>
            ) : null}
            {rest.length ? (
              <ul className="blog-grid">
                {rest.map((post, i) => (
                  <Reveal as="li" key={post.id} delay={(i % 3) * 80}>
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </ul>
            ) : null}
          </>
        )}

        {pages > 1 ? (
          <nav className="blog-pager" aria-label="Pages">
            {page > 1 ? (
              <Link href={href(page - 1)} scroll={false}>
                ← Newer
              </Link>
            ) : (
              <span />
            )}
            <span>
              Page {page} of {pages}
            </span>
            {page < pages ? (
              <Link href={href(page + 1)} scroll={false}>
                Older →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
