"use client";

import { useActionState } from "react";

import { deleteCategoryAction, type FormState } from "@/app/admin/actions";

export default function DeleteCategoryButton({ id, name }: { id: number; name: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(deleteCategoryAction, {});

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the category "${name}"?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="adm-row-btn adm-danger" disabled={pending}>
        Delete
      </button>
      {state.error ? (
        <p className="adm-inline-error" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
