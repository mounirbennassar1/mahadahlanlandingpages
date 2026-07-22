"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/icons";
import { SectionEyebrow } from "@/components/usablecomponents/SectionEyebrow";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ORANGE_GRADIENT =
  "linear-gradient(120deg, #ffb473 0%, #ff6b1a 55%, #e35500 100%)";

const STEPS = [
  {
    n: "٠١",
    icon: Icon.ScanFace,
    title: "تحليل البشرة وتنظيف عميق",
    text: "نقيّم بشرتكِ ونحدد كثافة السبيكولز المناسبة لحالتها، ثم تنظيف مزدوج يزيل الشوائب ويهيّئ البشرة للتقنية.",
  },
  {
    n: "٠٢",
    icon: Icon.FlaskConical,
    title: "تحضير الأمبولة الكورية",
    text: "نمزج السبيكولز الطبيعية المستخلصة من الإسفنج البحري مع سيروم مخصّص يناسب هدف جلستكِ.",
  },
  {
    n: "٠٣",
    icon: Icon.Hand,
    title: "تدليك السبيكولز",
    text: "تدليك مدروس يوجّه ملايين الشويكات المجهرية لفتح قنوات دقيقة وإيصال المكوّنات إلى أعماق الجلد.",
  },
  {
    n: "٠٤",
    icon: Icon.Droplets,
    title: "سيروم مهدئ ومغذٍّ",
    text: "ببتيدات ومهدئات كورية تمتصها البشرة عبر القنوات المفتوحة بفعالية مضاعفة، فتعمل بعمق لمدة ٧٢ ساعة.",
  },
  {
    n: "٠٥",
    icon: Icon.ShieldCheck,
    title: "حماية وخطة منزلية",
    text: "واقي شمس وتعليمات بسيطة لأيام التجدد، مع متابعة فريقنا معكِ حتى تكتمل النتيجة خلال أسبوع.",
  },
];

const WEEK = [
  { d: "اليوم ١-٢", t: "وخز خفيف ودفء، السبيكولز تعمل في العمق" },
  { d: "اليوم ٣-٤", t: "تقشّر خفيف، البشرة الباهتة تودّعكِ" },
  { d: "اليوم ٥-٧", t: "بشرة جديدة، نقاء ونعومة وتوهّج" },
];

/**
 * Session protocol. Desktop: the section pins and vertical scroll scrubs the
 * step track horizontally (RTL → the track translates to +x). Mobile: no pin,
 * plain vertical cards revealed by the ScrollSystem (lighter & smoother).
 */
export function HorizontalProtocol() {
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
    <section ref={sectionRef} id="protocol" data-glow="18,42,0.45" className="relative">
      <div ref={pinRef} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-20 md:py-0">
        {/* orange particle texture — very dim, ambient does the rest */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <Image
            src="/korean-spicules/texture.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.9))",
          }}
          aria-hidden
        />

        {/* header */}
        <div className="relative mx-auto w-full max-w-6xl px-5 text-center" data-reveal="up">
          <SectionEyebrow tokenPrefix="kos" icon="Route">
            بروتوكول الجلسة · ٤٥ دقيقة
          </SectionEyebrow>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
            جلسة السبيكولز{" "}
            <em className="kos-orange-text not-italic">خطوة بخطوة</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[var(--color-kos-ink-soft)]">
            خمس خطوات مدروسة تمرّ بها جلستكِ، كل خطوة تُهيّئ بشرتكِ للتي
            بعدها حتى يكتمل التجدد.
          </p>
        </div>

        {/* desktop: horizontal scrub track */}
        <div className="relative mt-12 hidden md:block">
          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-6 px-[max(2.5rem,calc((100vw-72rem)/2))]"
          >
            {STEPS.map((s) => (
              <article
                key={s.n}
                className="group relative flex w-[23rem] shrink-0 flex-col rounded-[1.75rem] border border-[var(--color-kos-line-soft)] bg-black/65 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-[var(--color-kos-line)]"
              >
                <span
                  className="pointer-events-none absolute -top-7 left-5 select-none text-[5.5rem] font-extrabold leading-none text-transparent opacity-60"
                  style={{ WebkitTextStroke: "1px rgba(255,107,26,0.35)" }}
                  aria-hidden
                >
                  {s.n}
                </span>
                <span
                  className="flex size-14 items-center justify-center rounded-2xl text-[#180a02] shadow-[0_12px_28px_-10px_rgba(255,107,26,0.6)]"
                  style={{ background: ORANGE_GRADIENT }}
                >
                  <s.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-kos-muted)]">
                  {s.text}
                </p>
                <span
                  className="mt-auto block h-px w-full pt-0"
                  style={{
                    background:
                      "linear-gradient(to left, var(--color-kos-line), transparent)",
                  }}
                  aria-hidden
                />
              </article>
            ))}

            {/* week-journey finale card */}
            <article className="relative flex w-[23rem] shrink-0 flex-col justify-center rounded-[1.75rem] border border-[var(--color-kos-line)] bg-[var(--color-kos-primary)]/[0.07] p-7 backdrop-blur-sm">
              <h3 className="text-xl font-extrabold text-[var(--color-kos-primary-dim)]">
                رحلة الأسبوع بعد الجلسة
              </h3>
              <ul className="mt-5 space-y-4">
                {WEEK.map((w) => (
                  <li key={w.d} className="flex items-start gap-3">
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-[var(--color-kos-primary)]" />
                    <div>
                      <span className="block text-sm font-extrabold text-white">{w.d}</span>
                      <span className="text-[12.5px] leading-6 text-[var(--color-kos-muted)]">
                        {w.t}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* scrub progress line */}
          <div className="mx-auto mt-10 h-px w-64 overflow-hidden rounded-full bg-[var(--color-kos-line-soft)]">
            <div
              ref={barRef}
              className="h-full w-full origin-right scale-x-0"
              style={{ background: ORANGE_GRADIENT }}
            />
          </div>
        </div>

        {/* mobile: vertical cards (revealed by ScrollSystem) */}
        <ol className="relative mt-10 space-y-4 px-5 md:hidden" data-reveal-group>
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-reveal-child
              className="relative flex gap-4 rounded-3xl border border-[var(--color-kos-line-soft)] bg-black/70 p-5"
            >
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-[#180a02]"
                style={{ background: ORANGE_GRADIENT }}
              >
                <s.icon className="size-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold tracking-normal text-[var(--color-kos-primary-dim)]">
                  الخطوة {s.n}
                </span>
                <h3 className="mt-0.5 text-base font-extrabold leading-snug text-white">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-6 text-[var(--color-kos-muted)]">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
          <li
            data-reveal-child
            className="rounded-3xl border border-[var(--color-kos-line)] bg-[var(--color-kos-primary)]/[0.07] p-5"
          >
            <h3 className="text-base font-extrabold text-[var(--color-kos-primary-dim)]">
              رحلة الأسبوع بعد الجلسة
            </h3>
            <ul className="mt-3 space-y-3">
              {WEEK.map((w) => (
                <li key={w.d} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-kos-primary)]" />
                  <p className="text-[12.5px] leading-6 text-[var(--color-kos-muted)]">
                    <span className="font-extrabold text-white">{w.d}: </span>
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
