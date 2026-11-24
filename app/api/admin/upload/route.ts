import { put } from "@vercel/blob";

import { isAdmin } from "@/lib/admin-auth";
import { saveMedia } from "@/lib/media";
import { isBlogDbConfigured } from "@/db/blog-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel functions accept request bodies up to 4.5 MB. The editor shrinks
// photos in the browser first, so real uploads are far smaller.
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Image upload for the blog editor. Admin only. Files are stored in the
 * database and served from /media/<id>/<name>, a relative address that works on
 * localhost and on the live site. Vercel Blob is used instead only when
 * BLOB_READ_WRITE_TOKEN is set.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return json({ error: "Sign in again to upload." }, 401);

  // Belt and braces on top of the SameSite=Strict cookie.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json({ error: "Blocked." }, 403);
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "Choose an image." }, 400);

  const extension = TYPES[file.type];
  if (!extension) return json({ error: "Use a JPG, PNG, WebP or GIF image." }, 415);
  if (file.size > MAX_BYTES) return json({ error: "That image is over 4 MB." }, 413);

  const stamp = new Date().toISOString().slice(0, 10);
  const safe =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "image";
  const name = `blog/${stamp}-${safe}.${extension}`;

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(name, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      return json({ url: blob.url });
    }

    if (!isBlogDbConfigured()) {
      return json(
        { error: "Images are stored in the database. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN." },
        503,
      );
    }
    const saved = await saveMedia({
      name: `${safe}.${extension}`,
      mime: file.type,
      bytes: Buffer.from(await file.arrayBuffer()),
    });
    return json({ url: saved.url });
  } catch (error) {
    console.error("admin: upload failed", error);
    return json({ error: "The upload failed. Try again." }, 500);
  }
}
