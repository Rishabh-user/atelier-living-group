import Image from "next/image";
import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="adm-login">
      <Image
        className="adm-login-logo"
        src="/brand/atelier-logo-on-light.png"
        alt="Atelier Living Group"
        width={1600}
        height={597}
        priority
      />
      <h1>Admin sign in</h1>
      <LoginForm configured={isAdminConfigured()} />
    </div>
  );
}
