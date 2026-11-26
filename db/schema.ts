import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Consultation requests captured by the three site forms
 * (hero, consultation panel, footer).
 */
export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Which form the submission came from: hero | consultation | footer */
  source: text("source").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  projectType: text("project_type"),
  message: text("message"),
  /** ISO-8601 UTC timestamp. */
  createdAt: text("created_at").notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;


/** Blog posts written in /admin. The body is Markdown, rendered without raw HTML. */
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  /** Short summary for cards, search results and social previews. */
  excerpt: text("excerpt").notNull(),
  /** Markdown. */
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  coverAlt: text("cover_alt"),
  category: text("category").notNull(),
  /** draft | published */
  status: text("status").notNull().default("draft"),
  /** Optional override for the page title shown in search results. */
  seoTitle: text("seo_title"),
  /** Optional override for the meta description. */
  seoDescription: text("seo_description"),
  /** ISO-8601 UTC. Set the first time a post is published. */
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type Post = typeof posts.$inferSelect;

/**
 * Blog categories, managed in /admin. A post stores its category by name, and
 * the category page address is the slug of that name.
 */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  intro: text("intro").notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at").notNull(),
});

export type CategoryRow = typeof categories.$inferSelect;

/** People who can sign in to /admin. Passwords are stored as scrypt hashes. */
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull(),
  lastLoginAt: text("last_login_at"),
});

export type AdminUser = typeof adminUsers.$inferSelect;

/** Blog images uploaded in /admin, stored as base64 so they live with the rest of the data. */
export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  /** Base64 of the file. */
  data: text("data").notNull(),
  createdAt: text("created_at").notNull(),
});
