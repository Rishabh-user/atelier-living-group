import "server-only";

import { sql } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "./index";

/**
 * The blog, its categories and the admin logins live in the same Turso (libSQL)
 * database as the form submissions: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.
 * The tables are created on first use.
 */

export const isBlogDbConfigured = isDatabaseConfigured;
export const getBlogDb = getDb;

let ready: Promise<{ categoriesCreated: boolean }> | null = null;

/**
 * Resolves with whether the categories table was just created, so the caller
 * can seed the starting categories exactly once.
 */
export function ensureSchema(): Promise<{ categoriesCreated: boolean }> {
  if (!ready) {
    ready = (async () => {
      const db = getDb();
      const found = await db.all(
        sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'categories'`,
      );
      const categoriesExisted = found.length > 0;

      await db.run(sql`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          cover_image TEXT,
          cover_alt TEXT,
          category TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          seo_description TEXT,
          published_at TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);
      // Tables created before the SEO title existed get the column added.
      const cols = await db.all(sql`PRAGMA table_info(posts)`);
      if (!cols.some((c) => (c as { name?: string }).name === "seo_title")) {
        await db.run(sql`ALTER TABLE posts ADD COLUMN seo_title TEXT`);
      }
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS posts_status_published ON posts (status, published_at)`,
      );
      await db.run(sql`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          intro TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
      await db.run(sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL,
          last_login_at TEXT
        )
      `);

      await db.run(sql`
        CREATE TABLE IF NOT EXISTS media (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          mime TEXT NOT NULL,
          size INTEGER NOT NULL,
          data TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);

      return { categoriesCreated: !categoriesExisted };
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}
