"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    n: "٠١",
    icon: Icon.ScanSearch,
    title: "تشخيص دقيق لنوع الاكزيما",
    text: "فحص سريري شامل يميز الاكزيما المزمنة عن الصدفية والتحسس التماسي، ويحدد شدتها ومناطقها ونمط نوباتها قبل أي علاج.",
  },
  {
    n: "٠٢",
    icon: Icon.ShieldCheck,
    title: "تهدئة الالتهاب بأمان",
    text: "خطة دوائية موضعية مدروسة الجرعات، من الكورتيزون الآمن قصير المدى إلى البدائل غير الستيرويدية الحديثة عند الحاجة.",
  },
  {
    n: "٠٣",
    icon: Icon.Layers,
    title: "ترميم حاجز الجلد",
    text: "بروتوكول ترطيب طبي مكثف مع بروتوكول الضمادات الرطبة للحالات الشديدة، ليستعيد الجلد قدرته على حماية نفسه.",
  },
  {
    n: "٠٤",
    icon: Icon.Sun,
    title: "العلاج الضوئي والتقنيات الحديثة",
    text: "جلسات العلاج الضوئي NB-UVB للحالات المستعصية، مع خيارات العلاجات البيولوجية ومثبطات JAK بعد تقييم دقيق.",
  },
  {
    n: "٠٥",
    icon: Icon.CalendarCheck,
    title: "خطة المحفزات والمتابعة",
    text: "نحدد محفزاتك الشخصية، من الصابون والأقمشة إلى الطقس والتوتر، ونبني روتيناً منزلياً بسيطاً مع مراجعات دورية مجدولة.",
  },
];

const JOURNEY = [
  { d: "الأسبوعان الأولان", t: "تهدأ الحكة ويتراجع الاحمرار مع بدء الخطة" },
  { d: "الأسابيع ٣ إلى ٦", t: "يترمم حاجز الجلد وتتباعد النوبات تدريجياً" },
  { d: "بعد الشهر الثاني", t: "خطة صيانة بسيطة تحافظ على الاستقرار" },
];

/**
 * Treatment approach as an editorial filmstrip. Desktop: the section pins on
 * a cream band and vertical scroll scrubs the step cards horizontally
 * (RTL → the track translates to +x). Mobile: no pin, a numbered vertical
 * index revealed by the ScrollSystem.
 */
export function ApproachPin() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const pinEl = pinRef.current;
        if (!track || !pinEl) return;

        // RTL: the track overflows past the LEFT edge, so we translate +x.
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: pinEl,
            start: "top top",
            end: () => `+=${dist() + window.innerHeight * 0.25}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => dist() }, 0).to(barRef.current, { scaleX: 1 }, 0);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative border-y border-[var(--color-che-line)] bg-[var(--color-che-bg-2)]"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-20 md:py-0"
      >
        {/* editorial section head: numeral ، rule ، title */}
        <div className="relative mx-auto w-full max-w-[1240px] px-[22px]" data-reveal="up">
          <div className="flex items-center gap-4 text-[0.72rem] font-extrabold tracking-[0.22em] text-[var(--color-che-gold-bright)]">
            <span>٠٣ ، منهجنا العلاجي</span>
            <span className="h-px flex-1 bg-[var(--color-che-line)]" aria-hidden />
          </div>
          <h2 className="mt-6 mb-0 text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.3] font-extrabold">
            خطة من <em className="che-gold-text not-italic">خمس ركائز</em> تعيد
            لبشرتك توازنها
          </h2>
          <p className="mt-4 mb-0 max-w-2xl text-[15px] leading-8 font-light text-[var(--color-che-muted)]">
            الاكزيما المزمنة لا تُعالج بكريم واحد، بل بمنظومة متكاملة تُبنى على
            حالتك أنتِ. اسحبي عبر الركائز الخمس كما نطبقها في العيادة.
          </p>
        </div>

        {/* desktop: horizontal scrub track */}
        <div className="relative mt-12 hidden md:block">
          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-5 px-[max(2.5rem,calc((100vw-77.5rem)/2))]"
          >
            {STEPS.map((s) => (
              <article
                key={s.n}
                className="group relative flex w-[22.5rem] shrink-0 flex-col rounded-md border border-[var(--color-che-line)] bg-[var(--color-che-card)] p-7 transition-colors duration-300 hover:border-[var(--color-che-line-gold)]"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="select-none text-[4.6rem] leading-none font-extrabold text-[rgba(201,164,92,0.28)]"
                    aria-hidden
                  >
                    {s.n}
                  </span>
                  <span className="flex size-12 items-center justify-center rounded-full border border-[var(--color-che-line-gold)] text-[var(--color-che-gold-bright)]">
                    <s.icon className="size-[22px]" strokeWidth={1.7} />
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-[var(--color-che-ink)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-7 font-light text-[var(--color-che-muted)]">
                  {s.text}
                </p>
                <span
                  className="mt-auto block h-px w-full"
                  style={{
                    background:
                      "linear-gradient(to left, var(--color-che-line-gold), transparent)",
                  }}
                  aria-hidden
                />
              </article>
            ))}

            {/* journey finale card — inverted ink */}
            <article className="relative flex w-[22.5rem] shrink-0 flex-col justify-center rounded-md border border-[var(--color-che-line-gold)] bg-[var(--color-che-night)] p-7 text-[var(--color-che-night-ink)]">
              <h3 className="text-xl font-extrabold text-[var(--color-che-gold-bright)]">
                رحلة الاستقرار بعد بدء الخطة
              </h3>
              <ul className="mt-5 space-y-4">
                {JOURNEY.map((w) => (
                  <li key={w.d} className="flex items-start gap-3">
                    <span className="mt-2 h-px w-5 shrink-0 bg-[var(--color-che-gold)]" />
                    <div>
                      <span className="block text-sm font-extrabold">{w.d}</span>
                      <span className="text-[12.5px] leading-6 font-light text-[rgba(246,239,250,0.65)]">
                        {w.t}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11.5px] leading-5 text-[rgba(246,239,250,0.45)]">
                المدد تقريبية وتختلف من حالة إلى أخرى بحسب شدة الاكزيما
                والالتزام بالخطة.
              </p>
            </article>
          </div>

          {/* scrub progress hairline */}
          <div className="mx-auto mt-10 h-px w-64 overflow-hidden bg-[var(--color-che-line)]">
            <div
              ref={barRef}
              className="h-full w-full origin-right scale-x-0 bg-[var(--color-che-gold)]"
            />
          </div>
        </div>

        {/* mobile: numbered vertical index (revealed by ScrollSystem) */}
        <ol className="relative mt-10 space-y-0 px-[22px] md:hidden" data-reveal-group>
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-reveal-child
              className="relative flex gap-5 border-t border-[var(--color-che-line)] py-6"
            >
              <span
                className="select-none text-[2.4rem] leading-none font-extrabold text-[rgba(201,164,92,0.35)]"
                aria-hidden
              >
                {s.n}
              </span>
              <div>
                <h3 className="text-base leading-snug font-extrabold text-[var(--color-che-ink)]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-6 font-light text-[var(--color-che-muted)]">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
          <li
            data-reveal-child
            className="mt-4 rounded-md border border-[var(--color-che-line-gold)] bg-[var(--color-che-night)] p-5 text-[var(--color-che-night-ink)]"
          >
            <h3 className="text-base font-extrabold text-[var(--color-che-gold-bright)]">
              رحلة الاستقرار بعد بدء الخطة
            </h3>
            <ul className="mt-3 space-y-3">
              {JOURNEY.map((w) => (
                <li key={w.d} className="flex items-start gap-3">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-[var(--color-che-gold)]" />
                  <p className="m-0 text-[12.5px] leading-6 font-light text-[rgba(246,239,250,0.7)]">
                    <span className="font-extrabold text-[var(--color-che-night-ink)]">
                      {w.d}:{" "}
                    </span>
                    {w.t}
                  </p>
                </li>
              ))}
            </ul>
          </li>
        </ol>
      </div>
    </section>
  );
}
