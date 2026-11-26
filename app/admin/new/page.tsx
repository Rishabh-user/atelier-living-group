import Link from "next/link";

import PostEditor from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin-auth";
import { listCategoriesSafe } from "@/lib/blog";

export default async function NewPostPage() {
  await requireAdmin();
  const categories = (await listCategoriesSafe()).map((item) => item.name);

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow">
            <Link href="/admin">Posts</Link> / New
          </p>
          <h1>New post</h1>
        </div>
      </div>
      <PostEditor
        categories={categories}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverImage: "",
          coverAlt: "",
          category: "",
          seoTitle: "",
          seoDescription: "",
          status: "draft",
        }}
      />
    </>
  );
}
