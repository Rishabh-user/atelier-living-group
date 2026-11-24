"use client";

import { useActionState } from "react";
import Link from "next/link";

import { saveUserAction, type FormState } from "@/app/admin/actions";

/** Add a login, or set a new password for one when `user` is given. */
export default function UserForm({ user }: { user?: { id: number; email: string } }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveUserAction, {});
  const editing = Boolean(user);

  return (
    <form action={action} className="adm-card adm-cat-form">
      <h2>{editing ? "Set a new password" : "Add a login"}</h2>

      {state.error ? (
        <p className="adm-flash adm-flash-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {user ? <input type="hidden" name="id" value={user.id} /> : null}

      {editing && user ? (
        <p className="adm-muted">
          For <strong>{user.email}</strong>
        </p>
      ) : (
        <label className="adm-field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            defaultValue={state.email}
            autoComplete="off"
            required
            placeholder="name@atelierlivinggroup.com"
          />
        </label>
      )}

      <label className="adm-field">
        <span>{editing ? "New password" : "Password"}</span>
        <input type="password" name="password" autoComplete="new-password" minLength={10} required />
        <small className="adm-muted">At least 10 characters.</small>
      </label>

      <label className="adm-field">
        <span>Repeat the password</span>
        <input type="password" name="confirm" autoComplete="new-password" minLength={10} required />
      </label>

      <div className="adm-row-actions adm-row-left">
        <button className="adm-btn adm-btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : editing ? "Save password" : "Add login"}
        </button>
        {editing ? (
          <Link className="adm-btn" href="/admin/users">
            Cancel
          </Link>
        ) : null}
      </div>
    </form>
  );
}
