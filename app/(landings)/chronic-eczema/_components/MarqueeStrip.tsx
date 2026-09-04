function Row({ words }: { words: string[] }) {
  return (
    <div dir="rtl" className="flex items-center gap-[38px] pe-[38px]">
      {words.map((t) => (
        <span key={t} className="flex items-center gap-[38px]">
          <span className="text-[0.82rem] font-extrabold tracking-[0.14em] whitespace-nowrap text-[var(--color-che-gold-bright)]">
            {t}
          </span>
          <span className="text-[0.7rem] text-[var(--color-che-plum)]">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Editorial ticker: a slim treatments index running between two hairlines. */
export function MarqueeStrip({ words }: { words: string[] }) {
  return (
    // LTR wrapper keeps the looping track anchored to the left edge so the
    // strip is always full; the reversed animation makes it FLOW right-to-left.
    <div
      dir="ltr"
      className="relative z-[5] overflow-hidden border-y border-[var(--color-che-line)] bg-[var(--color-che-bg-2)] py-[13px]"
    >
      {/* 4 copies: the -50% loop segment (2 rows) must be wider than any
          viewport, else the reset shows an empty stretch */}
      <div
        className="che-ticker-track che-ticker-reverse"
        style={{ "--che-ticker-duration": "46s" } as React.CSSProperties}
      >
        <Row words={words} />
        <Row words={words} />
        <Row words={words} />
        <Row words={words} />
      </div>
    </div>
  );
}
