"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * The public header and footer frame every page except the admin, which has
 * its own bar and should not show the marketing site around it.
 */
export default function SiteChrome({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {admin ? null : nav}
      <main id="main">{children}</main>
      {admin ? null : footer}
    </>
  );
}
