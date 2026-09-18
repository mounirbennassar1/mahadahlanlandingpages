# Maha Dahlan — Campaign Landing Pages

The ad landing pages of the Dr. Maha Dahlan clinic (Jeddah), served at
`lp.mahadahlan.com`. One Next.js project, one Vercel deployment, landings only:

- every **campaign landing page** under `app/(landings)/<slug>/`, each with its
  own design and assets, WhatsApp CTAs, the noon checkout and Google Ads
  conversion tracking,
- the public API routes the landings need: `POST /api/leads` (lead capture),
  `POST /api/checkout` + `GET /api/checkout/status` (noon), `POST /api/noon/webhook`.

Everything else, the **public website** (`www.mahadahlan.com`: home, about,
services, offers, doctors, devices, booking, blog) and the **admin panel**
(`portal.mahadahlan.com`), lives in the separate `mahadahlanwebsite` repository.
Both deployments share the same Neon database:

- leads and orders created here show up in the website's dashboard,
- page copy edited in `/dashboard/pages` there is read here through the same
  `PageContent` table (pages revalidate every 5 minutes),
- packages and offers sold here are managed there,
- a noon checkout started here returns the visitor to
  `www.mahadahlan.com/checkout/<reference>`, which the website serves.

`proxy.ts` redirects every path that is not a landing, an API route or a
static asset to the same path on the website, so links to `/offers`,
`/book-now` or `/` on this host still work.

## Stack

- **Next.js 16.2** (App Router, React 19.2, webpack build), **Tailwind CSS v4**
- **Prisma 6** on Neon Postgres (`DATABASE_URL` pooled). The schema is owned by
  the website repo: never run `prisma db push` from here.
- **Framer Motion**, **GSAP** (`@gsap/react` + ScrollTrigger), **Lenis** smooth scroll
- Icons: FontAwesome brands (social), Lucide via `@/components/icons`, `react-icons`
- Arabic / RTL by default — `<html lang="ar" dir="rtl">`; Almarai for headings
- Numbers are always Western digits (client rule)

## Getting started

```bash
cp .env.example .env.local    # DATABASE_URL, NEXT_PUBLIC_SITE_URL, NOON_* ...
npm install
npm run dev -- -p 3005        # port 3000 is usually taken on the dev machine
```

> On the dev Mac the default `node` is v26 and breaks the Prisma CLI. Prefix
> commands with `export PATH=/opt/homebrew/opt/node@24/bin:$PATH`.

Open `http://localhost:3005/acne` (or any other slug). The root `/` redirects
to the website.

## Environment (Vercel)

- `DATABASE_URL`, `DIRECT_DATABASE_URL`: the same Neon database as the website.
- `NEXT_PUBLIC_SITE_URL=https://www.mahadahlan.com`: the website. Used for the
  canonical / Open Graph URLs (so Google indexes the website, not this host),
  the noon return URL and the redirect target for non-landing paths.
- `NOON_BUSINESS_ID`, `NOON_APP_ID`, `NOON_APP_KEY`, `NOON_ENV`, `NOON_REGION`,
  `NOON_ORDER_CATEGORY`, `NOON_WEBHOOK_SECRET`: identical to the website's.
- `NOINDEX_ADS_HOST=true` once the website is indexed in Search Console: adds
  `X-Robots-Tag: noindex` on the landings (crawling stays allowed for AdsBot).
- `LANDING_ORIGINS` (optional): CORS allow-list for `/api/leads`.

## Adding a new landing page

1. Create `app/(landings)/<slug>/` with a server `page.tsx` (metadata + content
   load), a `content.ts` holding the copy, and a `"use client"` body under
   `_components/Landing.tsx`. Lenis and GSAP are mounted by the group layout;
   import icons from `@/components/icons`. The `mahadahlan-landing` skill
   scaffolds all of this. Wrap the page in `CheckoutProvider` (items from
   `getSellableItems(slug)`) and use `PayButton` / `CheckoutPanel`; copy the
   pattern from `app/(landings)/acne`.
2. Register the page in `lib/pages/registry.ts` (the scaffold does this at its
   marker comments). The proxy allow-list is derived from the registry, so an
   unregistered landing is redirected to the website.
3. Post the form to `/api/leads` with `source: "<slug>"`; the source and its
   UTM links are created on the first submission.
4. Copy the folder to the website repo as well (strip WhatsApp, `ask="booking"`)
   and register it there too, including `SPECIALTIES` in `app/_home/config.ts`
   so it appears on the home page, the footer and the sitemap. Keep
   `content.ts` byte-identical in both repos so the dashboard edits the same
   fields for both hosts. Run `npm run check:content` after touching a
   `content.ts`.

## Project layout

```
app/
  layout.tsx                 # root: lang=ar dir=rtl, fonts, metadata
  (landings)/                # campaign landing pages (one folder each)
  api/leads, api/checkout, api/noon/webhook
  robots.ts, not-found.tsx
  _home/config.ts            # clinic constants (phone, WhatsApp, hours, SPECIALTIES)
components/icons, providers, checkout, landing, usablecomponents
lib/booking.ts (phone validation, cities), lib/orders.ts + lib/noon.ts (checkout)
lib/pages/* (page-copy registry), lib/sources.ts (lead sources + UTM), lib/prisma.ts
prisma/schema.prisma         # copy of the shared schema, for `prisma generate` only
proxy.ts                     # landings here, everything else -> the website
```

## Next.js 16 gotchas already handled here

- `params` / `searchParams` are Promises — `await` them in every page/layout.
- `middleware.ts` is deprecated → `proxy.ts` (Node runtime).
- Cache Components are off, so use `revalidate`.
- `images.domains` is deprecated → `images.remotePatterns`.
- Don't set `scroll-behavior: smooth` — Lenis owns scrolling.
- Only one `next dev` per checkout; if the Turbopack dev cache panics, delete
  `.next/dev/cache` or run `next dev --webpack`.
