import { z } from "zod";
import { bool, dateTime, int, list, optText, text } from "./form";
import { SLUG_PATTERN, slugify } from "./slugify";

/* ───────────────────────── shared pieces ───────────────────────── */

/** Slug may be blank (derived from the title server-side) or a clean slug. */
const slugField = z
  .string()
  .trim()
  .max(120, "Slug is too long")
  .refine((s) => s === "" || SLUG_PATTERN.test(slugify(s)), "Use letters, digits and dashes only");

const optional = (max: number) => z.string().trim().max(max).nullable();
const optionalUrl = optional(1000);
const listField = z.array(z.string().trim().min(1).max(300)).max(50);
const orderField = z
  .number({ error: "Order must be a whole number" })
  .int("Order must be a whole number")
  .min(-1000)
  .max(100000)
  .nullable()
  .transform((n) => n ?? 0);

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/* ───────────────────────── articles ───────────────────────── */

export const ArticleSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  slug: slugField,
  categoryId: z.string().nullable(),
  authorId: z.string().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"], { error: "Pick a status" }),
  featured: z.boolean(),
  publishedAt: z.date().nullable(),
  coverImage: optionalUrl,
  coverAlt: optional(300),
  excerpt: optional(600),
  seoTitle: optional(200),
  seoDescription: optional(400),
  content: z
    .string()
    .max(500_000, "Content is too long")
    .refine((html) => stripHtml(html).length > 0 || /<img\b/i.test(html), "Content is required"),
});
export type ArticleInput = z.infer<typeof ArticleSchema>;

export function parseArticleForm(fd: FormData) {
  return ArticleSchema.parse({
    title: text(fd, "title"),
    slug: text(fd, "slug"),
    categoryId: optText(fd, "categoryId"),
    authorId: optText(fd, "authorId"),
    status: text(fd, "status"),
    featured: bool(fd, "featured"),
    publishedAt: dateTime(fd, "publishedAt"),
    coverImage: optText(fd, "coverImage"),
    coverAlt: optText(fd, "coverAlt"),
    excerpt: optText(fd, "excerpt"),
    seoTitle: optText(fd, "seoTitle"),
    seoDescription: optText(fd, "seoDescription"),
    content: text(fd, "content"),
  });
}

/* ───────────────────────── categories ───────────────────────── */

export const CategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: slugField,
  description: optional(600),
  order: orderField,
});
export type CategoryInput = z.infer<typeof CategorySchema>;

export function parseCategoryForm(fd: FormData) {
  return CategorySchema.parse({
    name: text(fd, "name"),
    slug: text(fd, "slug"),
    description: optText(fd, "description"),
    order: int(fd, "order"),
  });
}

/* ───────────────────────── doctors ───────────────────────── */

export const DoctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: slugField,
  title: z.string().trim().min(1, "Title is required").max(200),
  bio: optional(4000),
  credentials: listField,
  specialties: listField,
  image: optionalUrl,
  imageAlt: optional(300),
  order: orderField,
  active: z.boolean(),
});
export type DoctorInput = z.infer<typeof DoctorSchema>;

export function parseDoctorForm(fd: FormData) {
  return DoctorSchema.parse({
    name: text(fd, "name"),
    slug: text(fd, "slug"),
    title: text(fd, "title"),
    bio: optText(fd, "bio"),
    credentials: list(fd, "credentials"),
    specialties: list(fd, "specialties"),
    image: optText(fd, "image"),
    imageAlt: optText(fd, "imageAlt"),
    order: int(fd, "order"),
    active: bool(fd, "active"),
  });
}

/* ───────────────────────── devices ───────────────────────── */

export const DeviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  nameEn: optional(120),
  slug: slugField,
  tagline: optional(300),
  description: optional(4000),
  usedFor: listField,
  image: optionalUrl,
  imageAlt: optional(300),
  order: orderField,
  active: z.boolean(),
});
export type DeviceInput = z.infer<typeof DeviceSchema>;

export function parseDeviceForm(fd: FormData) {
  return DeviceSchema.parse({
    name: text(fd, "name"),
    nameEn: optText(fd, "nameEn"),
    slug: text(fd, "slug"),
    tagline: optText(fd, "tagline"),
    description: optText(fd, "description"),
    usedFor: list(fd, "usedFor"),
    image: optText(fd, "image"),
    imageAlt: optText(fd, "imageAlt"),
    order: int(fd, "order"),
    active: bool(fd, "active"),
  });
}

/* ───────────────────────── offers ───────────────────────── */

export const OfferSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    slug: slugField,
    description: optional(2000),
    price: z
      .number({ error: "Price is required" })
      .int("Price must be whole riyals")
      .min(0, "Price can't be negative")
      .max(10_000_000),
    oldPrice: z.number({ error: "Old price must be a number" }).int("Old price must be whole riyals").min(0).max(10_000_000).nullable(),
    badge: optional(60),
    category: optional(120),
    image: optionalUrl,
    imageAlt: optional(300),
    order: orderField,
    active: z.boolean(),
    startsAt: z.date().nullable(),
    endsAt: z.date().nullable(),
  })
  .superRefine((o, ctx) => {
    if (o.oldPrice !== null && o.oldPrice <= o.price) {
      ctx.addIssue({ code: "custom", path: ["oldPrice"], message: "Old price must be higher than the price" });
    }
    if (o.startsAt && o.endsAt && o.endsAt < o.startsAt) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "End must be after the start" });
    }
  });
export type OfferInput = z.infer<typeof OfferSchema>;

export function parseOfferForm(fd: FormData) {
  const price = int(fd, "price");
  return OfferSchema.parse({
    title: text(fd, "title"),
    slug: text(fd, "slug"),
    description: optText(fd, "description"),
    price: price === null ? undefined : price,
    oldPrice: int(fd, "oldPrice"),
    badge: optText(fd, "badge"),
    category: optText(fd, "category"),
    image: optText(fd, "image"),
    imageAlt: optText(fd, "imageAlt"),
    order: int(fd, "order"),
    active: bool(fd, "active"),
    startsAt: dateTime(fd, "startsAt"),
    endsAt: dateTime(fd, "endsAt"),
  });
}

/* ───────────────────────── services ───────────────────────── */

export const ServiceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  slug: slugField,
  group: optional(120),
  description: optional(1000),
  landingSlug: z.string().trim().max(80).nullable(),
  order: orderField,
  active: z.boolean(),
});
export type ServiceInput = z.infer<typeof ServiceSchema>;

export function parseServiceForm(fd: FormData) {
  return ServiceSchema.parse({
    name: text(fd, "name"),
    slug: text(fd, "slug"),
    group: optText(fd, "group"),
    description: optText(fd, "description"),
    landingSlug: optText(fd, "landingSlug"),
    order: int(fd, "order"),
    active: bool(fd, "active"),
  });
}
