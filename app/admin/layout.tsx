import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { logout } from "@/app/admin/actions";
import { isAdmin } from "@/lib/admin-auth";

// Never index or cache the dashboard.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isAdmin();

  return (
    <div className="adm">
      {signedIn ? (
        <header className="adm-bar">
          <Link className="adm-brand" href="/admin" aria-label="Atelier Living Group admin">
            <Image
              src="/brand/atelier-logo-on-light.png"
              alt="Atelier Living Group"
              width={1600}
              height={597}
              priority
            />
            <span>Admin</span>
          </Link>
          <nav aria-label="Admin">
            <Link href="/admin">Posts</Link>
            <Link href="/admin/new">New post</Link>
            <Link href="/admin/categories">Categories</Link>
            <Link href="/admin/users">Logins</Link>
            <Link href="/blog" target="_blank">
              View blog ↗
            </Link>
          </nav>
          <form action={logout}>
            <button type="submit" className="adm-row-btn">
              Sign out
            </button>
          </form>
        </header>
      ) : null}
      <div className="adm-wrap">{children}</div>
    </div>
  );
}
