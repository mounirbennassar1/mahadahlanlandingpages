function Row({ words }: { words: string[] }) {
  return (
    <span className="inline-flex items-center gap-11">
      {words.map((p) => (
        <span key={p} className="inline-flex items-center gap-11">
          <span
            dir="rtl"
            className="faa-serif text-[1.1rem] whitespace-nowrap text-[var(--color-faa-ink-soft)]"
          >
            {p}
          </span>
          <span className="text-[0.6rem] text-[var(--color-faa-gold-deep)]">
            ◆
          </span>
        </span>
      ))}
    </span>
  );
}

/** Gold serif keyword marquee between the hero and the problem section. */
export function MarqueeStrip({ words }: { words: string[] }) {
  return (
    <div
      dir="ltr"
      className="overflow-hidden border-y border-[rgba(217,179,108,0.16)] py-[15px]"
      style={{
        background:
          "linear-gradient(90deg, rgba(217,179,108,.05), rgba(110,31,53,.12), rgba(217,179,108,.05))",
        maskImage:
          "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
      }}
    >
      <div
        className="faa-marquee-track gap-11"
        style={{ "--faa-marquee-duration": "32s" } as React.CSSProperties}
      >
        <Row words={words} />
        <Row words={words} />
      </div>
    </div>
  );
}
