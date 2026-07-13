"use client";

const ITEMS = [
  "بروتوكول كوري أصيل",
  "بدون إبر · بدون نقاهة",
  "إشراف د. مها دحلان",
  "+٢٤٠٠ جلسة ناجحة",
  "منتجات كورية طبية موثوقة",
  "تقييم ٤.٩ / ٥",
  "نتائج من أول جلسة",
];

export function Marquee() {
  return (
    <div className="relative z-10 overflow-hidden border-y border-[var(--color-gls-line-soft)] bg-[#1d2023]/50 py-4 backdrop-blur-sm">
      <div
        className="gls-marquee flex w-max whitespace-nowrap text-sm font-semibold text-[var(--color-gls-ink-soft)]"
        dir="rtl"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="gls-marquee-group flex min-w-[100vw] shrink-0 items-center justify-around gap-12 px-6"
            dir="rtl"
            aria-hidden={copy === 1}
          >
            {ITEMS.map((item) => (
              <span key={item} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--color-gls-primary)]" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
