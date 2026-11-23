import Link from "next/link";

import { setStatusAction } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { requireAdmin } from "@/lib/admin-auth";
import { blogAvailable, formatDate, listAll } from "@/lib/blog";

export default async function AdminHome() {
  await requireAdmin();

  if (!blogAvailable()) {
    return (
      <div className="adm-card adm-empty">
        <h1>Connect a database</h1>
        <p>
          Posts are stored in your Turso database. Set <code>TURSO_DATABASE_URL</code>{" "}
          (and <code>TURSO_AUTH_TOKEN</code> for a remote database) in the
          environment, then restart. For local work, <code>file:./local.db</code> is
          enough.
        </p>
      </div>
    );
  }

  let posts: Awaited<ReturnType<typeof listAll>> = [];
  let failure: string | null = null;
  try {
    posts = await listAll();
  } catch (error) {
    console.error("admin: could not list posts", error);
    failure = "The database could not be reached. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.";
  }

  const published = posts.filter((p) => p.status === "published").length;

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow">Blog</p>
          <h1>Posts</h1>
        </div>
        <Link className="adm-btn adm-btn-primary" href="/admin/new">
          New post
        </Link>
      </div>

      {failure ? (
        <p className="adm-flash adm-flash-error" role="alert">
          {failure}
        </p>
      ) : null}

      <ul className="adm-stats">
        <li>
          <strong>{posts.length}</strong>
          <span>Total</span>
        </li>
        <li>
          <strong>{published}</strong>
          <span>Published</span>
        </li>
        <li>
          <strong>{posts.length - published}</strong>
          <span>Drafts</span>
        </li>
      </ul>

      {posts.length === 0 && !failure ? (
        <div className="adm-card adm-empty">
          <h2>No posts yet</h2>
          <p>Write your first post. Drafts stay private until you publish them.</p>
          <Link className="adm-btn adm-btn-primary" href="/admin/new">
            Write a post
          </Link>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/${post.id}`} className="adm-post-title">
                      {post.title}
                    </Link>
                    <small>/blog/{post.slug}</small>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <span className="adm-badge" data-status={post.status}>
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{formatDate(post.updatedAt)}</td>
                  <td>
                    <div className="adm-row-actions">
                      <Link className="adm-row-btn" href={`/admin/${post.id}`}>
                        Edit
                      </Link>
                      {post.status === "published" ? (
                        <Link
                          className="adm-row-btn"
                          href={`/blog/${post.slug}`}
                          target="_blank"
                        >
                          View
                        </Link>
                      ) : null}
                      <form action={setStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={post.status === "published" ? "draft" : "published"}
                        />
                        <button type="submit" className="adm-row-btn">
                          {post.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <DeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
