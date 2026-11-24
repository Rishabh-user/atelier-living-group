import Link from "next/link";

import DeleteUserButton from "@/components/admin/DeleteUserButton";
import UserForm from "@/components/admin/UserForm";
import { currentAdminId, requireAdmin } from "@/lib/admin-auth";
import { describeError } from "@/lib/describe-error";
import { listUsers, usersAvailable } from "@/lib/admin-users";
import { formatDate } from "@/lib/blog";

const FLASH: Record<string, string> = {
  created: "Login added.",
  password: "Password changed.",
  deleted: "Login removed.",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;

  if (!usersAvailable()) {
    return (
      <div className="adm-card adm-empty">
        <h1>Connect a database</h1>
        <p>
          Logins are stored in your Turso database. Set <code>TURSO_DATABASE_URL</code> and{" "}
          <code>TURSO_AUTH_TOKEN</code> in the environment, then restart.
        </p>
      </div>
    );
  }

  const me = await currentAdminId();
  let users: Awaited<ReturnType<typeof listUsers>> = [];
  let failure: string | null = null;
  try {
    users = await listUsers();
  } catch (error) {
    console.error("admin: could not list logins", error);
    const reason = describeError(error);
    failure = `The database could not be reached.${reason ? ` Reason: ${reason}` : ""}`;
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow">Admin</p>
          <h1>Logins</h1>
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
                <th>Email</th>
                <th>Added</th>
                <th>Last sign-in</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <span className="adm-muted">No logins yet. Add one to the right.</span>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong className="adm-post-title">{user.email}</strong>
                      {user.id === me ? <small>You</small> : null}
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}</td>
                    <td>
                      <div className="adm-row-actions">
                        <Link className="adm-row-btn" href={`/admin/users/${user.id}`}>
                          Password
                        </Link>
                        {user.id !== me ? <DeleteUserButton id={user.id} email={user.email} /> : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <UserForm />
      </div>
    </>
  );
}
