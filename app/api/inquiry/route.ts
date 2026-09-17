import { getDb, isDatabaseConfigured } from "@/db";
import { inquiries } from "@/db/schema";
import { sql } from "drizzle-orm";

// Submissions must never be cached or statically evaluated.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SOURCES = ["hero", "consultation", "footer"] as const;
type Source = (typeof SOURCES)[number];

const MAX = {
  name: 120,
  email: 200,
  phone: 40,
  projectType: 120,
  message: 4000,
} as const;

type Payload = {
  source?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  projectType?: unknown;
  message?: unknown;
  /** Bot trap: real users never fill this. */
  company?: unknown;
};

type Errors = Partial<Record<"name" | "email" | "phone" | "form", string>>;

function str(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/** Deliberately permissive: enough to catch typos, not to police addresses. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

function hasEnoughDigits(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 7;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

/**
 * Creates the table on first use so a fresh libSQL database works without a
 * separate migration step. Production schema still comes from
 * `drizzle/0000_*.sql`; this matches it exactly and is a no-op once applied.
 */
async function ensureTable(db: ReturnType<typeof getDb>): Promise<void> {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      source text NOT NULL,
      name text NOT NULL,
      email text,
      phone text,
      project_type text,
      message text,
      created_at text NOT NULL
    )
  `);
}

export async function POST(request: Request): Promise<Response> {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return json({ ok: false, message: "Could not read that request." }, 400);
  }

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (str(payload.company, 200) !== "") {
    return json({ ok: true }, 200);
  }

  const source = str(payload.source, 40);
  const name = str(payload.name, MAX.name);
  const email = str(payload.email, MAX.email);
  const phone = str(payload.phone, MAX.phone);
  const projectType = str(payload.projectType, MAX.projectType);
  const message = str(payload.message, MAX.message);

  const errors: Errors = {};

  if (!SOURCES.includes(source as Source)) {
    return json({ ok: false, message: "Unknown form." }, 400);
  }
  if (name.length < 2) {
    errors.name = "Please enter your name.";
  }
  if (email !== "" && !looksLikeEmail(email)) {
    errors.email = "Please check this email address.";
  }
  if (phone !== "" && !hasEnoughDigits(phone)) {
    errors.phone = "Please enter a full phone number.";
  }
  // Every form collects at least one way to reply.
  if (email === "" && phone === "") {
    const field = source === "consultation" ? "email" : "phone";
    errors[field] = "Add an email address or a phone number.";
  }

  if (Object.keys(errors).length > 0) {
    return json(
      { ok: false, errors, message: "Please correct the highlighted fields." },
      422,
    );
  }

  if (!isDatabaseConfigured()) {
    console.error(
      "inquiry received but no database is configured (TURSO_DATABASE_URL unset)",
      { source, name, email, phone, projectType },
    );
    return json(
      {
        ok: false,
        message:
          "We could not save that request right now. Please call 678-637-3262 and we will take the details directly.",
      },
      503,
    );
  }

  try {
    const db = getDb();
    await ensureTable(db);
    await db.insert(inquiries).values({
      source,
      name,
      email: email || null,
      phone: phone || null,
      projectType: projectType || null,
      message: message || null,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("inquiry insert failed", error);
    return json(
      {
        ok: false,
        message:
          "We could not save that request. Please call 678-637-3262 and we will take the details directly.",
      },
      500,
    );
  }

  return json({ ok: true }, 201);
}

export async function GET(): Promise<Response> {
  return json({ ok: false, message: "Method not allowed." }, 405);
}
