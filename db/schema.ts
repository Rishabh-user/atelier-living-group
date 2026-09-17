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
