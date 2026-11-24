import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  burnHashTime,
  getUserByEmail,
  getUserById,
  touchLogin,
  usersAvailable,
  verifyPassword,
} from "@/lib/admin-users";

/**
 * Admin logins live in the database (the `admin_users` table, passwords hashed
 * with scrypt) and are managed on /admin/users.
 *
 * The only environment setting is ADMIN_SESSION_SECRET: a long random string
 * (24+ characters) that signs the login cookie. Changing it signs everyone
 * out. Create the first login with `npm run admin:create`.
 *
 * A successful login sets an HttpOnly, SameSite=Strict cookie holding the user
 * id, an expiry time and an HMAC of both. Nothing is stored server side, so it
 * works on Vercel's serverless functions.
 */

export const SESSION_COOKIE = "alg_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** True when the cookie secret is set; without it nobody can sign in. */
export function isAdminConfigured(): boolean {
  return env("ADMIN_SESSION_SECRET").length >= 24;
}

const digest = (value: string) => createHash("sha256").update(value).digest();

/** Constant-time comparison of two strings of any length. */
function same(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

/**
 * Checks an email and password against the database. Returns the user id or null.
 */
export async function authenticate(email: string, password: string): Promise<number | null> {
  if (!isAdminConfigured() || !usersAvailable()) return null;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      await burnHashTime(password);
      return null;
    }
    if (!(await verifyPassword(password, user.passwordHash))) return null;
    await touchLogin(user.id);
    return user.id;
  } catch (error) {
    console.error("admin: login could not use the database", error);
    return null;
  }
}

function sign(userId: number, expires: number): string {
  return createHmac("sha256", env("ADMIN_SESSION_SECRET"))
    .update(`v2.${userId}.${expires}`)
    .digest("base64url");
}

export function createSessionValue(userId: number): { value: string; maxAge: number } {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return { value: `${userId}.${expires}.${sign(userId, expires)}`, maxAge: SESSION_SECONDS };
}

/** The user id inside a valid cookie, or null. */
function readSession(value: string | undefined): number | null {
  if (!value || !isAdminConfigured()) return null;
  const [idText, expiresText, signature] = value.split(".");
  const userId = Number(idText);
  const expires = Number(expiresText);
  if (!signature || !Number.isInteger(userId) || userId < 0 || !Number.isFinite(expires)) return null;
  if (expires < Math.floor(Date.now() / 1000)) return null;
  return same(signature, sign(userId, expires)) ? userId : null;
}

/** The signed-in user's id (0 for the emergency login), or null. */
export async function currentAdminId(): Promise<number | null> {
  const userId = readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (userId === null) return null;
  if (userId > 0 && usersAvailable()) {
    try {
      // A login that has been removed stops working at once.
      if (!(await getUserById(userId))) return null;
    } catch {
      // Database trouble: keep the session so the dashboard can explain it.
    }
  }
  return userId;
}

export async function isAdmin(): Promise<boolean> {
  return (await currentAdminId()) !== null;
}

/** For admin pages and actions: send anyone who is not signed in to the login. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

// ---- Failed-login throttle -------------------------------------------------
// In memory, so it is per server instance: a speed bump, not a guarantee. The
// real protection is a long password.
const failures = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 6;

export function loginBlocked(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function noteLoginFailure(key: string): void {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    failures.set(key, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

export function clearLoginFailures(key: string): void {
  failures.delete(key);
}
