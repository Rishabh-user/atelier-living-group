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

- `app/` — routes: `/` (homepage), `/about`, `/services` (shown as "Kitchens"),
  `/poggenpohl` and `/poggenpohl/[slug]` (one page per collection), `/our-work`,
  `/showroom`, `/contact`, `/faq`, `/service-areas`, `/process`, plus
  `app/api/inquiry/route.ts`. `/gallery` redirects to `/our-work`.
- `content/site.ts` — site-wide copy and data: phone, address, **opening hours**,
  navigation, services, FAQs and the business structured data. **It is imported
  by a client component, so it must not read Node-only globals at the top
  level.**
- `content/products.ts` — the six collection pages. Add or edit a collection
  here; the page template renders whatever is listed.
- `content/projects.ts` — completed Atelier projects for `/our-work`. Empty until
  real, credited project photography is available. Do not list manufacturer
  images here.
- `content/gallery.ts` — Poggenpohl photography shown on `/our-work`.
- `components/` — shared UI; `components/ui/` is shadcn/ui. The homepage hero is
  `HeroSlider` and the sections are in `HomePage`.
- `db/` — Drizzle schema and the libSQL client.
- `drizzle/` — generated SQL migrations.
- `ASSETS.md` — source URL of every Poggenpohl photograph, for brand approval.

## Form emails (Mailjet)

Every form posts to `/api/inquiry`, which emails `MAIL_TO` through Mailjet
(replying to that email answers the visitor) and sends the visitor a short
confirmation. All settings live in `.env.local` / Vercel env vars, see
`.env.example`. The sender in `MAIL_FROM_EMAIL` must be verified in Mailjet
(add the domain and its SPF/DKIM records for best deliverability).

The database below is optional. With Mailjet and/or Turso configured, an
enquiry counts as received if either succeeds; with neither, the forms return
a 503 with the phone-number fallback.

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
   - `MAILJET_API_KEY`, `MAILJET_SECRET_KEY`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `MAIL_TO`
   - optional: `MAIL_AUTOREPLY`, `MAILJET_SANDBOX`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
3. Deploy.

`robots.txt` and `sitemap.xml` are generated from `NEXT_PUBLIC_SITE_URL`, so
setting it is all that is needed when the domain changes.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate SQL from `db/schema.ts` |
| `npm run images:compress` | Re-encode `public/images` (JPEG/WebP) in place |

## History

This project was originally scaffolded on `vinext`, which compiles to a
Cloudflare Worker and used Cloudflare D1. It was ported to standard Next.js so
it could run on Vercel: the Worker entry point, the Vite/Cloudflare build
plugins and the D1 binding were removed, and the data layer moved to libSQL.
The page markup and styling were unchanged by that port.
