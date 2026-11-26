import Link from "next/link";
import { notFound } from "next/navigation";

import PostEditor from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin-auth";
import { blogAvailable, getById, listCategoriesSafe } from "@/lib/blog";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;

  const numeric = Number(id);
  if (!Number.isInteger(numeric) || !blogAvailable()) notFound();
  const post = await getById(numeric);
  if (!post) notFound();
  const categories = (await listCategoriesSafe()).map((item) => item.name);
  // A post keeps its category even if the list no longer has it.
  if (post.category && !categories.includes(post.category)) categories.push(post.category);

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow">
            <Link href="/admin">Posts</Link> / Edit
          </p>
          <h1>{post.title}</h1>
        </div>
      </div>
      <PostEditor
        // Remount when the post changes so the fields reset.
        key={`${post.id}-${post.updatedAt}`}
        categories={categories}
        saved={saved}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? "",
          coverAlt: post.coverAlt ?? "",
          category: post.category,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          status: post.status === "published" ? "published" : "draft",
        }}
      />
    </>
  );
}
