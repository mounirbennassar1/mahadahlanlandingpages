const ITEMS = [
  "بروتين علاجي للشعر",
  "ترميم روابط الشعرة",
  "ميزوثيرابي الفروة",
  "تشخيص رقمي دقيق",
  "ترطيب عميق",
  "قص أطراف علاجي",
  "روتين حماية حرارية",
];

function Row() {
  return (
    <div dir="rtl" className="flex items-center gap-[34px] pe-[34px]">
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center gap-[34px]">
          <span className="text-[0.95rem] font-bold whitespace-nowrap text-[#1A1405]">
            {t}
          </span>
          <span className="text-[rgba(26,20,5,0.55)]">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Tilted liquid-gold treatments marquee under the hero (RTL flow). */
export function MarqueeStrip() {
  return (
    // LTR wrapper keeps the looping track anchored to the left edge so the
    // strip is always full; the reversed animation makes it FLOW right-to-left.
    <div
      dir="ltr"
      className="relative z-[5] -mx-5 mt-[-10px] -rotate-[1.3deg] overflow-hidden border-y border-[rgba(240,212,138,0.5)] py-[15px] shadow-[0_24px_60px_-26px_rgba(212,175,55,0.45)]"
      style={{
        background: "linear-gradient(90deg, #8A6430, #F0D48A 35%, #C9A45C 70%, #8A6430)",
      }}
    >
      {/* 4 copies: the -50% loop segment (2 rows) must be wider than any
          viewport, else the reset shows an empty stretch */}
      <div
        className="hab-marquee-track hab-marquee-reverse"
        style={{ "--hab-marquee-duration": "40s" } as React.CSSProperties}
      >
        <Row />
        <Row />
        <Row />
        <Row />
      </div>
    </div>
  );
}
