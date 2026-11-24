/**
 * A short, safe description of a failure for the admin dashboard.
 *
 * drizzle wraps database errors as "Failed query: <sql>" and keeps the real
 * reason (for example ENOTFOUND, ETIMEDOUT or ER_ACCESS_DENIED_ERROR) in
 * `cause`. This walks down to that reason. The SQL and its parameters are
 * never included.
 */
export function describeError(error: unknown): string {
  let current: unknown = error;
  let last = "";
  for (let depth = 0; depth < 5 && current instanceof Error; depth++) {
    const code = (current as { code?: string }).code;
    const message = (current.message.split(/\r?\n/)[0] ?? "").trim();
    if (!message.startsWith("Failed query")) {
      last = [code, message].filter(Boolean).join(": ").slice(0, 220);
    }
    current = (current as { cause?: unknown }).cause;
  }
  return last || (error instanceof Error ? "The query failed." : "");
}
