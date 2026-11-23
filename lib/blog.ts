import "server-only";

import { and, desc, eq, ne, sql } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/db";
import { categories, posts, type CategoryRow, type Post } from "@/db/schema";

export type CategoryInfo = { name: string; intro: string; description: string };

/**
 * The categories a new blog starts with. They are copied into the database the
 * first time it is used; after that they are edited in /admin. They are also
 * what visitors see if the database cannot be reached.
 */
export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    name: "Design",
    intro: "Ideas on layout, proportion and the details that make a kitchen feel considered.",
    description:
      "Kitchen design ideas from Atelier Living Group: layout, proportion, lighting and the details that make a luxury kitchen work.",
  },
  {
    name: "Materials",
    intro: "Stone, wood, lacquer and metal: how to choose finishes you will enjoy for years.",
    description:
      "Guides to kitchen materials and finishes from Atelier Living Group: worktops, fronts, wood and metal for Poggenpohl kitchens.",
  },
  {
    name: "Collections",
    intro: "Stories from the Poggenpohl collections: TAGLIO, ALVOLO, Solitaire, +MODO, +SEGMENTO and +VENOVO.",
    description:
      "Articles on the Poggenpohl kitchen collections from Atelier Living Group, the exclusive Poggenpohl dealer for Atlanta and Georgia.",
  },
  {
    name: "Planning",
    intro: "From first conversation to installation: how to plan a kitchen that fits the way you live.",
    description:
      "Kitchen planning advice from Atelier Living Group: budgets, timelines, working with architects and what to decide first.",
  },
  {
    name: "Showroom",
    intro: "News and notes from the Terminus 100 showroom in Buckhead.",
    description:
      "News from the Atelier Living Group Poggenpohl showroom at Terminus 100 in Buckhead, Atlanta.",
  },
];

/** A category page lives at /blog/category/<slug of the name>. */
export const categoryHref = (name: string) => `/blog/category/${slugify(name)}`;

export const MAX = {
  title: 140,
  slug: 90,
  excerpt: 300,
  content: 120_000,
  alt: 200,
  seo: 200,
  categoryName: 40,
  categoryText: 220,
} as const;

/** The posts table is created on first use, as the inquiries table is. */
let ready: Promise<void> | null = null;

async function ensureTable(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const db = getDb();
      await db.run(sql`
        CREATE TABLE IF NOT EXISTS posts (
          id integer PRIMARY KEY AUTOINCREMENT,
          slug text NOT NULL UNIQUE,
          title text NOT NULL,
          excerpt text NOT NULL DEFAULT '',
          content text NOT NULL DEFAULT '',
          cover_image text,
          cover_alt text,
          category text NOT NULL DEFAULT 'Design',
          status text NOT NULL DEFAULT 'draft',
          seo_description text,
          published_at text,
          created_at text NOT NULL,
          updated_at text NOT NULL
        )
      `);
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS posts_status_published ON posts (status, published_at)`,
      );

      // Categories: seeded with the defaults only when the table is first
      // created, so deleting one in /admin is never undone.
      const existing = await db.all(
        sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'categories'`,
      );
      if (existing.length === 0) {
        await db.run(sql`
          CREATE TABLE categories (
            id integer PRIMARY KEY AUTOINCREMENT,
            name text NOT NULL UNIQUE,
            intro text NOT NULL DEFAULT '',
            description text NOT NULL DEFAULT '',
            created_at text NOT NULL
          )
        `);
        const now = new Date().toISOString();
        for (const item of DEFAULT_CATEGORIES) {
          await db.insert(categories).values({ ...item, createdAt: now });
        }
      }
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

export function blogAvailable(): boolean {
  return isDatabaseConfigured();
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX.slug)
    .replace(/-+$/g, "");
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(iso));
}

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/[#>*_`~[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ---- Public reads: never throw, so a missing database cannot break a page ----

export async function listPublished(options?: {
  category?: string;
  limit?: number;
  offset?: number;
  excludeId?: number;
}): Promise<Post[]> {
  if (!blogAvailable()) return [];
  try {
    await ensureTable();
    const conditions = [eq(posts.status, "published")];
    if (options?.category) conditions.push(eq(posts.category, options.category));
    if (options?.excludeId) conditions.push(ne(posts.id, options.excludeId));
    return await getDb()
      .select()
      .from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.publishedAt))
      .limit(options?.limit ?? 50)
      .offset(options?.offset ?? 0);
  } catch (error) {
    console.error("blog: could not list posts", error);
    return [];
  }
}

export async function countPublished(category?: string): Promise<number> {
  if (!blogAvailable()) return 0;
  try {
    await ensureTable();
    const conditions = [eq(posts.status, "published")];
    if (category) conditions.push(eq(posts.category, category));
    const [row] = await getDb()
      .select({ n: sql<number>`count(*)` })
      .from(posts)
      .where(and(...conditions));
    return Number(row?.n ?? 0);
  } catch {
    return 0;
  }
}

export async function getPublishedBySlug(slug: string): Promise<Post | null> {
  if (!blogAvailable()) return null;
  try {
    await ensureTable();
    const [row] = await getDb()
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("blog: could not read post", error);
    return null;
  }
}

// ---- Admin reads and writes: these throw, so the dashboard can show why ------

export async function listAll(): Promise<Post[]> {
  await ensureTable();
  return getDb().select().from(posts).orderBy(desc(posts.updatedAt));
}

export async function getById(id: number): Promise<Post | null> {
  await ensureTable();
  const [row] = await getDb().select().from(posts).where(eq(posts.id, id)).limit(1);
  return row ?? null;
}

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  coverAlt: string | null;
  category: string;
  seoDescription: string | null;
  status: "draft" | "published";
};

/** A slug that no other post uses: "my-post", then "my-post-2", ... */
async function freeSlug(base: string, ownId?: number): Promise<string> {
  const db = getDb();
  let candidate = base || "post";
  for (let n = 2; n < 200; n++) {
    const [clash] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, candidate))
      .limit(1);
    if (!clash || clash.id === ownId) return candidate;
    candidate = `${base}-${n}`.slice(0, MAX.slug + 4);
  }
  return `${base}-${Date.now()}`;
}

/** Creates (no id) or updates a post and returns it. */
export async function savePost(input: PostInput, id?: number): Promise<Post> {
  await ensureTable();
  const db = getDb();
  const now = new Date().toISOString();
  const slug = await freeSlug(slugify(input.slug || input.title), id);

  if (id === undefined) {
    const [created] = await db
      .insert(posts)
      .values({
        ...input,
        slug,
        publishedAt: input.status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return created;
  }

  const existing = await getById(id);
  if (!existing) throw new Error("That post no longer exists.");
  const [updated] = await db
    .update(posts)
    .set({
      ...input,
      slug,
      // The publish date is kept once set; unpublishing and republishing does
      // not move the post back to the top of the blog.
      publishedAt:
        input.status === "published" ? (existing.publishedAt ?? now) : existing.publishedAt,
      updatedAt: now,
    })
    .where(eq(posts.id, id))
    .returning();
  return updated;
}

export async function setStatus(id: number, status: "draft" | "published"): Promise<Post> {
  await ensureTable();
  const existing = await getById(id);
  if (!existing) throw new Error("That post no longer exists.");
  const now = new Date().toISOString();
  const [updated] = await getDb()
    .update(posts)
    .set({
      status,
      publishedAt: status === "published" ? (existing.publishedAt ?? now) : existing.publishedAt,
      updatedAt: now,
    })
    .where(eq(posts.id, id))
    .returning();
  return updated;
}

export async function deletePost(id: number): Promise<Post | null> {
  await ensureTable();
  const existing = await getById(id);
  if (!existing) return null;
  await getDb().delete(posts).where(eq(posts.id, id));
  return existing;
}


// ---- Categories ---------------------------------------------------------------

/** For visitors: never throws, falls back to the defaults. */
export async function listCategoriesSafe(): Promise<CategoryInfo[]> {
  if (!blogAvailable()) return DEFAULT_CATEGORIES;
  try {
    await ensureTable();
    const rows = await getDb().select().from(categories).orderBy(categories.name);
    return rows.map(({ name, intro, description }) => ({ name, intro, description }));
  } catch (error) {
    console.error("blog: could not list categories", error);
    return DEFAULT_CATEGORIES;
  }
}

/** The category whose page address is this slug, if there is one. */
export async function getCategoryBySlug(slug: string): Promise<CategoryInfo | null> {
  const all = await listCategoriesSafe();
  return all.find((item) => slugify(item.name) === slug) ?? null;
}

/** Category text with sensible fallbacks for the page header and search results. */
export function categoryCopy(item: CategoryInfo) {
  return {
    intro: item.intro || `Articles about ${item.name.toLowerCase()}.`,
    description:
      item.description ||
      `${item.name} articles from the Atelier Living Group blog.`,
  };
}

export type CategoryWithCounts = CategoryRow & { total: number; published: number };

/** For the admin: every category with how many posts use it. */
export async function listCategoriesWithCounts(): Promise<CategoryWithCounts[]> {
  await ensureTable();
  const db = getDb();
  const rows = await db.select().from(categories).orderBy(categories.name);
  const counts = await db
    .select({
      category: posts.category,
      total: sql<number>`count(*)`,
      published: sql<number>`sum(case when ${posts.status} = 'published' then 1 else 0 end)`,
    })
    .from(posts)
    .groupBy(posts.category);
  return rows.map((row) => {
    const hit = counts.find((c) => c.category === row.name);
    return { ...row, total: Number(hit?.total ?? 0), published: Number(hit?.published ?? 0) };
  });
}

export async function getCategoryById(id: number): Promise<CategoryRow | null> {
  await ensureTable();
  const [row] = await getDb().select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ?? null;
}

export type CategoryInput = { name: string; intro: string; description: string };

/** Creates (no id) or updates a category. Renaming moves its posts with it. */
export async function saveCategory(input: CategoryInput, id?: number): Promise<CategoryRow> {
  await ensureTable();
  const db = getDb();
  const slug = slugify(input.name);
  if (!slug) throw new Error("Use letters or numbers in the name.");

  // The page address comes from the name, so two names must not share one.
  const all = await db.select().from(categories);
  const clash = all.find((row) => row.id !== id && slugify(row.name) === slug);
  if (clash) throw new Error(`"${clash.name}" already uses that web address. Choose a different name.`);

  if (id === undefined) {
    const [created] = await db
      .insert(categories)
      .values({ ...input, createdAt: new Date().toISOString() })
      .returning();
    return created;
  }

  const existing = await getCategoryById(id);
  if (!existing) throw new Error("That category no longer exists.");
  const [updated] = await db
    .update(categories)
    .set(input)
    .where(eq(categories.id, id))
    .returning();
  if (existing.name !== input.name) {
    await db.update(posts).set({ category: input.name }).where(eq(posts.category, existing.name));
  }
  return updated;
}

/** Refuses while any post, draft or published, still uses the category. */
export async function deleteCategory(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureTable();
  const existing = await getCategoryById(id);
  if (!existing) return { ok: true };
  const [inUse] = await getDb()
    .select({ n: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.category, existing.name));
  const n = Number(inUse?.n ?? 0);
  if (n > 0) {
    return {
      ok: false,
      error: `${n} ${n === 1 ? "post uses" : "posts use"} "${existing.name}". Move ${n === 1 ? "it" : "them"} to another category first.`,
    };
  }
  await getDb().delete(categories).where(eq(categories.id, id));
  return { ok: true };
}
