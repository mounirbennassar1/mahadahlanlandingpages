"use client";

const ITEMS = [
  "زمالة الكلية الملكية البريطانية",
  "+١٢ سنة خبرة",
  "+٢٨٠٠ حالة معالجة",
  "عضوة الجمعية الأوروبية للجلدية",
  "تقييم ٤.٩ / ٥",
  "متابعة شخصية لكل حالة",
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)] py-4">
      <div className="mrf-marquee flex w-max gap-12 whitespace-nowrap text-sm font-semibold text-[var(--color-mrf-ink-soft)]">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} dir="rtl" className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-[var(--color-mrf-primary)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
