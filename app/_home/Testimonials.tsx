import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";
import {
  getDict,
  LANG_META,
  type Locale,
  type ReviewEntry,
  type Dict,
} from "./i18n/dictionary";

/* Genuine quotes from the clinic's public Google reviews
   (MD Clinics: 4.8 stars, 1,271+ reviews). Long reviews are split across
   the two rows; nothing here is invented. The English rows carry faithful
   translations of the same reviews. Data lives in `i18n/dictionary.ts`. */

function Card({ review }: { review: ReviewEntry }) {
  return (
    <div className="w-[268px] flex-none rounded-[22px] border border-[rgba(201,156,78,0.22)] bg-[var(--color-md-card)] px-5 py-[22px] transition-colors duration-300 hover:border-[rgba(232,195,106,0.45)] sm:w-[380px] sm:px-6 sm:py-[26px]">
      <div className="mb-3 flex items-center justify-between">
        <Icon.Quote className="size-[26px] fill-[rgba(201,156,78,0.5)] text-[rgba(201,156,78,0.5)]" />
        <span className="flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <Icon.Star
              key={i}
              className="size-3.5 fill-[var(--color-md-gold-bright)] text-[var(--color-md-gold-bright)]"
            />
          ))}
        </span>
      </div>
      <p className="mb-4 text-[0.95rem] leading-[1.85] font-light text-[rgba(246,238,223,0.72)]">
        {review.quote}
      </p>
      <div className="flex items-center gap-[11px]">
        <span
          className="flex size-[38px] items-center justify-center rounded-full text-[0.9rem] font-extrabold text-[#FFFDF8]"
          style={{ background: "linear-gradient(135deg, #8A6430, #E0BE7A)" }}
        >
          {review.initial}
        </span>
        <span className="leading-[1.3]">
          <b className="block text-[0.9rem] text-[var(--color-md-text)]">
            {review.name}
          </b>
          <span className="text-[0.76rem] text-[rgba(246,238,223,0.45)]">
            {review.caption}
          </span>
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({
  reviews,
  duration,
  reverse,
  locale,
}: {
  reviews: ReviewEntry[];
  duration: string;
  reverse?: boolean;
  locale: Locale;
}) {
  const dir = LANG_META[locale].dir;
  const reversed = dir === "rtl" ? reverse : !reverse;
  return (
    <div
      dir="ltr"
      className="overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className={`md-marquee-track gap-5 ${reversed ? "md-marquee-reverse" : ""}`}
        style={{ "--md-marquee-duration": duration } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} dir={dir} className="flex gap-5 pe-5">
            {reviews.map((r, i) => (
              <Card key={`${copy}-${i}`} review={r} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two counter-scrolling marquee rows of real Google-review quotes. */
export function Testimonials({ locale = "ar", dict }: { locale?: Locale; dict?: Dict }) {
  const { rowA, rowB } = (dict ?? getDict(locale)).testimonials;
  return (
    <div className="flex flex-col gap-5">
      <MarqueeRow reviews={rowA} duration="48s" locale={locale} />
      <MarqueeRow reviews={rowB} duration="56s" reverse locale={locale} />
    </div>
  );
}
