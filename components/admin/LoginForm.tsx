"use client";

import { useActionState } from "react";

import { login, type FormState } from "@/app/admin/actions";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});

  return (
    <form action={action} className="adm-login-form">
      {!configured ? (
        <p className="adm-flash adm-flash-error" role="alert">
          The admin is not set up yet. Add <code>ADMIN_SESSION_SECRET</code> (24+
          characters) to the environment, then restart.
        </p>
      ) : null}
      {state.error ? (
        <p className="adm-flash adm-flash-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <label className="adm-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          defaultValue={state.email}
          required
        />
      </label>
      <label className="adm-field">
        <span>Password</span>
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      <button className="adm-btn adm-btn-primary" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
