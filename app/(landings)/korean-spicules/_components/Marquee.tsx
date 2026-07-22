"use client";

const ITEMS = [
  "تقنية كورية أصيلة",
  "إبر طبيعية ١٠٠٪ من الإسفنج البحري",
  "بدون جهاز · بدون جراحة",
  "تحفيز طبيعي للكولاجين",
  "نتائج خلال أسبوع",
  "+١٨٠٠ جلسة ناجحة",
  "إشراف خبيرات معتمدات",
];

export function Marquee() {
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
