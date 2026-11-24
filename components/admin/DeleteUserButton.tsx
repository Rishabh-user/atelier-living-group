"use client";

import { useActionState } from "react";

import { deleteUserAction, type FormState } from "@/app/admin/actions";

export default function DeleteUserButton({ id, email }: { id: number; email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(deleteUserAction, {});

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Remove the login for ${email}?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="adm-row-btn adm-danger" disabled={pending}>
        Remove
      </button>
      {state.error ? (
        <p className="adm-inline-error" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
