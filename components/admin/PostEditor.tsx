"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
};

/** Accepts a pasted "/blog/my-post" or full address and keeps only the last part. */
const cleanPath = (value: string) =>
  value
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/[?#].*$/, "")
    .replace(/^\/+/, "")
    .replace(/^blog\//i, "");

/** True for addresses on other websites (not this site, not a /path). */
const isOutside = (url: string) =>
  /^https?:\/\//i.test(url) && !/^https?:\/\/(www\.)?atelierlivinggroup\.com(\/|$)/i.test(url);

const slugify = (value: string) =>
  cleanPath(value)
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
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDesc, setSeoDesc] = useState(initial.seoDescription);
  const [content, setContent] = useState(initial.content);
  const [cover, setCover] = useState(initial.coverImage);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement | null>(null);
  const [linkBar, setLinkBar] = useState<{ start: number; end: number; text: string } | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const linkInput = useRef<HTMLInputElement | null>(null);
  const [linkNewTab, setLinkNewTab] = useState(false);
  const [linkNewTabTouched, setLinkNewTabTouched] = useState(false);
  useEffect(() => {
    if (linkBar) linkInput.current?.focus();
  }, [linkBar]);

  /** Remembers the selected text, then asks for the address. */
  const openLink = () => {
    const el = area.current;
    if (!el) return;
    setLinkBar({
      start: el.selectionStart,
      end: el.selectionEnd,
      text: content.slice(el.selectionStart, el.selectionEnd),
    });
    setLinkUrl("");
    setLinkError(null);
    setLinkNewTab(false);
    setLinkNewTabTouched(false);
  };

  /** Selecting different words while the link bar is open moves the link to them. */
  const followSelection = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    if (!linkBar) return;
    const el = event.currentTarget;
    if (el.selectionStart !== el.selectionEnd) {
      setLinkBar({
        start: el.selectionStart,
        end: el.selectionEnd,
        text: el.value.slice(el.selectionStart, el.selectionEnd),
      });
    }
  };

  /** Turns the remembered selection into [text](address). */
  const applyLink = () => {
    if (!linkBar) return;
    let url = linkUrl.trim();
    if (!url) {
      setLinkError("Paste or type the link address.");
      return;
    }
    // Accept full addresses, site paths, anchors, mail and phone links; add https:// to a bare domain.
    if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) {
      if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(url)) url = `https://${url}`;
      else {
        setLinkError("Use an address like https://example.com, a page like /contact, or tel:+14049129996.");
        return;
      }
    }
    if (/[\s()]/.test(url)) {
      setLinkError("The address cannot contain spaces or brackets.");
      return;
    }
    // Offsets can be stale if the text changed after the bar opened, so check that the
    // remembered words are still where we think; if not, find the nearest copy of them.
    let { start, end } = linkBar;
    const { text } = linkBar;
    if (text && content.slice(start, end) !== text) {
      const after = content.indexOf(text, start);
      const before = content.lastIndexOf(text, start);
      const found = after === -1 ? before : before === -1 ? after : start - before <= after - start ? before : after;
      if (found === -1) {
        setLinkError("The selected text has changed. Select the words again, then click Link.");
        return;
      }
      start = found;
      end = found + text.length;
    }
    const label = content.slice(start, end) || "link text";
    // Outside links open in a new tab by default and site links in the same tab;
    // a title of _blank or _self records a different choice.
    const outside = isOutside(url);
    const title = linkNewTab && !outside ? ' "_blank"' : !linkNewTab && outside ? ' "_self"' : "";
    const next = content.slice(0, start) + `[${label}](${url}${title})` + content.slice(end);
    setContent(next);
    setLinkBar(null);
    requestAnimationFrame(() => {
      const el = area.current;
      if (!el) return;
      el.focus();
      const caret = start + label.length + url.length + title.length + 4;
      el.setSelectionRange(caret, caret);
    });
  };

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
            <button type="button" onClick={openLink} aria-expanded={linkBar !== null}>
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

          {linkBar ? (
            <div className="adm-linkbar" role="group" aria-label="Add a link">
              <span className="adm-linkbar-text">
                {linkBar.text ? `Link “${linkBar.text.slice(0, 40)}” to:` : "Link address:"}
              </span>
              <input
                ref={linkInput}
                type="text"
                inputMode="url"
                value={linkUrl}
                placeholder="https://… or /contact"
                onChange={(event) => {
                  const value = event.target.value;
                  setLinkUrl(value);
                  setLinkError(null);
                  // Until the box is touched, follow the usual default: outside links in a new tab.
                  if (!linkNewTabTouched) setLinkNewTab(isOutside(value.trim()));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyLink();
                  } else if (event.key === "Escape") {
                    setLinkBar(null);
                    area.current?.focus();
                  }
                }}
              />
              <label className="adm-linkbar-tab">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(event) => {
                    setLinkNewTab(event.target.checked);
                    setLinkNewTabTouched(true);
                  }}
                />
                Open in a new tab
              </label>
              <button type="button" onClick={applyLink}>
                Add link
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinkBar(null);
                  area.current?.focus();
                }}
              >
                Cancel
              </button>
              {linkError ? <small role="alert">{linkError}</small> : null}
            </div>
          ) : null}

          <textarea
            ref={area}
            name="content"
            className="adm-content"
            value={content}
            hidden={tab === "preview"}
            onChange={(event) => setContent(event.target.value)}
            onSelect={followSelection}
            onMouseUp={followSelection}
            onKeyUp={followSelection}
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
              <option value="">No category</option>
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
            <span>URL path</span>
            <input
              name="slug"
              value={slug}
              maxLength={90}
              placeholder="poggenpohl-atlanta-showroom-guide"
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(slugify(event.target.value));
              }}
            />
            <small className="adm-muted">/blog/{slug || "…"}</small>
          </label>
        </div>

        <div className="adm-card">
          <h2>Search (SEO)</h2>
          <label className="adm-field">
            <span>SEO title</span>
            <input
              name="seoTitle"
              value={seoTitle}
              maxLength={120}
              onChange={(event) => setSeoTitle(event.target.value)}
              placeholder="Leave empty to use the post title."
            />
            <small className="adm-muted" data-over={seoTitle.length > 60}>
              {seoTitle.length} characters. About 60 or fewer shows in full in Google.
            </small>
          </label>
          <label className="adm-field">
            <span>Meta description</span>
            <textarea
              name="seoDescription"
              value={seoDesc}
              maxLength={320}
              rows={4}
              onChange={(event) => setSeoDesc(event.target.value)}
              placeholder="Leave empty to use the summary."
            />
            <small className="adm-muted" data-over={seoDesc.length > 160}>
              {seoDesc.length} characters. About 150 to 160 shows in full in Google.
            </small>
          </label>
        </div>
      </aside>
    </form>
  );
}
