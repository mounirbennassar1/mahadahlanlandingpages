# Maha Dahlan — Website, Landing Pages & Admin Panel

One Next.js project, one Postgres database, one Vercel deployment for the
Dr. Maha Dahlan clinic (Jeddah):

- the **public website** at `mahadahlan.com` (home, about, offers, doctors,
  devices, booking, blog),
- every **campaign landing page** under `app/(landings)/<slug>/`, each with its
  own design and assets,
- the **admin panel** at `portal.mahadahlan.com` (`/dashboard`): lead
  management plus the website CMS (articles, categories, doctors, devices,
  offers, services).

## Stack

- **Next.js 16.2** (App Router, React 19.2, webpack build), **Tailwind CSS v4**
- **Prisma 6** on Neon Postgres (`DATABASE_URL` pooled, `DIRECT_DATABASE_URL` for `db push`)
- **NextAuth v5** (credentials, JWT sessions) for the panel
- **Framer Motion**, **GSAP** (`@gsap/react` + ScrollTrigger), **Lenis** smooth scroll
- **Tiptap** rich-text editor (dashboard articles), **@vercel/blob** for image uploads
- Icons: FontAwesome brands (social), Lucide via `@/components/icons`, `react-icons` for the rest
- Arabic / RTL by default — `<html lang="ar" dir="rtl">`; site pages use Almarai

## Getting started

```bash
cp .env.example .env          # fill DATABASE_URL, DIRECT_DATABASE_URL, AUTH_SECRET, ADMIN_*
npm install
npm run db:push               # sync prisma/schema.prisma to the database (additive)
npm run db:seed               # admin user, team, lead sources, sample leads
npm run db:seed:content       # website content scraped from the old site (idempotent by slug)
npm run dev -- -p 3005        # port 3000 is usually taken on the dev machine
```

> On the dev Mac the default `node` is v26 and breaks the Prisma CLI. Prefix
> commands with `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.

Login at `http://localhost:3005/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Public website (`app/(site)/`)

| Route | Source of content |
| --- | --- |
| `/` | `app/page.tsx` + `app/_home/*` (static, hero slider, 14 specialties) |
| `/about-us` | static copy from the old site + doctors from the DB |
| `/offers` | `Offer` table; "احجزي العرض" modal posts a lead with `source: "offers"` |
| `/doctors`, `/doctors/[slug]` | `Doctor` table (+ the doctor's published articles) |
| `/our-devices`, `/our-devices/[slug]` | `Device` table |
| `/book-now` | `Service` table for the select; posts a lead with `source: "book-now"`; supports `?service=`, `?doctor=`, `?offer=` |
| `/news-articles`, `/news-articles/[slug]` | `Article` + `Category` tables; `?category=`, `?page=` |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` |
| `/<landing-slug>` | `app/(landings)/<slug>/page.tsx` (untouched campaign pages) |

Shared chrome lives in `app/_home/`: `SiteShell` (providers + palette + header +
footer + WhatsApp FAB + mobile sticky bar), `Sections` (`SectionHead`, `Section`,
`Glow`), `Motion` (GSAP reveals/counters), `config.ts` (phone, WhatsApp, hours,
maps, `SPECIALTIES`). Site-only primitives are in `app/(site)/_components/`
(`PageHero`, `CtaBand`, buttons, monogram fallback) and `app/(site)/_booking/`
(form fields + lead posting). Read helpers for the DB are in `lib/content.ts`.

Pages that read the DB export `revalidate = 300`; the dashboard calls
`revalidatePath()` after every edit (`lib/admin/revalidate.ts`), so changes show
up immediately in production.

## Admin panel (`app/(panel)/dashboard/`)

- **Leads** — every form on the site and the landings posts to `POST /api/leads`
  (`{ fullName, phone, city, source, …utm }`, plus optional `email`, `service`,
  `message`, `preferredAt`, `paymentMethod`, `offerId` from the website forms).
  Unknown `source` slugs self-register a `LeadSource` with UTM links.
- **Website** section (`/dashboard/content/*`) — CRUD for articles (Tiptap
  editor, cover image, category, author, draft/published, featured, SEO),
  categories, doctors, devices, offers (price in SAR, badge, active window),
  services (booking select, grouped, optional link to a landing).
  `ADMIN`/`MANAGER` can edit, `AGENT` is read-only.
- **Uploads** — `POST /api/admin/upload` stores images in Vercel Blob when
  `BLOB_READ_WRITE_TOKEN` is set; locally it writes to `public/uploads/`
  (git-ignored). Any image field also accepts a pasted URL.
- `proxy.ts` keeps `/login`, `/dashboard`, `/api/auth`, `/api/admin` on the
  `portal.` host only (404 on the public host) and gates them by session.

Environment for production: `DATABASE_URL`, `DIRECT_DATABASE_URL`,
`AUTH_SECRET`, `AUTH_URL=https://portal.mahadahlan.com`,
`NEXT_PUBLIC_SITE_URL=https://mahadahlan.com`, `BLOB_READ_WRITE_TOKEN`,
optionally `LANDING_ORIGINS`.

## Adding a new landing page

1. Create `app/(landings)/<slug>/page.tsx` (Lenis + GSAP are mounted by the
   group layout). Import icons from `@/components/icons`.
2. Post the form to `/api/leads` with `source: "<slug>"` — the source and its
   UTM links are created on the first submission.
3. Add the landing to `SPECIALTIES` in `app/_home/config.ts` so it appears on
   the home page, the footer, the about page and the sitemap.

## Project layout

```
app/
  layout.tsx                 # root: lang=ar dir=rtl, fonts, metadata
  page.tsx, _home/           # home page + shared site chrome
  (site)/                    # about-us, offers, doctors, our-devices, book-now, news-articles
  (landings)/                # campaign landing pages (one folder each)
  (panel)/login, dashboard/  # admin panel (LTR, English UI)
  api/leads, api/auth, api/admin/upload
  sitemap.ts, robots.ts, not-found.tsx
components/icons, providers, usablecomponents, landing
lib/content.ts (public reads), lib/admin/* (CMS helpers), lib/prisma.ts, lib/utm.ts, lib/gtag.ts
prisma/schema.prisma, seed.ts, seed-content.ts
public/site/*                # images migrated from the old website
```

## Next.js 16 gotchas already handled here

- `params` / `searchParams` are Promises — `await` them in every page/layout.
- `middleware.ts` is deprecated → `proxy.ts` (Node runtime).
- Cache Components are off, so use `revalidate` + `revalidatePath(path)`.
- `images.domains` is deprecated → `images.remotePatterns` (blob, cloudinary,
  mahadahlan.com are allowed).
- Don't set `scroll-behavior: smooth` — Lenis owns scrolling.
- Only one `next dev` per checkout; if the Turbopack dev cache panics, delete
  `.next/dev/cache` or run `next dev --webpack`.
