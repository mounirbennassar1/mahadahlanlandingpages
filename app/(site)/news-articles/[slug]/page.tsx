import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuBookOpen } from "react-icons/lu";
import { Icon, SocialIcon } from "@/components/icons";
import { Reveal } from "@/app/_home/Motion";
import { GOLD_GRADIENT, WA_LINK } from "@/app/_home/config";
import {
  excerptFromHtml,
  formatArabicDate,
  getArticleBySlug,
  getPublishedArticles,
  readingMinutesFromHtml,
  stripHtml,
  type ArticleListItem,
} from "@/lib/content";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { getPageContent } from "@/lib/pages/get";
import { PageHero } from "../../_components/PageHero";
import { CtaBand } from "../../_components/CtaBand";
import { ArticleCard } from "../_components/ArticleCard";
import { ArticleCover } from "../_components/ArticleCover";
import { AuthorAvatar, AuthorMeta } from "../_components/AuthorMeta";
import { readingLabel } from "../_components/format";
import { ShareRow } from "./_components/ShareRow";
import { NEWS_ARTICLES } from "../content";
import "../prose.css";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "المقال غير موجود" };

  const title = article.seoTitle?.trim() || article.title;
  const description =
    article.seoDescription?.trim() ||
    article.excerpt?.trim() ||
    excerptFromHtml(article.content);
  const path = `/news-articles/${article.slug}`;
  const image = article.coverImage ? absoluteUrl(article.coverImage) : undefined;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: article.author ? [article.author.name] : undefined,
      section: article.category?.name,
      ...(image ? { images: [{ url: image, alt: article.coverAlt ?? article.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

async function relatedFor(article: ArticleListItem) {
  const picked: ArticleListItem[] = [];
  if (article.category) {
    const { items } = await getPublishedArticles({
      categorySlug: article.category.slug,
      take: 3,
      excludeId: article.id,
    });
    picked.push(...items);
  }
  if (picked.length < 3) {
    const { items } = await getPublishedArticles({ take: 6, excludeId: article.id });
    for (const a of items) {
      if (picked.length >= 3) break;
      if (!picked.some((p) => p.id === a.id)) picked.push(a);
    }
  }
  return picked;
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, c] = await Promise.all([relatedFor(article), getPageContent(NEWS_ARTICLES)]);

  const path = `/news-articles/${article.slug}`;
  const url = absoluteUrl(path);
  const published = article.publishedAt ?? article.createdAt;
  const minutes = article.readingMinutes ?? readingMinutesFromHtml(article.content);
  const excerpt = article.excerpt?.trim() || excerptFromHtml(article.content);
  const words = stripHtml(article.content).split(" ").filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: excerpt,
    image: article.coverImage ? [absoluteUrl(article.coverImage)] : undefined,
    datePublished: published.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    inLanguage: "ar",
    wordCount: words,
    articleSection: article.category?.name,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name,
          jobTitle: article.author.title,
          url: absoluteUrl(`/doctors/${article.author.slug}`),
        }
      : { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.webp") },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <PageHero
        compact
        crumbs={[
          { href: "/news-articles", label: c.hero.crumb },
          ...(article.category
            ? [{ href: `/news-articles?category=${article.category.slug}`, label: article.category.name }]
            : []),
          { label: article.title },
        ]}
        eyebrow={article.category?.name ?? c.detail.eyebrow}
        title={article.title}
        lede={excerpt}
        actions={
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[0.84rem] font-bold text-[rgba(246,238,223,0.6)]">
            <AuthorMeta author={article.author} withTitle />
            <time dateTime={published.toISOString()} className="inline-flex items-center gap-1.5">
              <Icon.CalendarCheck className="size-4 text-[var(--color-md-champagne)]" />
              {formatArabicDate(published)}
            </time>
            <span className="inline-flex items-center gap-1.5">
              <Icon.Clock className="size-4 text-[var(--color-md-champagne)]" />
              {readingLabel(minutes)}
            </span>
          </div>
        }
      />

      <div className="relative z-10 bg-[var(--color-md-band)]">
        {/* cover overlaps the hero's bottom edge */}
        <div className="mx-auto max-w-[1180px] px-[22px]">
          <div className="relative -mt-6 aspect-[16/9] overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] shadow-[0_40px_90px_-40px_rgba(232,195,106,0.35)] sm:-mt-10">
            <ArticleCover
              src={article.coverImage}
              alt={article.coverAlt ?? article.title}
              sizes="(max-width: 1180px) 100vw, 1136px"
              priority
            />
          </div>
        </div>

        <div className="mx-auto grid max-w-[1180px] gap-12 px-[22px] py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          {/* body */}
          <div className="min-w-0">
            <article
              className="md-prose max-w-[72ch]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-[var(--color-md-line)] pt-8">
              <ShareRow url={url} title={article.title} />
              <Link
                href="/news-articles"
                className="inline-flex min-h-11 items-center gap-2 text-[0.86rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:text-[var(--color-md-neon)]"
              >
                <Icon.ArrowRight className="size-4" strokeWidth={2.4} />
                {c.detail.allArticles}
              </Link>
            </div>
          </div>

          {/* sidebar */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-[100px]">
            {article.author ? (
              <Reveal className="rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-6">
                <span className="text-[0.74rem] font-bold text-[var(--color-md-champagne)]">{c.detail.authorLabel}</span>
                <div className="mt-3 flex items-center gap-4">
                  <AuthorAvatar author={article.author} size={64} />
                  <div className="min-w-0">
                    <h3 className="text-[1.02rem] font-extrabold text-[var(--color-md-text)]">{article.author.name}</h3>
                    <p className="mt-0.5 text-[0.8rem] leading-[1.6] text-[rgba(246,238,223,0.55)]">{article.author.title}</p>
                  </div>
                </div>
                <Link
                  href={`/doctors/${article.author.slug}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[0.86rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:text-[var(--color-md-neon)]"
                >
                  {c.detail.authorLink}
                  <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
                </Link>
              </Reveal>
            ) : null}

            <Reveal className="relative overflow-hidden rounded-[24px] border border-[var(--color-md-line-strong)] bg-[#120D07] p-6">
              <div
                className="pointer-events-none absolute -top-20 -left-14 size-52 rounded-full blur-[36px]"
                style={{ background: "radial-gradient(circle, rgba(232,195,106,.22), transparent 70%)" }}
                aria-hidden
              />
              <span className="relative inline-flex items-center gap-2 text-[0.74rem] font-bold text-[var(--color-md-champagne)]">
                <span
                  className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                  style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
                  aria-hidden
                />
                {c.detail.ctaBadge}
              </span>
              <h3 className="relative mt-3 text-[1.15rem] leading-[1.5] font-extrabold text-[var(--color-md-text)]">
                {c.detail.ctaTitle}
                <span className="md-gold-text block">{c.detail.ctaGold}</span>
              </h3>
              <p className="relative mt-2 text-[0.86rem] leading-[1.8] font-light text-[rgba(246,238,223,0.6)]">
                {c.detail.ctaBody}
              </p>
              <div className="relative mt-5 flex flex-col gap-2.5">
                <Link
                  href="/book-now"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.92rem] font-extrabold text-[var(--color-md-ink)] shadow-[0_0_30px_-8px_rgba(232,195,106,0.55)] transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: GOLD_GRADIENT }}
                >
                  <Icon.CalendarCheck className="size-4" />
                  {c.detail.ctaBook}
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[rgba(240,212,138,0.35)] px-6 py-3 text-[0.92rem] font-extrabold text-[#F0D48A] transition-colors hover:bg-[rgba(240,212,138,0.1)]"
                >
                  <SocialIcon name="whatsapp" />
                  {c.detail.ctaWhatsapp}
                </a>
              </div>
            </Reveal>

            {related.length ? (
              <div>
                <h3 className="mb-4 inline-flex items-center gap-2 text-[0.95rem] font-extrabold text-[var(--color-md-text)]">
                  <LuBookOpen className="size-4 text-[var(--color-md-champagne)]" />
                  {c.detail.related}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {related.map((a) => (
                    <ArticleCard key={a.id} article={a} compact />
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      <CtaBand />
    </>
  );
}
