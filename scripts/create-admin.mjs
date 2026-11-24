/**
 * Creates (or resets the password of) an admin login directly in the database.
 *
 *   npm run admin:create -- you@example.com "a-long-password"
 *
 * Leave the password out to be asked for it. It uses TURSO_DATABASE_URL and
 * TURSO_AUTH_TOKEN from .env.local. Passwords are stored as scrypt hashes in
 * the same format the website uses to check them.
 */
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { promisify } from "node:util";

import { createClient } from "@libsql/client";

const MIN_PASSWORD = 10;
const scryptAsync = promisify(scrypt);

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error("TURSO_DATABASE_URL is not set (add it to .env.local).");
  process.exit(1);
}

let [email, password] = process.argv.slice(2);
if (!email || !password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  email ||= await rl.question("Email: ");
  password ||= await rl.question(`Password (${MIN_PASSWORD}+ characters): `);
  rl.close();
}

email = email.trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 190) {
  console.error("Enter a valid email address.");
  process.exit(1);
}
if (password.length < MIN_PASSWORD) {
  console.error(`Use a password of at least ${MIN_PASSWORD} characters.`);
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scryptAsync(password, salt, 64);
const stored = `s1$${salt.toString("hex")}$${hash.toString("hex")}`;

const db = createClient(
  process.env.TURSO_AUTH_TOKEN ? { url, authToken: process.env.TURSO_AUTH_TOKEN } : { url },
);

try {
  await db.execute(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_login_at TEXT
  )`);
  const existing = await db.execute({ sql: "SELECT id FROM admin_users WHERE email = ?", args: [email] });
  if (existing.rows.length) {
    await db.execute({ sql: "UPDATE admin_users SET password_hash = ? WHERE email = ?", args: [stored, email] });
    console.log(`Password updated for ${email}.`);
  } else {
    await db.execute({
      sql: "INSERT INTO admin_users (email, password_hash, created_at) VALUES (?, ?, ?)",
      args: [email, stored, new Date().toISOString()],
    });
    console.log(`Login created for ${email}.`);
  }
} catch (error) {
  console.error("Could not reach the database:", error instanceof Error ? error.message.split("\n")[0] : error);
  process.exit(1);
} finally {
  db.close();
}
