import Link from "next/link";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT, toArabicDigits } from "@/app/_home/config";

function hrefFor(page: number, category: string | null) {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return `/news-articles${s ? `?${s}` : ""}`;
}

/** Page numbers with ellipses around the current page. */
function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

const pill =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-4 text-[0.86rem] font-extrabold transition-all duration-300";

export function Pagination({
  page,
  totalPages,
  category,
}: {
  page: number;
  totalPages: number;
  category: string | null;
}) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? hrefFor(page - 1, category) : null;
  const next = page < totalPages ? hrefFor(page + 1, category) : null;

  return (
    <nav aria-label="تصفح صفحات المقالات" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {prev ? (
        <Link href={prev} className={`${pill} border-[var(--color-md-line-strong)] text-[var(--color-md-champagne)] hover:bg-[rgba(240,212,138,0.1)]`}>
          <Icon.ChevronRight className="size-4" />
          السابق
        </Link>
      ) : (
        <span aria-disabled className={`${pill} cursor-not-allowed border-[var(--color-md-line)] text-[rgba(246,238,223,0.3)]`}>
          <Icon.ChevronRight className="size-4" />
          السابق
        </span>
      )}

      {pageWindow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-[rgba(246,238,223,0.4)]" aria-hidden>
            …
          </span>
        ) : p === page ? (
          <span
            key={p}
            aria-current="page"
            className={`${pill} border-transparent text-[var(--color-md-ink)] shadow-[0_0_24px_-8px_rgba(232,195,106,0.7)]`}
            style={{ background: GOLD_GRADIENT }}
          >
            {toArabicDigits(p)}
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p, category)}
            aria-label={`الصفحة ${toArabicDigits(p)}`}
            className={`${pill} border-[var(--color-md-line-strong)] text-[rgba(246,238,223,0.72)] hover:border-[rgba(232,195,106,0.6)] hover:text-[var(--color-md-champagne)]`}
          >
            {toArabicDigits(p)}
          </Link>
        ),
      )}

      {next ? (
        <Link href={next} className={`${pill} border-[var(--color-md-line-strong)] text-[var(--color-md-champagne)] hover:bg-[rgba(240,212,138,0.1)]`}>
          التالي
          <Icon.ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span aria-disabled className={`${pill} cursor-not-allowed border-[var(--color-md-line)] text-[rgba(246,238,223,0.3)]`}>
          التالي
          <Icon.ChevronLeft className="size-4" />
        </span>
      )}
    </nav>
  );
}
