"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";

import { savePostAction, type FormState } from "@/app/admin/actions";
import Markdown from "@/components/Markdown";

type Initial = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  seoDescription: string;
  status: "draft" | "published";
};

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

/** Shrinks a photo in the browser so uploads stay small and fast. */
async function shrink(file: File): Promise<File> {
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.84),
  );
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", {
    type: "image/webp",
  });
}

async function upload(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", await shrink(file));
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const result = (await response.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };
  if (!response.ok || !result.url) throw new Error(result.error ?? "Upload failed.");
  return result.url;
}

export default function PostEditor({
  initial,
  categories,
  saved,
}: {
  initial: Initial;
  categories: readonly string[];
  saved?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePostAction, {});
  const isEdit = initial.id !== undefined;

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [content, setContent] = useState(initial.content);
  const [cover, setCover] = useState(initial.coverImage);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement | null>(null);

  /** Wraps the selection, or inserts at the caret. */
  const insert = (before: string, after = "", placeholder = "") => {
    const el = area.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const from = start + before.length;
      el.setSelectionRange(from, from + selected.length);
    });
  };

  /** Puts a prefix at the start of each selected line. */
  const prefixLines = (prefix: string) => {
    const el = area.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    const block = content.slice(lineStart, end) || "Text";
    const next =
      content.slice(0, lineStart) +
      block
        .split("\n")
        .map((line) => prefix + line)
        .join("\n") +
      content.slice(end);
    setContent(next);
    requestAnimationFrame(() => el.focus());
  };

  const addImage = async (file: File | undefined) => {
    if (!file) return;
    setBusy("Uploading image…");
    setNote(null);
    try {
      const url = await upload(file);
      insert(`\n\n![Describe the image](${url})\n\n`);
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  };

  const addCover = async (file: File | undefined) => {
    if (!file) return;
    setBusy("Uploading cover…");
    setNote(null);
    try {
      setCover(await upload(file));
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  };

  const published = initial.status === "published";

  return (
    <form action={action} className="adm-editor">
      {isEdit ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="coverImage" value={cover} />

      <div className="adm-editor-main">
        {saved ? (
          <p className="adm-flash" role="status">
            {saved === "published"
              ? "Published. The post is live on the blog."
              : "Saved as a draft."}
          </p>
        ) : null}
        {state.error ? (
          <p className="adm-flash adm-flash-error" role="alert">
            {state.error}
          </p>
        ) : null}
        {note ? (
          <p className="adm-flash adm-flash-error" role="alert">
            {note}
          </p>
        ) : null}

        <label className="adm-field">
          <span>Title</span>
          <input
            className="adm-title"
            name="title"
            value={title}
            maxLength={140}
            required
            placeholder="Post title"
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
          />
        </label>

        <div className="adm-field">
          <div className="adm-toolbar" role="toolbar" aria-label="Formatting">
            <button type="button" onClick={() => prefixLines("## ")}>H2</button>
            <button type="button" onClick={() => prefixLines("### ")}>H3</button>
            <button type="button" onClick={() => insert("**", "**", "bold")}>
              <strong>B</strong>
            </button>
            <button type="button" onClick={() => insert("*", "*", "italic")}>
              <em>I</em>
            </button>
            <button type="button" onClick={() => insert("[", "](https://)", "link text")}>
              Link
            </button>
            <button type="button" onClick={() => prefixLines("- ")}>List</button>
            <button type="button" onClick={() => prefixLines("1. ")}>1.</button>
            <button type="button" onClick={() => prefixLines("> ")}>Quote</button>
            <button type="button" onClick={() => insert("\n\n---\n\n")}>Divider</button>
            <label className="adm-upload">
              Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => {
                  void addImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <span className="adm-spacer" />
            <div className="adm-tabs" role="tablist" aria-label="Editor view">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "write"}
                onClick={() => setTab("write")}
              >
                Write
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "preview"}
                onClick={() => setTab("preview")}
              >
                Preview
              </button>
            </div>
          </div>

          <textarea
            ref={area}
            name="content"
            className="adm-content"
            value={content}
            hidden={tab === "preview"}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write in Markdown. Use the buttons above, or type ## for a heading and **bold**."
            spellCheck
          />
          {tab === "preview" ? (
            <div className="adm-preview">
              {content.trim() ? (
                <Markdown>{content}</Markdown>
              ) : (
                <p className="adm-muted">Nothing to preview yet.</p>
              )}
            </div>
          ) : null}
          <small className="adm-muted">
            {content.trim().split(/\s+/).filter(Boolean).length} words
            {busy ? ` · ${busy}` : ""}
          </small>
        </div>
      </div>

      <aside className="adm-editor-side">
        <div className="adm-card">
          <h2>Publish</h2>
          <p className="adm-muted">
            Status: <strong>{published ? "Published" : isEdit ? "Draft" : "New"}</strong>
          </p>
          <div className="adm-actions">
            <button
              type="submit"
              name="intent"
              value="publish"
              className="adm-btn adm-btn-primary"
              disabled={pending || busy !== null}
            >
              {pending ? "Saving…" : published ? "Update post" : "Publish"}
            </button>
            <button
              type="submit"
              name="intent"
              value="draft"
              className="adm-btn"
              disabled={pending || busy !== null}
            >
              {published ? "Unpublish (save as draft)" : "Save draft"}
            </button>
          </div>
          {isEdit && published ? (
            <Link className="adm-link" href={`/blog/${initial.slug}`} target="_blank">
              View on the site →
            </Link>
          ) : null}
        </div>

        <div className="adm-card">
          <h2>Cover image</h2>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="adm-cover" src={cover} alt="" />
          ) : (
            <p className="adm-muted">No cover yet. Wide photos work best.</p>
          )}
          <div className="adm-actions">
            <label className="adm-btn adm-upload-btn">
              {cover ? "Replace" : "Upload cover"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  void addCover(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            {cover ? (
              <button type="button" className="adm-btn" onClick={() => setCover("")}>
                Remove
              </button>
            ) : null}
          </div>
          <label className="adm-field">
            <span>Image description (for accessibility)</span>
            <input name="coverAlt" defaultValue={initial.coverAlt} maxLength={200} />
          </label>
        </div>

        <div className="adm-card">
          <h2>Details</h2>
          <label className="adm-field">
            <span>Category</span>
            <select name="category" defaultValue={initial.category}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="adm-field">
            <span>Summary</span>
            <textarea
              name="excerpt"
              defaultValue={initial.excerpt}
              maxLength={300}
              rows={4}
              placeholder="One or two sentences shown on the blog and in search results."
            />
          </label>
          <label className="adm-field">
            <span>Web address</span>
            <input
              name="slug"
              value={slug}
              maxLength={90}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(slugify(event.target.value));
              }}
            />
            <small className="adm-muted">/blog/{slug || "…"}</small>
          </label>
          <label className="adm-field">
            <span>Search description (optional)</span>
            <textarea
              name="seoDescription"
              defaultValue={initial.seoDescription}
              maxLength={200}
              rows={3}
              placeholder="Leave empty to use the summary."
            />
          </label>
        </div>
      </aside>
    </form>
  );
}
