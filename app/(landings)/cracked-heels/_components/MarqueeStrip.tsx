const ITEMS = [
  "باديكير طبي معقم",
  "تقشير علاجي للكعبين",
  "ترطيب عميق مكثف",
  "علاج التصبغات",
  "عناية طبية بالقدم",
  "خطة منزلية مخصصة",
  "متابعة حتى النتيجة",
];

function Row() {
  return (
    <div dir="rtl" className="flex items-center gap-[34px] pe-[34px]">
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center gap-[34px]">
          <span className="text-[0.95rem] font-bold whitespace-nowrap text-[#F0DCA4]">
            {t}
          </span>
          <span className="text-[var(--color-crh-bronze)]">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Tilted bronze treatments marquee under the hero. */
export function MarqueeStrip() {
  return (
    // LTR wrapper keeps the looping track anchored to the left edge so the
    // strip is always full; the reversed animation makes it FLOW right-to-left.
    <div
      dir="ltr"
      className="relative z-[5] -mx-5 mt-[-10px] -rotate-[1.3deg] overflow-hidden border-y border-[rgba(212,175,55,0.3)] bg-[var(--color-crh-bg-deep)] py-[15px] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)]"
    >
      {/* 4 copies: the -50% loop segment (2 rows) must be wider than any
          viewport, else the reset shows an empty stretch */}
      <div
        className="crh-marquee-track crh-marquee-reverse"
        style={{ "--crh-marquee-duration": "40s" } as React.CSSProperties}
      >
        <Row />
        <Row />
        <Row />
        <Row />
      </div>
    </div>
  );
}
