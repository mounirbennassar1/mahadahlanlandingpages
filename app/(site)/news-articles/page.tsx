import type { Metadata } from "next";
import Link from "next/link";
import { LuNewspaper } from "react-icons/lu";
import { Icon } from "@/components/icons";
import { Reveal, RevealGroup } from "@/app/_home/Motion";
import { Glow } from "@/app/_home/Sections";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getCategoriesWithCounts, getPublishedArticles } from "@/lib/content";
import { PageHero, type Crumb } from "../_components/PageHero";
import { CtaBand } from "../_components/CtaBand";
import { ArticleCard } from "./_components/ArticleCard";
import { CategoryChips } from "./_components/CategoryChips";
import { FeaturedArticle } from "./_components/FeaturedArticle";
import { Pagination } from "./_components/Pagination";
import { ReviewsBand } from "./_components/ReviewsBand";

export const revalidate = 300;

const PAGE_SIZE = 12;

const DESCRIPTION =
  "مقالات طبية وعلمية من طبيبات عيادات د. مها دحلان في جدة: العناية بالبشرة، الليزر، الشعر والفروة، التجميل غير الجراحي ونصائح ما قبل الجلسات وبعدها.";

export const metadata: Metadata = {
  title: "المقالات",
  description: DESCRIPTION,
  alternates: { canonical: "/news-articles" },
  openGraph: {
    title: "أحدث المقالات | عيادات د. مها دحلان",
    description: DESCRIPTION,
    url: "/news-articles",
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() || null;
}

export default async function NewsArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categorySlug = first(sp.category);
  const pageRaw = Number.parseInt(first(sp.page) ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const [categories, { items, total }] = await Promise.all([
    getCategoriesWithCounts(),
    getPublishedArticles({
      categorySlug: categorySlug ?? undefined,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
  ]);

  const activeCategory = categorySlug
    ? (categories.find((c) => c.slug === categorySlug) ?? null)
    : null;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const featured = page === 1 && items[0]?.featured ? items[0] : null;
  const rest = featured ? items.slice(1) : items;

  const crumbs: Crumb[] = activeCategory
    ? [{ href: "/news-articles", label: "المقالات" }, { label: activeCategory.name }]
    : [{ label: "المقالات" }];

  return (
    <>
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow="مقالات طبية وعلمية"
        title="أحدث المقالات"
        gold={activeCategory ? `في ${activeCategory.name}` : "من طبيباتنا"}
        lede={
          activeCategory?.description ??
          "قراءات موثوقة تكتبها طبيبات العيادة: ما الذي يحدث في الجلسة، لمن تناسب، وكيف تعتنين ببشرتك وشعرك قبلها وبعدها."
        }
      />

      <section className="relative bg-[var(--color-md-band)] px-[22px] py-[56px] sm:py-[72px]">
        <Glow className="-top-10 left-1/4 h-[300px] w-[560px]" />
        <div className="relative mx-auto max-w-[1180px]">
          <Reveal>
            <CategoryChips categories={categories} active={activeCategory?.slug ?? null} />
          </Reveal>

          {items.length === 0 ? (
            <Reveal className="mt-10">
              <EmptyState
                category={activeCategory?.name ?? (categorySlug ? "هذا التصنيف" : null)}
                page={page}
              />
            </Reveal>
          ) : (
            <>
              {featured ? (
                <Reveal className="mt-10">
                  <FeaturedArticle article={featured} />
                </Reveal>
              ) : null}

              {rest.length ? (
                <>
                  <div className="mt-12 mb-6 flex items-center justify-between gap-4">
                    <h2 className="inline-flex items-center gap-2.5 text-[1.15rem] font-extrabold text-[var(--color-md-text)]">
                      <LuNewspaper className="size-5 text-[var(--color-md-champagne)]" />
                      {featured ? "مقالات أخرى" : "كل المقالات"}
                    </h2>
                    <span className="text-[0.8rem] font-bold text-[rgba(246,238,223,0.5)]">
                      الصفحة {toAr(page)} من {toAr(totalPages)}
                    </span>
                  </div>
                  <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {rest.map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </RevealGroup>
                </>
              ) : null}

              <Pagination page={page} totalPages={totalPages} category={activeCategory?.slug ?? null} />
            </>
          )}
        </div>
      </section>

      <ReviewsBand />

      <CtaBand
        eyebrow="المواعيد محدودة أسبوعياً"
        title="قرأتِ ما يكفي؟"
        gold="احجزي استشارتك"
        body="أخبرينا بما يشغلك، ونرسل لكِ التقييم المبدئي والتكلفة المتوقعة قبل أن تخطي خطوة واحدة نحو العيادة."
      />
    </>
  );
}

function toAr(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

function EmptyState({ category, page }: { category: string | null; page: number }) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] px-7 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]">
        <LuNewspaper className="size-6" />
      </span>
      <h2 className="mt-5 text-[1.2rem] font-extrabold text-[var(--color-md-text)]">
        {page > 1
          ? "لا توجد مقالات في هذه الصفحة"
          : category
            ? `لا توجد مقالات في ${category} بعد`
            : "لا توجد مقالات منشورة بعد"}
      </h2>
      <p className="mt-2 max-w-[44ch] text-[0.92rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
        ننشر مقالات جديدة باستمرار من طبيبات العيادة. تصفّحي بقية التصنيفات أو احجزي استشارتك مباشرة.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/news-articles"
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[rgba(240,212,138,0.35)] px-6 py-3 text-[0.9rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:bg-[rgba(240,212,138,0.1)]"
        >
          كل المقالات
        </Link>
        <Link
          href="/book-now"
          className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-[0.9rem] font-extrabold text-[var(--color-md-ink)]"
          style={{ background: GOLD_GRADIENT }}
        >
          <Icon.CalendarCheck className="size-4" />
          احجزي استشارة
        </Link>
      </div>
    </div>
  );
}
