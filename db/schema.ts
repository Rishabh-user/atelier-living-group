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

/**
 * Blog posts written in /admin. The body is Markdown; it is rendered without
 * raw HTML, so what is stored can never inject markup into a page.
 */
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  /** Short summary for cards, search results and social previews. */
  excerpt: text("excerpt").notNull().default(""),
  /** Markdown. */
  content: text("content").notNull().default(""),
  coverImage: text("cover_image"),
  coverAlt: text("cover_alt"),
  category: text("category").notNull().default("Design"),
  /** draft | published */
  status: text("status").notNull().default("draft"),
  /** Optional override for the meta description. */
  seoDescription: text("seo_description"),
  /** ISO-8601 UTC. Set the first time a post is published. */
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

/**
 * Blog categories, managed in /admin. A post stores its category by name, and
 * the category page address is the slug of that name, so renaming a category
 * moves its posts and its page together.
 */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  /** One line under the heading on the category page. */
  intro: text("intro").notNull().default(""),
  /** Meta description for search results. */
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export type CategoryRow = typeof categories.$inferSelect;
