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
  // The track must be ≥ 2× the viewport so the visible area is
  // always populated as content scrolls. Render the list once inside
  // a "set" wrapper, then duplicate that wrapper. The keyframe slides
  // exactly one wrapper's width (-50% of the track), so the second
  // wrapper seamlessly takes over with no gap and no jump.
  const Set = () => (
    <div className="flex shrink-0 items-center gap-12 pe-12">
      {ITEMS.map((item, i) => (
        <span key={i} dir="rtl" className="flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-[var(--color-mrf-primary)]" />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div
      dir="ltr"
      className="overflow-hidden border-y border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)] py-4"
    >
      <div className="mrf-marquee flex w-max whitespace-nowrap text-sm font-semibold text-[var(--color-mrf-ink-soft)]">
        <Set />
        <Set />
        <Set />
        <Set />
      </div>
    </div>
  );
}
