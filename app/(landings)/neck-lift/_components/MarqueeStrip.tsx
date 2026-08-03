const ITEMS = [
  "شد الرقبة بالخيوط",
  "الهايفو HIFU",
  "بوتوكس نفرتيتي",
  "فيلر خط الفك",
  "سكين بوستر",
  "محفزات الكولاجين",
  "الليزر التجميلي",
];

function Row() {
  return (
    <div className="flex items-center gap-[34px] pe-[34px]">
      {ITEMS.map((t) => (
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
export function MarqueeStrip() {
  return (
    <div className="relative z-[5] -mx-5 mt-[-10px] -rotate-[1.3deg] overflow-hidden border-y border-[rgba(201,156,78,0.35)] bg-[var(--color-nkl-dark)] py-[15px] shadow-[0_24px_50px_-30px_rgba(39,28,17,0.5)]">
      <div
        className="nkl-marquee-track"
        style={{ "--nkl-marquee-duration": "26s" } as React.CSSProperties}
      >
        <Row />
        <Row />
      </div>
    </div>
  );
}
