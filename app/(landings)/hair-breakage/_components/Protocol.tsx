"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/icons";
import { Reveal } from "./Gsap";
import { GOLD_GRADIENT } from "./config";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    num: "١",
    icon: Icon.Microscope,
    title: "التشخيص الرقمي للشعرة والفروة",
    body: "كاميرا رقمية مكبّرة تفحص جذع الشعرة والفروة لتحديد مكان الضعف: هل التكسر حراري، كيميائي، أم نقص بروتين؟ لا نبدأ أي علاج قبل أن نعرف السبب.",
    tag: "الجلسة الأولى",
  },
  {
    num: "٢",
    icon: Icon.Link2,
    title: "ترميم الروابط والبروتين العلاجي",
    body: "جلسات تُعيد بناء الروابط الداخلية للشعرة وتملأ فجوات القشرة المتضررة بالبروتين، ثم تغلقها بطبقة حماية تحبس الترطيب واللمعان.",
    tag: "جلسات متتالية",
  },
  {
    num: "٣",
    icon: Icon.Droplets,
    title: "ميزوثيرابي مغذٍّ للفروة",
    body: "فيتامينات ومغذيات دقيقة تصل إلى جذور الشعر مباشرة، لتخرج الشعرة الجديدة أقوى وأكثر مرونة وأقل قابلية للتكسر.",
    tag: "تغذية من الجذور",
  },
  {
    num: "٤",
    icon: Icon.CalendarCheck,
    title: "خطة منزلية ومتابعة دورية",
    body: "قص أطراف علاجي منظم، روتين حماية حرارية، وعناية منزلية مكتوبة لكِ خطوة بخطوة، مع مراجعات نطمئن فيها على تعافي شعرك حتى اكتماله.",
    tag: "حتى النتيجة",
  },
];

/**
 * Treatment protocol. Desktop: the section pins and the four steps scrub
 * in/out while the gold rail fills. Mobile & reduced-motion: stacked reveals.
 */
export function Protocol() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const steps = gsap.utils.toArray<HTMLElement>(".hab-step");
          gsap.set(steps, { autoAlpha: 0, y: 44 });
          gsap.set(steps[0], { autoAlpha: 1, y: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ".hab-pin",
              start: "top top",
              end: "+=2400",
              scrub: 0.4,
              pin: true,
              anticipatePin: 1,
            },
          });

          // gold rail fills across the whole scrub
          tl.fromTo(
            ".hab-rail-fill",
            { scaleY: 0 },
            { scaleY: 1, duration: STEPS.length },
            0,
          );
          // image slowly settles
          tl.fromTo(
            ".hab-proto-img",
            { scale: 1.12 },
            { scale: 1, duration: STEPS.length },
            0,
          );

          steps.forEach((step, i) => {
            if (i === 0) return;
            tl.to(steps[i - 1], { autoAlpha: 0, y: -44, duration: 0.35 }, i);
            tl.to(step, { autoAlpha: 1, y: 0, duration: 0.35 }, i + 0.32);
          });
          // hold the last step for a beat before unpinning
          tl.to({}, { duration: 0.6 });
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      {/* ——— desktop: pinned, scrubbed ——— */}
      <div className="hab-pin hidden min-h-svh items-center lg:flex">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center gap-12 px-[22px]">
          {/* steps (right in RTL) */}
          <div className="relative min-h-[340px]">
            {STEPS.map((s) => (
              <div key={s.num} className="hab-step absolute inset-0 flex flex-col justify-center">
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-hab-line-strong)] bg-[rgba(212,175,55,0.08)] px-4 py-1.5 text-[0.76rem] font-extrabold text-[var(--color-hab-champagne)]">
                  <s.icon className="size-3.5" strokeWidth={2} />
                  {s.tag}
                </span>
                <span className="text-[4.6rem] leading-none font-extrabold text-[rgba(212,175,55,0.16)]">
                  {s.num}
                </span>
                <h3 className="mt-3 mb-3 text-[1.7rem] leading-snug font-extrabold">
                  {s.title}
                </h3>
                <p className="m-0 max-w-[46ch] text-[1rem] font-light text-[var(--color-hab-muted)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* gold rail */}
          <div className="relative h-[340px] w-0.5 rounded-full bg-[rgba(212,175,55,0.15)]">
            <div
              className="hab-rail-fill absolute inset-0 origin-top rounded-full"
              style={{
                background: "linear-gradient(180deg, #F0D48A, #8A6430)",
                boxShadow: "0 0 16px rgba(212,175,55,.6)",
              }}
            />
          </div>

          {/* visual (left in RTL) */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[var(--color-hab-line-strong)] shadow-[0_46px_90px_-34px_rgba(212,175,55,0.3)]">
            <Image
              src="/hair-breakage/treatment.webp"
              alt="تطبيق سيروم بروتين ذهبي على خصلة شعر داكنة لامعة"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="hab-proto-img object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(200deg, transparent 55%, rgba(6,6,7,.55))",
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* ——— mobile & reduced-motion: stacked ——— */}
      <div className="mx-auto flex max-w-[640px] flex-col gap-5 px-[22px] lg:hidden">
        <Reveal>
          <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-[24px] border border-[var(--color-hab-line-strong)] shadow-[0_36px_70px_-30px_rgba(212,175,55,0.3)]">
            <Image
              src="/hair-breakage/treatment.webp"
              alt="تطبيق سيروم بروتين ذهبي على خصلة شعر داكنة لامعة"
              fill
              sizes="(max-width: 1024px) 92vw, 480px"
              className="object-cover"
            />
          </div>
        </Reveal>
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delay={i * 90}>
            <div className="relative overflow-hidden rounded-[22px] border border-[var(--color-hab-line)] bg-[var(--color-hab-card)] px-6 py-7">
              <span className="absolute top-3 left-5 text-[3rem] leading-none font-extrabold text-[rgba(212,175,55,0.12)]">
                {s.num}
              </span>
              <span
                className="mb-4 flex size-12 items-center justify-center rounded-2xl shadow-[0_10px_24px_-10px_rgba(212,175,55,0.5)]"
                style={{ background: GOLD_GRADIENT }}
              >
                <s.icon className="size-[22px] text-[#1A1405]" strokeWidth={1.9} />
              </span>
              <h3 className="mb-2 text-[1.15rem] font-extrabold">{s.title}</h3>
              <p className="m-0 text-[0.93rem] font-light text-[var(--color-hab-muted)]">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
