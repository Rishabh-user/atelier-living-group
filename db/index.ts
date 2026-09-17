import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

/**
 * libSQL (Turso) rather than Cloudflare D1.
 *
 * D1 is only available inside a Cloudflare Worker, so it cannot follow this
 * app to Vercel. libSQL is SQLite over HTTP, which means the existing schema
 * and the generated migration in `drizzle/` port across unchanged — no dialect
 * rewrite, no data model changes.
 *
 * Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the Vercel project settings
 * (and in .env.local for development).
 */

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "TURSO_DATABASE_URL is not set. Create a libSQL/Turso database and add " +
        "TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN for remote databases) to the " +
        "environment before submissions can be stored.",
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

/** True when the app has somewhere to persist submissions. */
export function isDatabaseConfigured(): boolean {
  return Boolean(url);
}

// One client per server instance; serverless invocations reuse it when warm.
let cached: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!url) throw new DatabaseNotConfiguredError();

  if (!cached) {
    // authToken is omitted for local file: URLs, which take no credentials.
    const client = createClient(authToken ? { url, authToken } : { url });
    cached = drizzle(client, { schema });
  }

  return cached;
}
