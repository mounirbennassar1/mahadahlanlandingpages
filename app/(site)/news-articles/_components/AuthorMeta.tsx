import Image from "next/image";
import Link from "next/link";
import { isOptimizableImage } from "@/lib/site";
import type { ArticleListItem } from "@/lib/content";

type Author = ArticleListItem["author"];

export function AuthorAvatar({
  author,
  size = 36,
  className = "",
}: {
  author: NonNullable<Author>;
  size?: number;
  className?: string;
}) {
  if (author.image) {
    return (
      <span
        className={`relative inline-block shrink-0 overflow-hidden rounded-full border border-[rgba(201,156,78,0.35)] bg-[var(--color-md-card)] ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={author.image}
          alt={author.name}
          fill
          sizes={`${size}px`}
          unoptimized={!isOptimizableImage(author.image)}
          className="object-cover object-top"
        />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-[0.85rem] font-extrabold text-[#FFFDF8] ${className}`}
      style={{ width: size, height: size, background: "linear-gradient(135deg, #8A6430, #E0BE7A)" }}
      aria-hidden
    >
      {author.name.replace(/^د\.\s*/, "").charAt(0)}
    </span>
  );
}

/** Avatar + name (+ optional role line), optionally linking to the doctor profile. */
export function AuthorMeta({
  author,
  withTitle = false,
  link = true,
  size = 36,
}: {
  author: Author;
  withTitle?: boolean;
  link?: boolean;
  size?: number;
}) {
  if (!author) {
    return (
      <span className="text-[0.82rem] font-bold text-[rgba(246,238,223,0.6)]">
        فريق عيادات د. مها دحلان
      </span>
    );
  }

  const inner = (
    <>
      <AuthorAvatar author={author} size={size} />
      <span className="min-w-0 leading-[1.3]">
        <span className="block truncate text-[0.86rem] font-extrabold text-[var(--color-md-text)]">
          {author.name}
        </span>
        {withTitle ? (
          <span className="block truncate text-[0.74rem] text-[rgba(246,238,223,0.5)]">
            {author.title}
          </span>
        ) : null}
      </span>
    </>
  );

  if (!link) return <span className="inline-flex min-w-0 items-center gap-2.5">{inner}</span>;

  return (
    <Link
      href={`/doctors/${author.slug}`}
      className="group/author inline-flex min-w-0 items-center gap-2.5 transition-colors hover:text-[var(--color-md-champagne)]"
    >
      {inner}
    </Link>
  );
}
