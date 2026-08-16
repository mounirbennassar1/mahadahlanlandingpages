import { Icon } from "@/components/icons";

const REVIEWS = [
  {
    name: "أم عبدالله",
    city: "جدة",
    tag: "اكزيما اليدين المزمنة",
    text: "عشت سنوات أخبّئ يديّ في المناسبات وأصحو ليلاً من الحكة. أول مرة أحسّ أن في خطة واضحة مو بس كريم وروحي. من الشهر الثاني صارت النوبات أخف وأبعد عن بعض، وتعلمت أعرف محفزاتي وأتعامل معها.",
    stars: 5,
  },
  {
    name: "ريما الحربي",
    city: "مكة المكرمة",
    tag: "اكزيما تأتّبية منذ الطفولة",
    text: "جربت عيادات كثير وكل مرة نفس الكلام. هنا شرحوا لي ليش الاكزيما ترجع، وبدأنا العلاج الضوئي مع بروتوكول الترطيب. التحسن كان تدريجي وصادق، ما وعدوني بمعجزة لكن بشرتي اليوم مستقرة والحكة شبه اختفت.",
    stars: 5,
  },
  {
    name: "سارة العمودي",
    city: "جدة",
    tag: "اكزيما الوجه والرقبة",
    text: "أكثر شي ريحني المتابعة، كل مراجعة يعدلون الخطة حسب استجابة بشرتي. الاحمرار في وجهي هدأ وصرت أنام ليلي كامل بدون ما أنخدش. تعامل راقٍ وخصوصية كاملة من الاستقبال للجلسة.",
    stars: 5,
  },
];

/** Editorial pull-quotes: text-first columns separated by hairlines. */
export function Testimonials() {
  return (
    <div
      className="mx-auto grid max-w-[1240px] px-[22px] md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-[var(--color-che-line)]"
    data-reveal-group
    >
      {REVIEWS.map((r) => (
        <figure
          key={r.name}
          data-reveal-child
          className="m-0 flex flex-col border-t border-[var(--color-che-line)] py-8 md:border-t-0 md:px-9 md:py-2 md:first:pr-0 md:last:pl-0"
        >
          <span
            className="che-gold-text select-none text-[3.4rem] leading-none font-extrabold"
            aria-hidden
          >
            &#8220;
          </span>
          <blockquote className="m-0 mt-2 flex-1 text-[0.98rem] leading-8 font-light text-[var(--color-che-ink-2)]">
            {r.text}
          </blockquote>
          <figcaption className="mt-6 border-t border-[var(--color-che-line)] pt-4">
            <div className="flex gap-1 text-[var(--color-che-gold-bright)]">
              {Array.from({ length: r.stars }).map((_, i) => (
                <Icon.Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <b className="mt-2 block text-[0.95rem] font-extrabold text-[var(--color-che-ink)]">
              {r.name}
            </b>
            <span className="text-[0.76rem] font-bold text-[var(--color-che-muted)]">
              {r.city} ، {r.tag}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
