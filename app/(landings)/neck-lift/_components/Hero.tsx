"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATS = [
  { value: "٤٫٨ من ٥", label: "تقييم Google" },
  { value: "+١٢٧٠", label: "تقييم موثّق" },
  { value: "+١٣ عاماً", label: "خبرة تجميلية" },
  { value: "١٠٠٪", label: "طاقم نسائي" },
] as const;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // copy: staggered rise
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.9 },
      });
      tl.from(".nkl-h", { y: 34, autoAlpha: 0, stagger: 0.12 });

      // collage: tiles fly in from directional offsets and assemble
      tl.from(
        ".nkl-tile",
        {
          x: (i) => [70, -80, 90, -60][i % 4],
          y: (i) => [90, -70, -90, 80][i % 4],
          scale: 0.72,
          autoAlpha: 0,
          duration: 1.05,
          ease: "back.out(1.4)",
          stagger: 0.1,
        },
        0.25,
      );
      tl.from(
        ".nkl-float-badge",
        { scale: 0.5, autoAlpha: 0, ease: "back.out(1.8)", stagger: 0.12 },
        "-=0.6",
      );

      // scroll response: copy softens out; each collage COLUMN drifts as one
      // unit (per-tile speeds made tiles collide into each other)
      gsap.to(".nkl-copy", {
        y: -40,
        autoAlpha: 0.25,
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "40% 30%",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".nkl-col-a", {
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".nkl-col-b", {
        y: -86,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden px-[22px] pt-[130px] pb-[80px] lg:min-h-svh lg:pt-[150px]"
    >
      {/* dotted grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(166,124,61,.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 35%, #000 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 35%, #000 25%, transparent 78%)",
        }}
        aria-hidden
      />
      {/* breathing champagne halo */}
      <div
        className="pointer-events-none absolute -top-[280px] left-1/2 h-[640px] w-[1000px] -translate-x-1/2 blur-[30px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(224,190,122,.35), transparent 70%)",
          animation: "nkl-breathe 7s ease-in-out infinite",
        }}
        aria-hidden
      />
      {/* thin decor circles */}
      <div
        className="pointer-events-none absolute top-0 left-0 aspect-square w-3/5 max-w-[820px] min-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-[rgba(166,124,61,0.1)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 aspect-square w-2/5 max-w-[560px] min-w-[280px] translate-x-1/2 translate-y-1/2 rounded-full border-[7px] border-[rgba(166,124,61,0.1)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ——— copy (right in RTL) ——— */}
        <div className="nkl-copy flex flex-col items-center text-center lg:items-start lg:text-right">
          <span className="nkl-h inline-flex items-center gap-2.5 rounded-full border border-[var(--color-nkl-line-strong)] bg-[rgba(255,253,249,0.75)] px-[18px] py-2 text-[0.8rem] font-bold tracking-[0.04em] text-[var(--color-nkl-bronze)] backdrop-blur-lg">
            <span
              className="size-1.5 rounded-full bg-[var(--color-nkl-gold-bright)]"
              style={{ boxShadow: "0 0 8px 2px rgba(201,156,78,.6)" }}
            />
            علاج ترهل الرقبة وعلامات التقدم بالسن، بدون جراحة
          </span>

          <h1 className="nkl-h mt-6 text-[clamp(2.2rem,5.4vw,3.7rem)] leading-[1.35] font-extrabold tracking-[-0.01em]">
            استعيدي رقبةً مشدودة
            <br />
            <span className="nkl-gold-text">وخطَّ فكٍّ يرسم أناقتك</span>
          </h1>

          <p className="nkl-h mt-5 max-w-[54ch] text-[1.06rem] font-light text-[rgba(39,28,17,0.68)]">
            الخطوط الأفقية والترهل أسفل الذقن تظهر على الرقبة قبل الوجه، لكنها
            اليوم قابلة للعلاج في جلساتٍ لا تتجاوز الساعة. نبني لكِ بروتوكولاً
            يجمع الخيوط والهايفو والبوتوكس والفيلر بعد تقييمٍ صادق لحالتك،{" "}
            <b className="font-bold text-[var(--color-nkl-ink)]">
              بنتيجة طبيعية وعودة فورية ليومك
            </b>
            .
          </p>

          <div className="nkl-h mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
            <a
              href="#booking"
              className="inline-flex items-center gap-2.5 rounded-full px-[32px] py-4 text-base font-extrabold text-[var(--color-nkl-ink)] shadow-[0_18px_44px_-14px_rgba(166,124,61,0.55)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_54px_-14px_rgba(201,156,78,0.6)]"
              style={{ background: GOLD_GRADIENT }}
            >
              احجزي استشارتك الخاصة
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </a>
            <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
              <div
                className="absolute -inset-[120%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0 55%, #C99C4E 72%, #8A6430 84%, transparent 96%)",
                  animation: "nkl-spin 3.2s linear infinite",
                }}
                aria-hidden
              />
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2.5 rounded-full bg-[#FFFDF8] px-7 py-[15px] text-base font-extrabold text-[var(--color-nkl-ink)] transition-colors duration-300 hover:bg-[#F7F0E2]"
              >
                <SocialIcon name="whatsapp" className="text-[19px] text-[#25D366]" />
                استشارة واتساب
              </a>
            </div>
          </div>

          {/* proof stats */}
          <div className="nkl-h mt-9 grid w-full max-w-[520px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-nkl-line)] bg-[var(--color-nkl-line)] sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-0.5 bg-[rgba(255,253,249,0.85)] px-2 py-3.5 backdrop-blur-sm"
              >
                <b className="text-[1.05rem] font-extrabold text-[var(--color-nkl-bronze)]">
                  {s.value}
                </b>
                <span className="text-[0.72rem] font-bold text-[rgba(39,28,17,0.55)]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ——— collage (left in RTL) ——— */}
        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="nkl-col-a flex flex-col gap-4">
              <div className="nkl-tile relative aspect-[3/4] overflow-hidden rounded-[26px] border border-[var(--color-nkl-line-strong)] shadow-[0_36px_70px_-30px_rgba(138,100,48,0.45)]">
                <Image
                  src="/neck-lift/hero-main.jpg"
                  alt="رقبة مشدودة بملامح أنيقة"
                  fill
                  sizes="(max-width: 1024px) 46vw, 232px"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="nkl-tile relative aspect-square overflow-hidden rounded-[26px] border border-[var(--color-nkl-line-strong)] shadow-[0_30px_60px_-28px_rgba(138,100,48,0.4)]">
                <Image
                  src="/neck-lift/detail.jpg"
                  alt="أجواء العناية في العيادة"
                  fill
                  sizes="(max-width: 1024px) 46vw, 232px"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
            <div className="nkl-col-b mt-10 flex flex-col gap-4">
              <div className="nkl-tile relative aspect-square overflow-hidden rounded-full border border-[var(--color-nkl-line-strong)] shadow-[0_30px_60px_-28px_rgba(138,100,48,0.4)]">
                <Image
                  src="/neck-lift/hero-orb.jpg"
                  alt="نضارة وشد في منطقة الرقبة"
                  fill
                  sizes="(max-width: 1024px) 46vw, 232px"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="nkl-tile relative aspect-[3/4] overflow-hidden rounded-[26px] border border-[var(--color-nkl-line-strong)] shadow-[0_36px_70px_-30px_rgba(138,100,48,0.45)]">
                <Image
                  src="/neck-lift/hero-front.jpg"
                  alt="بشرة رقبة ناعمة ومشدودة"
                  fill
                  sizes="(max-width: 1024px) 46vw, 232px"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* floating glass badges */}
          <span
            className="nkl-float-badge absolute -top-3 right-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-nkl-line-strong)] bg-[rgba(255,253,249,0.92)] px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[var(--color-nkl-bronze)] shadow-[0_14px_30px_-14px_rgba(138,100,48,0.45)] backdrop-blur-lg"
            style={{ animation: "nkl-floaty 7s ease-in-out infinite alternate" }}
          >
            <Icon.Syringe className="size-3.5" />
            بدون جراحة
          </span>
          <span
            className="nkl-float-badge absolute bottom-8 -left-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-nkl-line-strong)] bg-[rgba(255,253,249,0.92)] px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[var(--color-nkl-bronze)] shadow-[0_14px_30px_-14px_rgba(138,100,48,0.45)] backdrop-blur-lg"
            style={{
              animation: "nkl-floaty 8s ease-in-out .6s infinite alternate-reverse",
            }}
          >
            <Icon.Sparkles className="size-3.5" />
            نتائج تُرى من أولى الجلسات
          </span>
          <span
            className="nkl-float-badge absolute top-1/2 -right-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[var(--color-nkl-ink)] shadow-[0_14px_30px_-12px_rgba(138,100,48,0.55)]"
            style={{
              background: GOLD_GRADIENT,
              animation: "nkl-floaty 6s ease-in-out 1.2s infinite alternate",
            }}
          >
            <Icon.Star className="size-3.5" />
            ٤٫٨ على Google
          </span>
        </div>
      </div>
    </section>
  );
}
