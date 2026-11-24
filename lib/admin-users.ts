import "server-only";

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { eq, sql } from "drizzle-orm";

import { ensureSchema, getBlogDb, isBlogDbConfigured } from "@/db/blog-db";
import { adminUsers, type AdminUser } from "@/db/schema";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

export const MIN_PASSWORD = 10;

// ---- Password hashing (scrypt, no extra dependency) ---------------------------

/** "s1$<salt hex>$<hash hex>". A new random salt for every password. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `s1$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [version, saltHex, hashHex] = stored.split("$");
  if (version !== "s1" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Used so a wrong email takes as long to reject as a wrong password.
let dummyHash: Promise<string> | null = null;
export function burnHashTime(password: string): Promise<boolean> {
  dummyHash ??= hashPassword("not-a-real-password");
  return dummyHash.then((hash) => verifyPassword(password, hash));
}

// ---- Users ---------------------------------------------------------------------

export const normaliseEmail = (value: string) => value.trim().toLowerCase();

export const looksLikeEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 190;

export function usersAvailable(): boolean {
  return isBlogDbConfigured();
}

export async function listUsers(): Promise<AdminUser[]> {
  await ensureSchema();
  return getBlogDb().select().from(adminUsers).orderBy(adminUsers.email);
}

export async function countUsers(): Promise<number> {
  await ensureSchema();
  const [row] = await getBlogDb().select({ n: sql<number>`count(*)` }).from(adminUsers);
  return Number(row?.n ?? 0);
}

export async function getUserById(id: number): Promise<AdminUser | null> {
  await ensureSchema();
  const [row] = await getBlogDb().select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return row ?? null;
}

export async function getUserByEmail(email: string): Promise<AdminUser | null> {
  await ensureSchema();
  const [row] = await getBlogDb()
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, normaliseEmail(email)))
    .limit(1);
  return row ?? null;
}

export async function createUser(email: string, password: string): Promise<AdminUser> {
  const clean = normaliseEmail(email);
  if (!looksLikeEmail(clean)) throw new Error("Enter a valid email address.");
  if (password.length < MIN_PASSWORD) {
    throw new Error(`Use a password of at least ${MIN_PASSWORD} characters.`);
  }
  if (await getUserByEmail(clean)) throw new Error("That email already has a login.");

  const [created] = await getBlogDb()
    .insert(adminUsers)
    .values({
      email: clean,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    })
    .returning();
  if (!created) throw new Error("The login could not be created.");
  return created;
}

export async function changePassword(id: number, password: string): Promise<void> {
  if (password.length < MIN_PASSWORD) {
    throw new Error(`Use a password of at least ${MIN_PASSWORD} characters.`);
  }
  const user = await getUserById(id);
  if (!user) throw new Error("That login no longer exists.");
  await getBlogDb()
    .update(adminUsers)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(adminUsers.id, id));
}

export async function touchLogin(id: number): Promise<void> {
  await getBlogDb()
    .update(adminUsers)
    .set({ lastLoginAt: new Date().toISOString() })
    .where(eq(adminUsers.id, id));
}

/** Refuses to remove the last login, so the admin can never lock itself out. */
export async function deleteUser(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getUserById(id);
  if (!user) return { ok: true };
  if ((await countUsers()) <= 1) {
    return { ok: false, error: "This is the only login. Add another one before removing it." };
  }
  await getBlogDb().delete(adminUsers).where(eq(adminUsers.id, id));
  return { ok: true };
}
