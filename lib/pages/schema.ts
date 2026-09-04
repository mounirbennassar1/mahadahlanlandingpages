import { z } from "zod";
import { allFields, type FieldDef, type PageDef } from "./define";

/**
 * Builds a zod schema from a page definition. Used on save (strict: the editor
 * always submits every field) and, per field, by the lenient read-time merge in
 * `merge.ts`.
 */

const DEFAULT_TEXT_MAX = 200;
const DEFAULT_TEXTAREA_MAX = 2000;
const DEFAULT_LIST_ITEMS = 50;
// List entries are single strings but are also used for whole paragraphs
// (about-us tells the clinic's story as a list), so the cap is an abuse guard
// rather than an editorial limit.
const DEFAULT_LIST_ITEM_MAX = 2000;
const DEFAULT_ITEMS_MAX = 50;

export function fieldSchema(field: FieldDef): z.ZodTypeAny {
  switch (field.kind) {
    // No .trim(): some strings are fragments joined in JSX and depend on their
    // leading/trailing space (e.g. the footer copyright around the year).
    case "text":
      return z.string().max(field.maxLength ?? DEFAULT_TEXT_MAX);
    case "textarea":
      return z.string().max(field.maxLength ?? DEFAULT_TEXTAREA_MAX);
    case "list":
      return z
        .array(z.string().max(field.maxLength ?? DEFAULT_LIST_ITEM_MAX))
        .max(field.maxItems ?? DEFAULT_LIST_ITEMS);
    case "items": {
      const shape: Record<string, z.ZodTypeAny> = {};
      for (const [key, def] of Object.entries(field.itemFields)) shape[key] = fieldSchema(def);
      const item = z.object(shape);
      const arr = z.array(item).max(field.maxItems ?? DEFAULT_ITEMS_MAX);
      return field.fixed
        ? arr.length(field.default.length, `This list must keep ${field.default.length} items`)
        : arr;
    }
  }
}

/** Strict schema for the editor payload: every key present, no extras. */
export function buildContentSchema(def: PageDef) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [key, field] of allFields(def)) shape[key] = fieldSchema(field);
  return z.object(shape).strict();
}

export type ContentPayload = Record<string, string | string[] | Record<string, unknown>[]>;
