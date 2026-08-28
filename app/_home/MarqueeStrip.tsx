import type { CSSProperties } from "react";
import { getDict, LANG_META, type Locale } from "./i18n/dictionary";

function Row({ items, dir }: { items: string[]; dir: "rtl" | "ltr" }) {
  return (
    <div dir={dir} className="flex items-center gap-[34px] pe-[34px]">
      {items.map((t) => (
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
export function MarqueeStrip({ locale = "ar" }: { locale?: Locale }) {
  const items = getDict(locale).marquee;
  const dir = LANG_META[locale].dir;
  return (
    // LTR wrapper keeps the looping track anchored to the left edge so the
    // strip is always full. Arabic reverses the animation so the strip flows
    // with its reading direction; English runs the plain (leftward) loop.
    <div
      dir="ltr"
      className="relative z-[5] -mx-5 -mt-12 -rotate-[1.3deg] overflow-hidden lg:-mt-16 border-y border-[rgba(232,195,106,0.4)] bg-[#120D07] py-[15px] shadow-[0_0_44px_-10px_rgba(232,195,106,0.35)]"
    >
      {/* 4 copies: the -50% loop segment (2 rows) must be wider than any
          viewport, else the reset shows an empty stretch */}
      <div
        className={dir === "rtl" ? "md-marquee-track md-marquee-reverse" : "md-marquee-track"}
        style={{ "--md-marquee-duration": "64s" } as CSSProperties}
      >
        <Row items={items} dir={dir} />
        <Row items={items} dir={dir} />
        <Row items={items} dir={dir} />
        <Row items={items} dir={dir} />
      </div>
    </div>
  );
}
