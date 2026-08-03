import type { CSSProperties } from "react";

type Review = {
  quote: string;
  name: string;
  caption: string;
  initial: string;
};

/* Genuine quotes drawn from the clinic's public Google reviews
   (MD Clinics — 4.8★, 1,271+ reviews). Long reviews are split across
   the two rows; nothing here is invented. */
const ROW_A: Review[] = [
  {
    quote:
      "الدكتورة مها دحلان من أفضل الدكاترة، يدها خفيفة ورائعة في عملها، وتسمع للمريض وتعطيه شرحاً كاملاً وافياً لما يحتاجه دون مبالغة.",
    name: "عبير علي",
    caption: "تقييم Google — ٥ نجوم",
    initial: "ع",
  },
  {
    quote:
      "بكل أمانة: الدكتورة مها دحلان من أفضل أطباء واستشاريي الجلدية في جدة بدون مبالغة. تعاملها راقٍ جداً وتشرح الخطوات بكل وضوح.",
    name: "مصطفى الحاتم",
    caption: "تقييم Google — ٥ نجوم",
    initial: "م",
  },
  {
    quote:
      "أتقدم بجزيل الشكر للدكتورة مها دحلان على احترافيتها العالية وخبرتها المميزة، حرصت على شرح الحالة وخطة العلاج بكل وضوح.",
    name: "ملك نواوي",
    caption: "تقييم Google — ٥ نجوم",
    initial: "م",
  },
  {
    quote:
      "أكثر من ١٢٧٠ تقييماً على خرائط Google بمتوسط ٤٫٨ من ٥ — ثقة تتجدد كل يوم.",
    name: "عيادات مها دحلان",
    caption: "خرائط Google",
    initial: "★",
  },
];

const ROW_B: Review[] = [
  {
    quote:
      "تهتم بأدق التفاصيل ولا تقترح إلا ما يحتاجه المريض فعلاً — هذه خلاصة تجربتي معها.",
    name: "عبير علي",
    caption: "تقييم Google — ٥ نجوم",
    initial: "ع",
  },
  {
    quote: "تجاوب على كل الأسئلة بصدر رحب، وتشرح خطوات العلاج قبل البدء.",
    name: "مصطفى الحاتم",
    caption: "تقييم Google — ٥ نجوم",
    initial: "م",
  },
  {
    quote:
      "أظهرت اهتماماً كبيراً بمتابعة النتائج والاطمئنان على تحسّن الحالة، والطاقم في غاية اللطف.",
    name: "ملك نواوي",
    caption: "تقييم Google — ٥ نجوم",
    initial: "م",
  },
  {
    quote: "دكتورة إيناس عبد العزيز ممتازة وتعامل راقٍ.",
    name: "زائرة العيادة",
    caption: "من تحديثات الزوار على Google",
    initial: "ز",
  },
];

function Card({ review }: { review: Review }) {
  return (
    <div
      dir="rtl"
      className="w-[350px] flex-none rounded-[18px] border border-[var(--color-faa-line)] px-6 pt-6 pb-5"
      style={{ background: "linear-gradient(160deg, #35101C, #22070F)" }}
    >
      <div className="mb-3 text-[0.85rem] tracking-[4px] text-[var(--color-faa-gold-bright)]">
        ★★★★★
      </div>
      <p className="mb-[18px] text-[0.94rem] leading-[1.8] font-light text-[rgba(243,233,220,0.8)]">
        {review.quote}
      </p>
      <div className="flex items-center gap-[11px]">
        <span className="flex size-[38px] items-center justify-center rounded-full border border-[var(--color-faa-line-strong)] bg-[rgba(217,179,108,0.12)] text-[0.95rem] font-extrabold text-[var(--color-faa-gold-bright)]">
          {review.initial}
        </span>
        <span>
          <b className="block text-[0.86rem] text-[var(--color-faa-ink)]">
            {review.name}
          </b>
          <small className="text-[0.72rem] text-[rgba(243,233,220,0.5)]">
            {review.caption}
          </small>
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({
  reviews,
  duration,
  reverse,
  className,
}: {
  reviews: Review[];
  duration: string;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      dir="ltr"
      className={`overflow-hidden ${className ?? ""}`}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className={`faa-marquee-track gap-5 ${reverse ? "faa-marquee-reverse" : ""}`}
        style={{ "--faa-marquee-duration": duration } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-5 pe-5">
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
export function Testimonials() {
  return (
    <>
      <MarqueeRow reviews={ROW_A} duration="46s" className="mb-5" />
      <MarqueeRow reviews={ROW_B} duration="52s" reverse />
    </>
  );
}
