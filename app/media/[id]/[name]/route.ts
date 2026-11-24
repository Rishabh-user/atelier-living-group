import { getMedia } from "@/lib/media";

export const runtime = "nodejs";

/** Serves a blog image stored in the database: /media/<id>/<file name>. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; name: string }> },
) {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric < 1) return new Response("Not found", { status: 404 });

  try {
    const file = await getMedia(numeric);
    if (!file) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(file.bytes), {
      headers: {
        "Content-Type": file.mime,
        "Content-Length": String(file.bytes.length),
        // An image id is never reused, so it can be cached for good.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("media: could not read image", error);
    return new Response("Unavailable", { status: 503 });
  }
}
