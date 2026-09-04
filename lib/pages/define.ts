/**
 * Page-content registry: the schema half.
 *
 * Every public page declares its editable copy here, in a `content.ts` file
 * that sits next to the page. The declaration carries the CURRENT copy as the
 * default value for each field, so a page renders exactly as before until an
 * admin overrides something in /dashboard/pages/<slug>/content.
 *
 * This module is intentionally free of server-only imports (no Prisma, no
 * next/cache): the dashboard editor is a client component and receives the
 * whole `PageDef` as a prop, so everything in here must be plain data.
 */

export type Locale = "ar" | "en";
export type PageKind = "home" | "site" | "landing";

export type TextField = {
  kind: "text";
  label: string;
  default: string;
  hint?: string;
  maxLength?: number;
};

export type TextareaField = {
  kind: "textarea";
  label: string;
  default: string;
  hint?: string;
  maxLength?: number;
  rows?: number;
};

export type ListField = {
  kind: "list";
  label: string;
  default: string[];
  hint?: string;
  maxItems?: number;
  maxLength?: number;
};

/** Fields allowed inside a repeated item. Nested `items` are not supported. */
export type ItemFieldDef = TextField | TextareaField | ListField;

export type ItemsField<I extends Record<string, ItemFieldDef> = Record<string, ItemFieldDef>> = {
  kind: "items";
  label: string;
  itemFields: I;
  default: ItemValues<I>[];
  hint?: string;
  /** Locks the row count. Use whenever items are zipped with icons or images
   *  in page code by index, so the two arrays can never fall out of step. */
  fixed?: boolean;
  maxItems?: number;
};

export type FieldDef = ItemFieldDef | ItemsField;

export type SectionDef = {
  /** Shown as the card title in the editor. Arabic is fine. */
  title: string;
  hint?: string;
  fields: Record<string, FieldDef>;
};

export type PageDef<S extends Record<string, SectionDef> = Record<string, SectionDef>> = {
  /** Registry key and PageContent primary key. */
  slug: string;
  /** Human label in the dashboard. */
  title: string;
  /** Public path, used for preview links and revalidation. */
  path: string;
  kind: PageKind;
  locale: Locale;
  /** LeadSource.slug this page's form posts to, or null when it has no form. */
  leadSource: string | null;
  /** Extra public paths to revalidate when this page is saved. */
  extraPaths?: string[];
  /** Labels for `Lead.data` keys this page's form collects. */
  formFields?: { key: string; label: string }[];
  sections: S;
};

/* ------------------------------------------------------------------ */
/* Value inference                                                     */
/* ------------------------------------------------------------------ */

export type FieldValue<F> = F extends { kind: "text" | "textarea" }
  ? string
  : F extends { kind: "list" }
    ? string[]
    : F extends ItemsField<infer I>
      ? ItemValues<I>[]
      : never;

export type ItemValues<I extends Record<string, ItemFieldDef>> = {
  [K in keyof I]: FieldValue<I[K]>;
};

export type SectionValues<S extends SectionDef> = {
  [F in keyof S["fields"]]: FieldValue<S["fields"][F]>;
};

export type ContentOf<P extends PageDef> = {
  [S in keyof P["sections"]]: SectionValues<P["sections"][S]>;
};

/* ------------------------------------------------------------------ */
/* Builders — keep content.ts files readable                           */
/* ------------------------------------------------------------------ */

export function t(label: string, dflt: string, o?: Omit<Partial<TextField>, "kind">): TextField {
  return { kind: "text", label, default: dflt, ...o };
}

export function ta(
  label: string,
  dflt: string,
  o?: Omit<Partial<TextareaField>, "kind">,
): TextareaField {
  return { kind: "textarea", label, default: dflt, ...o };
}

export function li(
  label: string,
  dflt: string[],
  o?: Omit<Partial<ListField>, "kind">,
): ListField {
  return { kind: "list", label, default: dflt, ...o };
}

export function items<const I extends Record<string, ItemFieldDef>>(
  label: string,
  itemFields: I,
  dflt: ItemValues<I>[],
  o?: { fixed?: boolean; maxItems?: number; hint?: string },
): ItemsField<I> {
  return { kind: "items", label, itemFields, default: dflt, ...o };
}

const SEO_HINT = "Shown in Google results and when the page is shared.";

/** The SEO section every page carries; feeds `generateMetadata`. */
export function seoSection(title: string, description: string) {
  return {
    title: "SEO",
    hint: SEO_HINT,
    fields: {
      title: t("Browser / search title", title, { maxLength: 180 }),
      description: ta("Meta description", description, { maxLength: 400, rows: 3 }),
    },
  } satisfies SectionDef;
}

/** SEO plus a separate description for social cards (most landings have one). */
export function seoSectionWithOg(title: string, description: string, ogDescription: string) {
  return {
    title: "SEO",
    hint: SEO_HINT,
    fields: {
      title: t("Browser / search title", title, { maxLength: 180 }),
      description: ta("Meta description", description, { maxLength: 400, rows: 3 }),
      ogDescription: ta("Social share description", ogDescription, { maxLength: 400, rows: 3 }),
    },
  } satisfies SectionDef;
}

export function definePage<const S extends Record<string, SectionDef>>(def: PageDef<S>): PageDef<S> {
  return def;
}

/* ------------------------------------------------------------------ */
/* Helpers shared by the merge layer and the editor                    */
/* ------------------------------------------------------------------ */

/** Flat override key for one field, e.g. "hero.line1". */
export function fieldKey(section: string, field: string): string {
  return `${section}.${field}`;
}

/** Every [key, field] pair of a page, in declaration order. */
export function allFields(def: PageDef): [string, FieldDef, string, string][] {
  const out: [string, FieldDef, string, string][] = [];
  for (const [sectionKey, section] of Object.entries(def.sections)) {
    for (const [fieldName, field] of Object.entries(section.fields)) {
      out.push([fieldKey(sectionKey, fieldName), field, sectionKey, fieldName]);
    }
  }
  return out;
}

export function fieldDefault(field: FieldDef): string | string[] | Record<string, unknown>[] {
  return structuredClone(field.default) as string | string[] | Record<string, unknown>[];
}

/** The content object a page renders with when nothing is overridden. */
export function defaultsOf<P extends PageDef>(def: P): ContentOf<P> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [sectionKey, section] of Object.entries(def.sections)) {
    out[sectionKey] = {};
    for (const [fieldName, field] of Object.entries(section.fields)) {
      out[sectionKey][fieldName] = fieldDefault(field);
    }
  }
  return out as ContentOf<P>;
}
