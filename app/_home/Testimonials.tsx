import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";

type Review = {
  quote: string;
  name: string;
  caption: string;
  initial: string;
};

/* Genuine quotes from the clinic's public Google reviews
   (MD Clinics: 4.8 stars, 1,271+ reviews). Long reviews are split across
   the two rows; nothing here is invented. */
const ROW_A: Review[] = [
  {
    quote:
      "الدكتورة مها دحلان من أفضل الدكاترة، يدها خفيفة ورائعة في عملها، وتسمع للمريض وتعطيه شرحاً كاملاً وافياً لما يحتاجه دون مبالغة.",
    name: "عبير علي",
    caption: "تقييم Google، ٥ نجوم",
    initial: "ع",
  },
  {
    quote:
      "بكل أمانة: الدكتورة مها دحلان من أفضل أطباء واستشاريي الجلدية في جدة بدون مبالغة. تعاملها راقٍ جداً وتشرح الخطوات بكل وضوح.",
    name: "مصطفى الحاتم",
    caption: "تقييم Google، ٥ نجوم",
    initial: "م",
  },
  {
    quote:
      "أتقدم بجزيل الشكر للدكتورة مها دحلان على احترافيتها العالية وخبرتها المميزة، حرصت على شرح الحالة وخطة العلاج بكل وضوح.",
    name: "ملك نواوي",
    caption: "تقييم Google، ٥ نجوم",
    initial: "م",
  },
  {
    quote:
      "أكثر من ١٢٧٠ تقييماً على خرائط Google بمتوسط ٤٫٨ من ٥. ثقة تتجدد كل يوم.",
    name: "عيادات مها دحلان",
    caption: "خرائط Google",
    initial: "★",
  },
];

const ROW_B: Review[] = [
  {
    quote:
      "تهتم بأدق التفاصيل ولا تقترح إلا ما يحتاجه المريض فعلاً، هذه خلاصة تجربتي معها.",
    name: "عبير علي",
    caption: "تقييم Google، ٥ نجوم",
    initial: "ع",
  },
  {
    quote: "تجاوب على كل الأسئلة بصدر رحب، وتشرح خطوات العلاج قبل البدء.",
    name: "مصطفى الحاتم",
    caption: "تقييم Google، ٥ نجوم",
    initial: "م",
  },
  {
    quote:
      "أظهرت اهتماماً كبيراً بمتابعة النتائج والاطمئنان على تحسّن الحالة، والطاقم في غاية اللطف.",
    name: "ملك نواوي",
    caption: "تقييم Google، ٥ نجوم",
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
    <div className="w-[340px] flex-none rounded-[22px] border border-[rgba(166,124,61,0.2)] bg-[var(--color-md-card)] px-6 py-[26px] sm:w-[380px]">
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
      <p className="mb-4 text-[0.95rem] leading-[1.85] font-light text-[rgba(39,28,17,0.75)]">
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
          <b className="block text-[0.9rem]">{review.name}</b>
          <span className="text-[0.76rem] text-[rgba(39,28,17,0.5)]">
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
}: {
  reviews: Review[];
  duration: string;
  reverse?: boolean;
}) {
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
        className={`md-marquee-track gap-5 ${reverse ? "md-marquee-reverse" : ""}`}
        style={{ "--md-marquee-duration": duration } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} dir="rtl" className="flex gap-5 pe-5">
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
    <div className="flex flex-col gap-5">
      <MarqueeRow reviews={ROW_A} duration="48s" />
      <MarqueeRow reviews={ROW_B} duration="56s" reverse />
    </div>
  );
}
