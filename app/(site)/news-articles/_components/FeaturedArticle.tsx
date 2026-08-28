import Link from "next/link";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "@/app/_home/config";
import {
  excerptFromHtml,
  formatArabicDate,
  readingMinutesFromHtml,
  type ArticleListItem,
} from "@/lib/content";
import { ArticleCover } from "./ArticleCover";
import { AuthorMeta } from "./AuthorMeta";
import { readingLabel } from "./format";

/** Large split card for the featured article: copy right, cover left (RTL). */
export function FeaturedArticle({ article }: { article: ArticleListItem }) {
  const href = `/news-articles/${article.slug}`;
  const excerpt = article.excerpt?.trim() || excerptFromHtml(article.content, 220);
  const minutes = article.readingMinutes ?? readingMinutesFromHtml(article.content);
  const date = formatArabicDate(article.publishedAt ?? article.createdAt);

  return (
    <article className="group relative grid overflow-hidden rounded-[32px] border border-[var(--color-md-line-strong)] bg-[#120D07] transition-[border-color,box-shadow] duration-400 hover:border-[rgba(232,195,106,0.55)] hover:shadow-[0_0_60px_-20px_rgba(232,195,106,0.45)] lg:grid-cols-[1fr_1.05fr]">
      <div className="relative flex flex-col p-7 sm:p-10 lg:p-12">
        <div
          className="pointer-events-none absolute -top-28 -right-20 size-72 rounded-full blur-[48px]"
          style={{ background: "radial-gradient(circle, rgba(232,195,106,.2), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative flex flex-wrap items-center gap-2.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.74rem] font-extrabold text-[var(--color-md-ink)]"
            style={{ background: GOLD_GRADIENT }}
          >
            <Icon.Star className="size-3.5 fill-current" />
            مقال مميز
          </span>
          {article.category ? (
            <Link
              href={`/news-articles?category=${article.category.slug}`}
              className="rounded-full border border-[var(--color-md-line-strong)] px-3.5 py-1.5 text-[0.74rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:bg-[rgba(240,212,138,0.1)]"
            >
              {article.category.name}
            </Link>
          ) : null}
        </div>

        <h2 className="relative mt-5 text-[clamp(1.45rem,3vw,2.1rem)] leading-[1.5] font-extrabold text-[var(--color-md-text)]">
          <Link href={href} className="transition-colors hover:text-[var(--color-md-champagne)]">
            {article.title}
          </Link>
        </h2>

        <p className="relative mt-4 line-clamp-4 text-[0.98rem] leading-[1.9] font-light text-[rgba(246,238,223,0.62)]">
          {excerpt}
        </p>

        <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.78rem] font-bold text-[rgba(246,238,223,0.5)]">
          <AuthorMeta author={article.author} withTitle link={false} />
          <span className="inline-flex items-center gap-1.5">
            <Icon.Clock className="size-3.5 text-[var(--color-md-champagne)]" />
            {readingLabel(minutes)}
          </span>
          <time dateTime={(article.publishedAt ?? article.createdAt).toISOString()}>{date}</time>
        </div>

        <div className="relative mt-8">
          <Link
            href={href}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3.5 text-[0.95rem] font-extrabold text-[var(--color-md-ink)] shadow-[0_0_30px_-8px_rgba(232,195,106,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-8px_rgba(255,223,142,0.75)]"
            style={{ background: GOLD_GRADIENT }}
          >
            اقرئي المقال كاملاً
            <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
          </Link>
        </div>
      </div>

      <Link href={href} aria-label={article.title} className="relative block min-h-[260px] overflow-hidden lg:min-h-0">
        <ArticleCover
          src={article.coverImage}
          alt={article.coverAlt ?? article.title}
          sizes="(max-width: 1024px) 100vw, 620px"
          priority
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#120D07] via-transparent to-transparent opacity-0 lg:opacity-100"
          aria-hidden
        />
      </Link>
    </article>
  );
}
