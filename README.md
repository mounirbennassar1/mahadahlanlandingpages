# Maha Dahlan — Centralized Landing Pages

One Next.js project, one Postgres database, one Vercel deployment for **all**
Maha Dahlan landing pages. Each campaign is a folder under `app/(landings)/`
and can have its own design, animations, and assets.

## Stack

- **Next.js 16.2** (App Router, Turbopack, React 19.2)
- **Tailwind CSS v4** (CSS-first config via `@theme inline` in `globals.css`)
- **Prisma 7** with `@prisma/adapter-pg` against the existing dashboard Postgres
- **Framer Motion**, **GSAP** (`@gsap/react` + ScrollTrigger), **Lenis** smooth scroll
- **Icons**: FontAwesome brands for social, Lucide for UI, `react-icons` for everything else
- **Arabic / RTL by default** — `<html lang="ar" dir="rtl">`, Cairo + IBM Plex Sans Arabic fonts

## Getting started

```bash
cp .env.example .env
# Fill in DATABASE_URL with the existing dashboard's Postgres connection string.

npx prisma db pull      # introspect the existing schema into prisma/schema.prisma
npx prisma generate     # regenerate the Prisma Client
npm run dev             # http://localhost:3000
```

`npx prisma db pull` overwrites the placeholder `Lead` model in
`prisma/schema.prisma` with whatever tables already exist in the dashboard DB.
Don't hand-edit the models after that — re-run `db pull` whenever the dashboard
schema changes.

## Adding a new landing page

1. Create a folder under `app/(landings)/<slug>/` and add a `page.tsx`.
2. Lenis (smooth scroll) and GSAP (ScrollTrigger registered) are already mounted
   in `app/(landings)/layout.tsx`, so any page inside the `(landings)` route
   group gets them automatically.
3. Import icons from `@/components/icons`:
   ```tsx
   import { Icon, SocialIcon } from "@/components/icons";
   <Icon.ArrowRight className="size-4" />
   <SocialIcon name="instagram" className="size-5" />
   ```
4. Submit forms via a Server Action or a route handler under `app/api/`. The
   `source` column on the lead model identifies which landing the submission
   came from.
5. Add the landing to the list rendered in `app/page.tsx` so it shows on the index.

See `app/(landings)/sample/page.tsx` for a reference page combining all three
animation libraries with Arabic copy.

## Project layout

```
app/
  layout.tsx              # root layout — sets lang=ar dir=rtl, loads fonts
  globals.css             # Tailwind v4 + Lenis CSS
  page.tsx                # landings index
  (landings)/
    layout.tsx            # wraps children in <Providers> (Lenis + GSAP)
    sample/page.tsx       # reference landing
components/
  icons/                  # central icon module — import from here
  providers/              # Lenis + GSAP client providers
lib/
  db.ts                   # Prisma client singleton with pg adapter
  fonts.ts                # Cairo + IBM Plex Sans Arabic via next/font/google
  fa-config.ts            # disables FontAwesome runtime CSS injection
  utils.ts                # cn() helper (clsx + tailwind-merge)
prisma/
  schema.prisma           # introspected via `prisma db pull`
prisma.config.ts          # Prisma 7 config — wires the pg adapter for CLI
```

## Next.js 16 — gotchas this project already accounts for

- `params` and `searchParams` are **Promises**. `await props.params` in every
  page/layout. Run `npx next typegen` to get `PageProps<'/foo/[slug]'>` helpers.
- `middleware.ts` is deprecated → use `proxy.ts` (Node runtime only, no Edge).
- Turbopack is the default. No `--turbopack` flag needed in scripts.
- `images.domains` is deprecated → use `images.remotePatterns`.
- `revalidateTag(tag)` now requires a second `cacheLife` argument.
- Don't set `scroll-behavior: smooth` or `data-scroll-behavior="smooth"` — Lenis owns scrolling.

## Prisma 7 — gotchas this project already accounts for

- The `url = env("DATABASE_URL")` field is **removed** from `datasource`.
  Connection strings live in `prisma.config.ts` via the adapter.
- `lib/db.ts` constructs `new PrismaPg({ connectionString })` and passes it to
  `new PrismaClient({ adapter })`. CLI commands (`db pull`, `migrate`) use
  the adapter declared in `prisma.config.ts`.

## Handing over an existing landing

When you share each old landing, send:
1. The repo (or a zip of `app/` / `pages/` plus any custom components).
2. Which animation libs it uses (Framer Motion / GSAP / etc.) so imports stay consistent.
3. The exact shape of the form submission it currently sends to the dashboard
   so we can map it to the right column on the imported leads model.

I'll migrate them one at a time into `app/(landings)/<slug>/`.
