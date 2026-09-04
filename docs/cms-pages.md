# Page content CMS

Every public page's wording is editable at `/dashboard/pages`. Nothing about the
layout, images, colours or animation is editable: the CMS covers text only.

## How it works

Each page declares its editable fields in a `content.ts` next to it, using the
current wording as the DEFAULT of every field. The database stores **only what an
admin changed**, as a flat map of `"section.field"` keys on the `PageContent`
row for that page. Anything not overridden keeps coming from the code, so a copy
change made by a developer still reaches pages nobody has edited.

```
lib/pages/
  define.ts      types + builders (t, ta, li, items, seoSection) and ContentOf<>
  schema.ts      zod schema built from a definition; used when saving
  merge.ts       defaults + overrides -> content; diff before storing
  registry.ts    every page, with @@landing markers for the scaffold script
  get.ts         getPageContent(def) / getPageOverrides(slug), React-cached
  home.ts        merges the home overrides onto the locale dictionary
  revalidate.ts  which paths to bust after a save
```

## Adding a field to an existing page

1. Open the page's `content.ts` and add the field to a section:
   ```ts
   hero: {
     title: "الغلاف",
     fields: {
       // …
       note: t("سطر إضافي", "نصٌّ افتراضي"),
     },
   },
   ```
2. Read it in the page: `content.hero.note`.

That is the whole change. The editor picks the field up automatically, and pages
that were saved before the field existed fall back to its default.

## Adding a whole page

1. Create `content.ts` next to the page with `definePage({ … })`.
2. Import it in `lib/pages/registry.ts` and add it to `PAGES`.
3. In the page: `const c = await getPageContent(MY_PAGE)`, plus
   `export const revalidate = 300` and a `generateMetadata` built from `c.seo`.

New landings scaffolded with the `mahadahlan-landing` skill get all three for
free.

## Field kinds

| Builder | Value | Use for |
|---|---|---|
| `t(label, default)` | `string` | headings, buttons, labels |
| `ta(label, default)` | `string` | paragraphs (renders a textarea) |
| `li(label, default)` | `string[]` | bullet lists, marquee words |
| `items(label, itemFields, default)` | `object[]` | cards, FAQ, steps, testimonials |

Pass `{ fixed: true }` to `items()` whenever the rows are paired with icons or
images in the page by index. A fixed list locks its row count, so the two arrays
can never fall out of step, and the editor hides add/remove.

Icons, image paths, hrefs, class names and colours never go in `content.ts`.
Keep them in a `const X_ICONS = [...] as const` array in the page and zip by
index:

```tsx
const cards = c.signs.cards.map((card, i) => ({ ...card, icon: SIGN_ICONS[i] }));
```

## The home page

`/` and `/en` are two registry entries (`home-ar`, `home-en`) built by one
factory in `app/_home/content.ts` from the locale dictionary. `getHomeDict()`
merges the overrides back onto `DICT[locale]`, and `SiteShell` passes the result
to every chrome component. Because the header, top bar and footer render on every
website page, saving the Arabic home revalidates the root layout.

## Caching

Public pages are ISR at `revalidate = 300`. Saving copy calls `revalidatePath`
for that page, so edits appear immediately in production. `next dev` never caches,
so verify revalidation with `npm run build && npm start`, not with the dev server.

## Permissions

Administrators and managers can edit. Agents see the editor read-only. Both can
work with leads.
