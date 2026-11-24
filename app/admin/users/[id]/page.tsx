import Link from "next/link";
import { notFound } from "next/navigation";

import UserForm from "@/components/admin/UserForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getUserById, usersAvailable } from "@/lib/admin-users";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const numeric = Number((await params).id);
  if (!Number.isInteger(numeric) || !usersAvailable()) notFound();
  const user = await getUserById(numeric);
  if (!user) notFound();

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow">
            <Link href="/admin/users">Logins</Link> / Password
          </p>
          <h1>{user.email}</h1>
        </div>
      </div>
      <div className="adm-cat-edit">
        <UserForm key={user.id} user={{ id: user.id, email: user.email }} />
      </div>
    </>
  );
}
