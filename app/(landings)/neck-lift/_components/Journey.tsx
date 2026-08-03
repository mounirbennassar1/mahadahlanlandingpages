"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Reveal } from "./Gsap";
import { GOLD_GRADIENT } from "./config";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    num: "١",
    title: "الاستشارة والتقييم",
    body: "جلسة خاصة نستمع فيها إليكِ، ونقيّم درجة الترهل ونوع البشرة بدقة.",
  },
  {
    num: "٢",
    title: "الخطة المخصصة",
    body: "برنامج علاجي يجمع التقنيات الأنسب لحالتك، بوضوح تام في التفاصيل.",
  },
  {
    num: "٣",
    title: "جلسات العلاج",
    body: "جلسات مريحة بتخدير موضعي عند الحاجة، تعودين بعدها ليومك غالباً.",
  },
  {
    num: "٤",
    title: "المتابعة والاطمئنان",
    body: "مواعيد مراجعة دورية نتابع فيها تطوّر النتيجة حتى اكتمالها.",
  },
];

/** Horizontal journey rail whose gold line fills as it scrolls into view. */
export function Journey() {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        fillRef.current,
        { width: "0%" },
        {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
    },
    { scope: railRef },
  );

  return (
    <div ref={railRef} className="relative">
      <div className="absolute inset-x-0 top-[25px] h-0.5 rounded-sm bg-[rgba(166,124,61,0.2)]" />
      <div
        ref={fillRef}
        className="absolute top-[25px] right-0 h-0.5 w-0 rounded-sm"
        style={{
          background: "linear-gradient(90deg, #8A6430, #E0BE7A)",
          boxShadow: "0 0 14px rgba(201,156,78,.6)",
        }}
      />
      <div className="relative grid gap-x-[26px] gap-y-[34px] sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delay={i * 120} className="flex flex-col gap-3.5">
            <span
              className="relative z-[2] flex size-[52px] items-center justify-center rounded-full text-[1.05rem] font-extrabold text-[var(--color-nkl-ink)] shadow-[0_0_0_6px_#F5EFE4,0_10px_24px_-10px_rgba(138,100,48,0.5)]"
              style={{ background: GOLD_GRADIENT }}
            >
              {s.num}
            </span>
            <h3 className="m-0 text-[1.1rem] font-extrabold">{s.title}</h3>
            <p className="m-0 text-[0.92rem] font-light text-[var(--color-nkl-muted)]">
              {s.body}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
