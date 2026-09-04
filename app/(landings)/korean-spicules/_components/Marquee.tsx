"use client";

/** Trust strip; the words come from the page content. */
export function Marquee({ items }: { items: string[] }) {
  const ITEMS = items;
  return (
    <div className="relative z-10 overflow-hidden border-y border-[var(--color-kos-line-soft)] bg-black/50 py-4 backdrop-blur-sm">
      <div
        className="kos-marquee flex w-max whitespace-nowrap text-sm font-semibold text-[var(--color-kos-ink-soft)]"
        dir="rtl"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex min-w-[100vw] shrink-0 items-center justify-around gap-12 px-6"
            dir="rtl"
            aria-hidden={copy === 1}
          >
            {ITEMS.map((item) => (
              <span key={item} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--color-kos-primary)]" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
