# Atelier Living Group

Marketing site for Atelier Living Group — exclusive Poggenpohl dealer for
Atlanta and Georgia. Next.js App Router, deployed on Vercel.

## Prerequisites

- Node.js `>=22.13.0`

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in TURSO_DATABASE_URL
npm run dev
```

For local development a file database is enough:

```
TURSO_DATABASE_URL=file:./local.db
```

## Shape

- `app/` — routes. Six pages (`/`, `/services`, `/showroom`, `/poggenpohl`,
  `/process`, `/contact`) plus `app/api/inquiry/route.ts`.
- `content/site.ts` — all copy and data in one file. **Imported by a client
  component, so it must not read Node-only globals at the top level.**
- `components/` — shared UI; `components/ui/` is shadcn/ui.
- `db/` — Drizzle schema and the libSQL client.
- `drizzle/` — generated SQL migrations.

## Database

Consultation form submissions are stored in a **libSQL (Turso)** database.
The schema is SQLite, so `drizzle/0000_*.sql` applies as-is.

Create one and wire it up:

```bash
turso db create atelier-living-group
turso db show --url atelier-living-group     # -> TURSO_DATABASE_URL
turso db tokens create atelier-living-group  # -> TURSO_AUTH_TOKEN
```

The API route creates the `inquiries` table on first write if it is missing, so
no manual migration step is required to get going.

If `TURSO_DATABASE_URL` is unset the site still builds and renders; the forms
return a 503 with a phone-number fallback and log the submission server-side,
rather than failing silently.

## Deploying to Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new). Vercel
   detects Next.js automatically — no `vercel.json` is needed.
2. Add environment variables under **Settings → Environment Variables**:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
3. Deploy.

After the domain is final, update `public/robots.txt` and `public/sitemap.xml`
— they carry the origin literally and are not templated.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate SQL from `db/schema.ts` |

## History

This project was originally scaffolded on `vinext`, which compiles to a
Cloudflare Worker and used Cloudflare D1. It was ported to standard Next.js so
it could run on Vercel: the Worker entry point, the Vite/Cloudflare build
plugins and the D1 binding were removed, and the data layer moved to libSQL.
The page markup and styling were unchanged by that port.
