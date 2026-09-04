function Row({ items }: { items: string[] }) {
  return (
    <div dir="rtl" className="flex items-center gap-[34px] pe-[34px]">
      {items.map((t) => (
        <span key={t} className="flex items-center gap-[34px]">
          <span className="text-[0.95rem] font-bold whitespace-nowrap text-[#F0D48A]">
            {t}
          </span>
          <span className="text-[var(--color-nkl-bronze)]">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Tilted dark treatments marquee under the hero. */
export function MarqueeStrip({ words }: { words: string[] }) {
  return (
    // LTR wrapper keeps the looping track anchored to the left edge so the
    // strip is always full; the reversed animation makes it FLOW right-to-left.
    <div
      dir="ltr"
      className="relative z-[5] -mx-5 mt-[-10px] -rotate-[1.3deg] overflow-hidden border-y border-[rgba(201,156,78,0.35)] bg-[var(--color-nkl-dark)] py-[15px] shadow-[0_24px_50px_-30px_rgba(39,28,17,0.5)]"
    >
      {/* 4 copies: the -50% loop segment (2 rows) must be wider than any
          viewport, else the reset shows an empty stretch */}
      <div
        className="nkl-marquee-track nkl-marquee-reverse"
        style={{ "--nkl-marquee-duration": "40s" } as React.CSSProperties}
      >
        <Row items={words} />
        <Row items={words} />
        <Row items={words} />
        <Row items={words} />
      </div>
    </div>
  );
}
