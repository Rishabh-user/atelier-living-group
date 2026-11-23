import Link from "next/link";
import { notFound } from "next/navigation";

import CategoryForm from "@/components/admin/CategoryForm";
import { requireAdmin } from "@/lib/admin-auth";
import { blogAvailable, getCategoryById } from "@/lib/blog";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const numeric = Number((await params).id);
  if (!Number.isInteger(numeric) || !blogAvailable()) notFound();
  const category = await getCategoryById(numeric);
  if (!category) notFound();

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow">
            <Link href="/admin/categories">Categories</Link> / Edit
          </p>
          <h1>{category.name}</h1>
        </div>
      </div>
      <div className="adm-cat-edit">
        <CategoryForm
          key={category.id}
          initial={{
            id: category.id,
            name: category.name,
            intro: category.intro,
            description: category.description,
          }}
        />
      </div>
    </>
  );
}
