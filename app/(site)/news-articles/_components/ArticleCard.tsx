import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  excerptFromHtml,
  formatArabicDate,
  readingMinutesFromHtml,
  type ArticleListItem,
} from "@/lib/content";
import { ArticleCover } from "./ArticleCover";
import { AuthorMeta } from "./AuthorMeta";
import { readingLabel } from "./format";

export function ArticleCard({
  article,
  compact = false,
}: {
  article: ArticleListItem;
  /** Sidebar variant: smaller cover, no excerpt. */
  compact?: boolean;
}) {
  const href = `/news-articles/${article.slug}`;
  const excerpt = article.excerpt?.trim() || excerptFromHtml(article.content);
  const minutes = article.readingMinutes ?? readingMinutesFromHtml(article.content);
  const date = formatArabicDate(article.publishedAt ?? article.createdAt);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]">
      <Link
        href={href}
        aria-label={article.title}
        className={`relative block overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}
      >
        <ArticleCover
          src={article.coverImage}
          alt={article.coverAlt ?? article.title}
          sizes={
            compact
              ? "(max-width: 1024px) 100vw, 340px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          }
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-md-card)] to-transparent"
          aria-hidden
        />
        {article.category ? (
          <span className="absolute top-4 right-4 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(11,8,5,0.85)] px-3 py-1.5 text-[0.72rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
            {article.category.name}
          </span>
        ) : null}
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6"}`}>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.74rem] font-bold text-[rgba(246,238,223,0.5)]">
          <time dateTime={(article.publishedAt ?? article.createdAt).toISOString()}>{date}</time>
          <span className="size-1 rounded-full bg-[var(--color-md-gold)]" aria-hidden />
          <span>{readingLabel(minutes)}</span>
        </div>

        <h3
          className={`mt-2.5 leading-[1.55] font-extrabold text-[var(--color-md-text)] ${
            compact ? "text-[0.98rem]" : "text-[1.1rem]"
          }`}
        >
          <Link href={href} className="transition-colors hover:text-[var(--color-md-champagne)]">
            {article.title}
          </Link>
        </h3>

        {!compact ? (
          <p className="mt-2.5 line-clamp-3 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
            {excerpt}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <AuthorMeta author={article.author} size={compact ? 30 : 36} link={false} />
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 text-[0.8rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:text-[var(--color-md-neon)]"
          >
            اقرئي
            <Icon.ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </article>
  );
}
