import "server-only";

import { eq } from "drizzle-orm";

import { ensureSchema, getBlogDb } from "@/db/blog-db";
import { media } from "@/db/schema";

/**
 * Blog images are kept in the Turso database, so they work the same on
 * localhost and on the live site, with no separate file storage to set up.
 * Photos are shrunk in the browser before upload, so rows stay small.
 */

/** The public address of an image: relative, so it works on any domain. */
export const mediaUrl = (id: number, name: string) => `/media/${id}/${name}`;

export async function saveMedia(input: {
  name: string;
  mime: string;
  bytes: Buffer;
}): Promise<{ id: number; url: string }> {
  await ensureSchema();
  const [row] = await getBlogDb()
    .insert(media)
    .values({
      name: input.name,
      mime: input.mime,
      size: input.bytes.length,
      data: input.bytes.toString("base64"),
      createdAt: new Date().toISOString(),
    })
    .returning({ id: media.id });
  if (!row) throw new Error("The image could not be saved.");
  return { id: row.id, url: mediaUrl(row.id, input.name) };
}

export async function getMedia(id: number): Promise<{ mime: string; bytes: Buffer } | null> {
  await ensureSchema();
  const [row] = await getBlogDb().select().from(media).where(eq(media.id, id)).limit(1);
  return row ? { mime: row.mime, bytes: Buffer.from(row.data, "base64") } : null;
}
