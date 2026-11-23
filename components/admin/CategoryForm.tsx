"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { saveCategoryAction, type FormState } from "@/app/admin/actions";

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

/** Add a category, or edit one when `initial.id` is present. */
export default function CategoryForm({
  initial,
}: {
  initial?: { id: number; name: string; intro: string; description: string };
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCategoryAction, {});
  const [name, setName] = useState(initial?.name ?? "");
  const editing = Boolean(initial);

  return (
    <form action={action} className="adm-card adm-cat-form">
      <h2>{editing ? "Edit category" : "Add a category"}</h2>

      {state.error ? (
        <p className="adm-flash adm-flash-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      <label className="adm-field">
        <span>Name</span>
        <input
          name="name"
          value={name}
          maxLength={40}
          required
          placeholder="e.g. Lighting"
          onChange={(event) => setName(event.target.value)}
        />
        <small className="adm-muted">
          Page address: /blog/category/{slugify(name) || "…"}
        </small>
      </label>

      <label className="adm-field">
        <span>Intro (shown under the heading)</span>
        <textarea
          name="intro"
          defaultValue={initial?.intro ?? ""}
          maxLength={220}
          rows={2}
          placeholder="One line about what readers will find here."
        />
      </label>

      <label className="adm-field">
        <span>Search description (optional)</span>
        <textarea
          name="description"
          defaultValue={initial?.description ?? ""}
          maxLength={220}
          rows={3}
          placeholder="Shown in search results. Leave empty for a standard sentence."
        />
      </label>

      {editing && initial && name.trim() !== initial.name ? (
        <p className="adm-muted">
          Renaming moves this category&apos;s posts with it and changes its page
          address, so old links to the previous address will stop working.
        </p>
      ) : null}

      <div className="adm-row-actions adm-row-left">
        <button className="adm-btn adm-btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : editing ? "Save changes" : "Add category"}
        </button>
        {editing ? (
          <Link className="adm-btn" href="/admin/categories">
            Cancel
          </Link>
        ) : null}
      </div>
    </form>
  );
}
