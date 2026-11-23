import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * One admin, configured entirely from the environment:
 *
 *   ADMIN_EMAIL           the login email
 *   ADMIN_PASSWORD        the login password
 *   ADMIN_SESSION_SECRET  a long random string that signs the session cookie
 *
 * A successful login sets an HttpOnly, SameSite=Strict cookie holding an
 * expiry time and an HMAC of it. Nothing is stored server side, so it works on
 * Vercel's serverless functions. Changing ADMIN_SESSION_SECRET signs everyone out.
 */

export const SESSION_COOKIE = "alg_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** True when all three settings are present and the secret is long enough. */
export function isAdminConfigured(): boolean {
  return Boolean(
    env("ADMIN_EMAIL") &&
      env("ADMIN_PASSWORD") &&
      env("ADMIN_SESSION_SECRET").length >= 24,
  );
}

const digest = (value: string) => createHash("sha256").update(value).digest();

/** Constant-time comparison of two strings of any length. */
function same(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

export function checkCredentials(email: string, password: string): boolean {
  if (!isAdminConfigured()) return false;
  // Both are always compared so the time taken does not reveal which was wrong.
  const emailOk = same(email.trim().toLowerCase(), env("ADMIN_EMAIL").toLowerCase());
  const passwordOk = same(password, env("ADMIN_PASSWORD"));
  return emailOk && passwordOk;
}

function sign(expires: number): string {
  return createHmac("sha256", env("ADMIN_SESSION_SECRET"))
    .update(`v1.${expires}`)
    .digest("base64url");
}

export function createSessionValue(): { value: string; maxAge: number } {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return { value: `${expires}.${sign(expires)}`, maxAge: SESSION_SECONDS };
}

function verifySessionValue(value: string | undefined): boolean {
  if (!value || !isAdminConfigured()) return false;
  const [expiresText, signature] = value.split(".");
  const expires = Number(expiresText);
  if (!signature || !Number.isFinite(expires)) return false;
  if (expires < Math.floor(Date.now() / 1000)) return false;
  return same(signature, sign(expires));
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
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
