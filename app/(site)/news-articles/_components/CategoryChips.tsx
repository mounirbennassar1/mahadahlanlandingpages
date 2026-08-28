import Link from "next/link";
import { GOLD_GRADIENT, toArabicDigits } from "@/app/_home/config";

export type ChipCategory = { slug: string; name: string; articleCount: number };

/** Server-rendered category links; the active one is a gold pill. */
export function CategoryChips({
  categories,
  active,
}: {
  categories: ChipCategory[];
  active: string | null;
}) {
  const allCount = categories.reduce((n, c) => n + c.articleCount, 0);
  const chips = [
    { slug: null as string | null, name: "الكل", count: allCount, href: "/news-articles" },
    ...categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: c.articleCount,
      href: `/news-articles?category=${encodeURIComponent(c.slug)}`,
    })),
  ];

  return (
    <nav aria-label="تصنيفات المقالات" className="md-carousel -mx-[22px] overflow-x-auto px-[22px]">
      <ul className="flex w-max gap-2 py-1 sm:w-auto sm:flex-wrap sm:justify-center">
        {chips.map((chip) => {
          const on = chip.slug === active;
          return (
            <li key={chip.slug ?? "all"} className="shrink-0">
              <Link
                href={chip.href}
                aria-current={on ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[0.84rem] font-extrabold transition-all duration-300 ${
                  on
                    ? "border-transparent text-[var(--color-md-ink)] shadow-[0_0_24px_-8px_rgba(232,195,106,0.7)]"
                    : "border-[var(--color-md-line-strong)] text-[rgba(246,238,223,0.72)] hover:border-[rgba(232,195,106,0.6)] hover:text-[var(--color-md-champagne)]"
                }`}
                style={on ? { background: GOLD_GRADIENT } : undefined}
              >
                {chip.name}
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.7rem] ${
                    on ? "bg-[rgba(36,26,14,0.18)]" : "bg-[rgba(246,238,223,0.07)] text-[rgba(246,238,223,0.55)]"
                  }`}
                >
                  {toArabicDigits(chip.count)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
