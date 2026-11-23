import Link from "next/link";

import CategoryForm from "@/components/admin/CategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import { requireAdmin } from "@/lib/admin-auth";
import { blogAvailable, categoryHref, listCategoriesWithCounts } from "@/lib/blog";

const FLASH: Record<string, string> = {
  created: "Category added.",
  updated: "Category saved.",
  deleted: "Category deleted.",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;

  if (!blogAvailable()) {
    return (
      <div className="adm-card adm-empty">
        <h1>Connect a database</h1>
        <p>
          Categories are stored in your Turso database. Set <code>TURSO_DATABASE_URL</code>{" "}
          in the environment, then restart.
        </p>
      </div>
    );
  }

  let rows: Awaited<ReturnType<typeof listCategoriesWithCounts>> = [];
  let failure: string | null = null;
  try {
    rows = await listCategoriesWithCounts();
  } catch (error) {
    console.error("admin: could not list categories", error);
    failure = "The database could not be reached.";
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow">Blog</p>
          <h1>Categories</h1>
        </div>
      </div>

      {saved && FLASH[saved] ? (
        <p className="adm-flash" role="status">
          {FLASH[saved]}
        </p>
      ) : null}
      {failure ? (
        <p className="adm-flash adm-flash-error" role="alert">
          {failure}
        </p>
      ) : null}

      <div className="adm-cat-layout">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Posts</th>
                <th>Page</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <span className="adm-muted">
                      No categories yet. Add one to start sorting posts.
                    </span>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/categories/${row.id}`} className="adm-post-title">
                        {row.name}
                      </Link>
                      {row.intro ? <small>{row.intro}</small> : null}
                    </td>
                    <td>
                      {row.total}
                      {row.total !== row.published ? (
                        <small> ({row.published} published)</small>
                      ) : null}
                    </td>
                    <td>
                      <Link
                        className="adm-link"
                        href={categoryHref(row.name)}
                        target="_blank"
                      >
                        {categoryHref(row.name)}
                      </Link>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <Link className="adm-row-btn" href={`/admin/categories/${row.id}`}>
                          Edit
                        </Link>
                        <DeleteCategoryButton id={row.id} name={row.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <CategoryForm />
      </div>
    </>
  );
}
