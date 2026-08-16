import type { CSSProperties } from "react";

const ITEMS = [
  "بوتوكس وفيلر",
  "هايدرافيشل",
  "الجلاس سكين الكوري",
  "شد الرقبة",
  "علاج التصبّغات",
  "نحت الجسم",
  "علاج تساقط الشعر",
  "ميكرونيدلينغ RF",
  "علاج حب الشباب",
];

function Row() {
  return (
    <div dir="rtl" className="flex items-center gap-[34px] pe-[34px]">
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center gap-[34px]">
          <span className="md-neon-text text-[0.95rem] font-bold whitespace-nowrap">
            {t}
          </span>
          <span className="text-[var(--color-md-gold)]">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Tilted dark treatments marquee under the hero. */
export function MarqueeStrip() {
  return (
    // LTR wrapper keeps the looping track anchored to the left edge so the
    // strip is always full; the reversed animation makes it FLOW right-to-left.
    <div
      dir="ltr"
      className="relative z-[5] -mx-5 -rotate-[1.3deg] overflow-hidden border-y border-[rgba(232,195,106,0.4)] bg-[#120D07] py-[15px] shadow-[0_0_44px_-10px_rgba(232,195,106,0.35)]"
    >
      {/* 4 copies: the -50% loop segment (2 rows) must be wider than any
          viewport, else the reset shows an empty stretch */}
      <div
        className="md-marquee-track md-marquee-reverse"
        style={{ "--md-marquee-duration": "46s" } as CSSProperties}
      >
        <Row />
        <Row />
        <Row />
        <Row />
      </div>
    </div>
  );
}
