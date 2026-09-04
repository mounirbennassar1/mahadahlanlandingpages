import {
  allFields,
  fieldDefault,
  type ContentOf,
  type FieldDef,
  type PageDef,
} from "./define";
import { fieldSchema } from "./schema";

/**
 * Read and write sides of the override map.
 *
 * Reads are deliberately lenient: a stored value that no longer matches the
 * schema (because the code default changed shape) falls back to the default for
 * that one field instead of breaking the page. Writes are strict and go through
 * `buildContentSchema`.
 */

export type Overrides = Record<string, unknown>;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Merge one stored value over a field default. For `items`, values are merged
 * per index over the defaults so properties the editor does not expose (hrefs,
 * image paths, icon slots kept in code) survive an edit.
 */
export function mergeField(field: FieldDef, stored: unknown): unknown {
  const fallback = fieldDefault(field);
  if (stored === undefined || stored === null) return fallback;

  if (field.kind === "items") {
    if (!Array.isArray(stored)) return fallback;
    const rows = field.fixed
      ? field.default.map((_, i) => stored[i])
      : (stored as unknown[]);
    const merged = rows.map((row, i) => {
      const base = (field.default[i] ?? field.default[0] ?? {}) as Record<string, unknown>;
      if (!isPlainObject(row)) return structuredClone(base);
      const out: Record<string, unknown> = structuredClone(base);
      for (const [key, itemField] of Object.entries(field.itemFields)) {
        const parsed = fieldSchema(itemField).safeParse(row[key]);
        if (parsed.success) out[key] = parsed.data;
      }
      return out;
    });
    return merged;
  }

  const parsed = fieldSchema(field).safeParse(stored);
  return parsed.success ? parsed.data : fallback;
}

/** Defaults with the stored overrides applied. Never throws. */
export function mergeContent<P extends PageDef>(def: P, overrides: Overrides): ContentOf<P> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [key, field, sectionKey, fieldName] of allFields(def)) {
    out[sectionKey] ??= {};
    out[sectionKey][fieldName] = mergeField(field, overrides?.[key]);
  }
  return out as ContentOf<P>;
}

/**
 * Order-insensitive deep comparison.
 *
 * Values coming back from zod are rebuilt in schema order, while the defaults
 * are written in whatever order reads best in `content.ts`. A plain
 * `JSON.stringify` compare would call those two different and store an override
 * nobody asked for, freezing that field against future edits in code.
 */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function sameValue(a: unknown, b: unknown): boolean {
  return canonical(a) === canonical(b);
}

/**
 * Keep only what differs from the code defaults, so a copy change in code still
 * reaches pages the admin never touched.
 */
export function diffContent(def: PageDef, values: Record<string, unknown>): Overrides {
  const out: Overrides = {};
  for (const [key, field] of allFields(def)) {
    const value = values[key];
    if (value === undefined) continue;
    if (sameValue(value, field.default)) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0 && field.default.length === 0) continue;
    out[key] = value;
  }
  return out;
}

/** Stored keys the schema no longer declares (surfaced in the editor). */
export function orphanKeys(def: PageDef, overrides: Overrides): string[] {
  const known = new Set(allFields(def).map(([key]) => key));
  return Object.keys(overrides ?? {}).filter((key) => !known.has(key));
}

/** Which fields an admin has changed, as a flat key set (for "Modified" badges). */
export function modifiedKeys(def: PageDef, overrides: Overrides): Set<string> {
  const out = new Set<string>();
  for (const [key, field] of allFields(def)) {
    if (overrides?.[key] === undefined) continue;
    if (sameValue(overrides[key], field.default)) continue;
    out.add(key);
  }
  return out;
}
