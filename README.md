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
- Numbers are always Western digits (client rule); `toArabicDigits()` now normalises TO Western digits

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
| `/en` | English home page (`app/en/`, `app/_home/i18n/dictionary.ts`); the header "EN"/"AR" pill switches |
| `/about-us` | static copy from the old site + doctors from the DB |
| `/services` | index of the 14 treatment landings (`SPECIALTIES`) + booking services from the DB |
| `/offers` | `Offer` table; "احجزي العرض" modal posts a lead with `source: "offers"` |
| `/doctors`, `/doctors/[slug]` | `Doctor` table (+ the doctor's published articles) |
| `/our-devices`, `/our-devices/[slug]` | `Device` table |
| `/book-now` | `Service` table for the select; posts a lead with `source: "book-now"`; supports `?service=`, `?doctor=`, `?offer=` |
| `/careers` | recruiting page; applications post a lead with `source: "careers"` |
| `/news-articles`, `/news-articles/[slug]` | `Article` + `Category` tables; `?category=`, `?page=` |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` |
| `/<landing-slug>` | `app/(landings)/<slug>/page.tsx` (untouched campaign pages) |

Shared chrome lives in `app/_home/`: `HomePage` (the home composition, takes a
`locale`), `SiteShell` (providers + palette + header + footer + WhatsApp FAB +
mobile sticky bar), `i18n/` (dictionary + `useLocale()`; every visible chrome
string lives there in Arabic and English), `Sections` (`SectionHead`, `Section`,
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
  `message`, `preferredAt`, `paymentMethod`, `offerId` from the website forms,
  and an optional `extra` object for anything a single page asks that the schema
  does not cover). Unknown `source` slugs self-register a `LeadSource` with UTM
  links. `/dashboard/leads` filters by page, status, date range, assignee and
  free text, exports the filtered view as CSV, and each lead has a detail page
  with notes and a full history of status and assignment changes.
- **Pages** (`/dashboard/pages`) — the wording of every public page, edited by
  page and section, plus that page's leads and charts on its own tabs. Text only:
  no images, no HTML. See `docs/cms-pages.md`.
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

1. Create `app/(landings)/<slug>/` with a server `page.tsx` (metadata + content
   load), a `content.ts` holding the copy, and a `"use client"` body under
   `_components/Landing.tsx`. Lenis and GSAP are mounted by the group layout;
   import icons from `@/components/icons`. The `mahadahlan-landing` skill
   scaffolds all of this.
2. Register the page in `lib/pages/registry.ts` so it appears in
   `/dashboard/pages` (the scaffold script does this at its marker comments).
3. Post the form to `/api/leads` with `source: "<slug>"` — the source and its
   UTM links are created on the first submission.
4. Add the landing to `SPECIALTIES` in `app/_home/config.ts` so it appears on
   the home page, the footer, the about page and the sitemap.

## Project layout

```
app/
  layout.tsx                 # root: lang=ar dir=rtl, fonts, metadata
  page.tsx, _home/           # home page + shared site chrome
  (site)/                    # about-us, offers, doctors, our-devices, book-now, news-articles
  (landings)/                # campaign landing pages (one folder each)
  (panel)/login, dashboard/  # admin panel (LTR, English UI)
  api/leads, api/auth, api/admin/upload, api/admin/leads/export
  sitemap.ts, robots.ts, not-found.tsx
components/icons, providers, usablecomponents, landing
lib/content.ts (public reads), lib/admin/* (CMS helpers), lib/pages/* (page-copy registry)
lib/prisma.ts, lib/metrics.ts, lib/utm.ts, lib/gtag.ts
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
