"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STAGES = [
  {
    num: "٠١",
    icon: Icon.Wind,
    title: "جفاف وخشونة",
    body: "يفقد جلد الكعب ترطيبه الطبيعي فيصبح ملمسه خشناً جافاً، مع شدٍّ خفيف وخطوط رفيعة على الحواف. هذه أفضل مرحلة للتدخل: جلسات قليلة تعيد النعومة كاملة.",
    chips: ["شد وجفاف", "ملمس خشن", "خطوط رفيعة"],
  },
  {
    num: "٠٢",
    icon: Icon.Slice,
    title: "تشققات سطحية",
    body: "يتراكم الجلد الميت وتظهر شقوق دقيقة على محيط الكعب مع تقشر واضح. تحتاج المرحلة إلى إزالة طبية للجلد المتصلب مع تقشير علاجي وترطيب مكثف.",
    chips: ["شقوق دقيقة", "تقشر واضح", "حكة متكررة"],
  },
  {
    num: "٠٣",
    icon: Icon.TriangleAlert,
    title: "تشققات عميقة وتصبغات",
    body: "تتعمق الشقوق حتى تؤلم عند المشي وقد تنزف، ويترك الاحتكاك المزمن تصبغات داكنة حول الكعب. نعالجها ببروتوكول متدرج، وقد نضيف جلسات لتوحيد اللون بعد التئام الجلد.",
    chips: ["ألم عند المشي", "نزف بسيط", "اسمرار حول الكعب"],
  },
] as const;

/**
 * Pinned, scrub-driven stages showcase (desktop): the section pins while the
 * three stages advance with a filling gold rail and a crossfading numeral
 * panel. On mobile and under reduced motion it degrades to a static stack.
 */
export function Stages() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const panels = gsap.utils.toArray<HTMLElement>(".crh-stage-panel");
          const items = gsap.utils.toArray<HTMLElement>(".crh-stage-item");

          gsap.set(items[0], { opacity: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: `+=${STAGES.length * 640}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
            },
          });

          STAGES.forEach((_, i) => {
            if (i === 0) return;
            tl.to(items[i - 1], { opacity: 0.35, duration: 0.3 }, i)
              .to(
                panels[i - 1],
                { autoAlpha: 0, y: -44, scale: 0.96, duration: 0.45 },
                i,
              )
              .fromTo(
                panels[i],
                { autoAlpha: 0, y: 44, scale: 0.98 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 },
                i + 0.08,
              )
              .to(items[i], { opacity: 1, duration: 0.3 }, i + 0.12);
          });

          // hold the last stage for a beat before unpinning
          tl.to({}, { duration: 0.7 });

          tl.fromTo(
            ".crh-stage-fill",
            { scaleY: 0 },
            { scaleY: 1, ease: "none", duration: tl.duration() },
            0,
          );
        },
      );

      // Reduced motion / no pin: everything readable, first panel showing.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".crh-stage-item", { opacity: 1 });
        gsap.set(".crh-stage-fill", { scaleY: 1 });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="border-y border-[rgba(176,141,87,0.15)] bg-[var(--color-crh-band)]">
      <div className="mx-auto flex min-h-[70svh] max-w-[1180px] flex-col justify-center px-[22px] py-[90px] lg:min-h-svh">
        <div className="mb-[54px] flex flex-col items-center gap-3.5 text-center">
          <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-crh-gold)]">
            ٠٢ ، المراحل
          </span>
          <h2 className="m-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
            من الجفاف إلى التشقق العميق…{" "}
            <span className="crh-gold-text">أين وصلتِ؟</span>
          </h2>
          <p className="m-0 max-w-[54ch] font-light text-[var(--color-crh-muted)]">
            تشقق الكعبين لا يحدث فجأة؛ يتدرج عبر ثلاث مراحل، وكلما بكّرتِ في
            العلاج كانت الرحلة أقصر والنتيجة أسرع.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          {/* ——— stage list + rail (right in RTL) ——— */}
          <div className="relative flex flex-col gap-7 lg:ps-9">
            {/* vertical rail, desktop only */}
            <div
              className="absolute inset-y-2 right-0 hidden w-0.5 rounded-full bg-[rgba(176,141,87,0.2)] lg:block"
              aria-hidden
            />
            <div
              className="crh-stage-fill absolute inset-y-2 right-0 hidden w-0.5 origin-top scale-y-0 rounded-full lg:block"
              style={{
                background: "linear-gradient(180deg, #E4C87E, #8C6A3F)",
                boxShadow: "0 0 14px rgba(212,175,55,.55)",
              }}
              aria-hidden
            />
            {STAGES.map((s) => (
              <div
                key={s.num}
                className="crh-stage-item rounded-[22px] border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] px-7 py-[26px] opacity-100 transition-shadow lg:opacity-40"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-[14px]"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(228,200,126,.2), rgba(140,106,63,.1))",
                      border: "1px solid rgba(212,175,55,.3)",
                    }}
                  >
                    <s.icon className="size-[22px] text-[var(--color-crh-gold-soft)]" strokeWidth={1.8} />
                  </span>
                  <h3 className="m-0 text-[1.15rem] font-extrabold">
                    <span className="text-[var(--color-crh-bronze)]">{s.num}</span>{" "}
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 mb-0 text-[0.94rem] font-light text-[var(--color-crh-muted)]">
                  {s.body}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {s.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[rgba(176,141,87,0.3)] bg-[rgba(212,175,55,0.08)] px-3 py-1 text-[0.72rem] font-bold text-[var(--color-crh-gold-soft)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ——— crossfading numeral panel (left in RTL, desktop only) ——— */}
          <div className="relative hidden aspect-[4/5] lg:block">
            {STAGES.map((s, i) => (
              <div
                key={s.num}
                className={`crh-stage-panel absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden rounded-[34px] border border-[var(--color-crh-line-strong)] bg-[var(--color-crh-card)] ${
                  i > 0 ? "opacity-0" : ""
                }`}
              >
                <div
                  className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[420px] -translate-x-1/2 blur-[40px]"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(228,200,126,.22), transparent 70%)",
                  }}
                  aria-hidden
                />
                <span
                  className="text-[9rem] leading-none font-extrabold"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(228,200,126,.9), rgba(140,106,63,.25))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {s.num}
                </span>
                <span
                  className="flex size-[68px] items-center justify-center rounded-full shadow-[0_16px_36px_-14px_rgba(212,175,55,0.6)]"
                  style={{ background: GOLD_GRADIENT }}
                >
                  <s.icon className="size-8 text-[#1C120C]" strokeWidth={1.7} />
                </span>
                <b className="px-8 text-center text-[1.4rem] font-extrabold">
                  {s.title}
                </b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
