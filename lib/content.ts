import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Read helpers for the website content managed in /dashboard.
 *
 * Everything here is server-only (it touches Prisma). Public pages call these
 * from Server Components; the dashboard mutates the same tables through its
 * own server actions and calls `revalidatePath()` on the affected routes.
 */

/* ───────────────────────── articles ───────────────────────── */

export const articleListInclude = {
  category: true,
  author: {
    select: { id: true, slug: true, name: true, title: true, image: true },
  },
} satisfies Prisma.ArticleInclude;

export type ArticleListItem = Prisma.ArticleGetPayload<{
  include: typeof articleListInclude;
}>;

export type ArticleListOptions = {
  categorySlug?: string;
  take?: number;
  skip?: number;
  /** Exclude one article (e.g. the one currently being read). */
  excludeId?: string;
};

function publishedWhere(): Prisma.ArticleWhereInput {
  return {
    status: "PUBLISHED",
    OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
  };
}

export async function getPublishedArticles(opts: ArticleListOptions = {}) {
  const where: Prisma.ArticleWhereInput = {
    ...publishedWhere(),
    ...(opts.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
    ...(opts.excludeId ? { id: { not: opts.excludeId } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: articleListInclude,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: opts.take,
      skip: opts.skip,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, ...publishedWhere() },
    include: articleListInclude,
  });
}

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { articles: { where: publishedWhere() } } },
    },
  });
  return categories.map((c) => ({ ...c, articleCount: c._count.articles }));
}

/* ───────────────────────── doctors ───────────────────────── */

export async function getActiveDoctors() {
  return prisma.doctor.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getDoctorBySlug(slug: string) {
  return prisma.doctor.findFirst({
    where: { slug, active: true },
    include: {
      articles: {
        where: publishedWhere(),
        include: articleListInclude,
        orderBy: { publishedAt: "desc" },
        take: 6,
      },
    },
  });
}

/* ───────────────────────── devices ───────────────────────── */

export async function getActiveDevices() {
  return prisma.device.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getDeviceBySlug(slug: string) {
  return prisma.device.findFirst({ where: { slug, active: true } });
}

/* ───────────────────────── offers ───────────────────────── */

export async function getActiveOffers() {
  const now = new Date();
  return prisma.offer.findMany({
    where: {
      active: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getOfferBySlug(slug: string) {
  return prisma.offer.findFirst({ where: { slug, active: true } });
}

/* ───────────────────────── services ───────────────────────── */

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

/** Services grouped by their `group` label, preserving `order`. */
export async function getActiveServicesGrouped() {
  const services = await getActiveServices();
  const groups = new Map<string, typeof services>();
  for (const s of services) {
    const key = s.group ?? "خدمات أخرى";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }
  return Array.from(groups, ([group, items]) => ({ group, items }));
}

/* ───────────────────────── text utils ───────────────────────── */

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** ~180 Arabic words per minute, never below 1. */
export function readingMinutesFromHtml(html: string) {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function excerptFromHtml(html: string, max = 160) {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toArabicDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** "١٬٢٥٠ ر.س" style price label. */
export function formatSar(amount: number) {
  return `${toArabicDigits(amount.toLocaleString("en-US"))} ر.س`;
}

export function formatArabicDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("ar-SA-u-nu-arab-ca-gregory", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
