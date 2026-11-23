"use client";

import { deletePostAction } from "@/app/admin/actions";

export default function DeleteButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="adm-row-btn adm-danger">
        Delete
      </button>
    </form>
  );
}
