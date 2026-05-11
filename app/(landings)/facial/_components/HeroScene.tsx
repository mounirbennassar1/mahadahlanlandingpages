"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAPContext } from "./useGSAPContext";
import { EASE, DURATION } from "./motion.tokens";
import { MagneticButton } from "./MagneticButton";

export function HeroScene() {
  const container = useRef<HTMLDivElement>(null);

  const bgGlow = useRef<HTMLDivElement>(null);
  const heroImageContainer = useRef<HTMLDivElement>(null);
  const heroImage = useRef<HTMLImageElement>(null);
  const badge = useRef<HTMLDivElement>(null);
  const titleLine1 = useRef<HTMLDivElement>(null);
  const titleLine2 = useRef<HTMLDivElement>(null);
  const titleLine3 = useRef<HTMLDivElement>(null);
  const description = useRef<HTMLParagraphElement>(null);
  const ctaGroup = useRef<HTMLDivElement>(null);

  useGSAPContext(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(
        [
          badge.current,
          titleLine1.current,
          titleLine2.current,
          titleLine3.current,
          description.current,
          ctaGroup.current,
          heroImageContainer.current,
        ],
        { opacity: 1, y: 0, x: 0 },
      );
      gsap.set(heroImageContainer.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });
      return;
    }

    gsap.set(heroImageContainer.current, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(heroImage.current, { scale: 1.2 });

    gsap.set(
      [badge.current, titleLine1.current, titleLine2.current, titleLine3.current, description.current],
      { y: 100, opacity: 0, rotate: 2 },
    );

    gsap.set(ctaGroup.current, { opacity: 0, filter: "blur(10px)" });
    gsap.set(bgGlow.current, { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({ defaults: { ease: EASE.lux } });

    tl.to(
      heroImageContainer.current,
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%)", duration: 1.5 },
      0.1,
    )
      .to(heroImage.current, { scale: 1, duration: 2.5, ease: "power2.out" }, 0.1)
      .to(bgGlow.current, { opacity: 0.8, scale: 1, duration: 2 }, 0.4)
      .to(
        [badge.current, titleLine1.current, titleLine2.current, titleLine3.current],
        { y: 0, opacity: 1, rotate: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        0.5,
      )
      .to(
        description.current,
        { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "power3.out" },
        0.8,
      )
      .to(ctaGroup.current, { opacity: 1, filter: "blur(0px)", duration: DURATION.base }, 1.2);
  }, []);

  return (
    <section
      ref={container}
      className="relative h-[100svh] min-h-[700px] w-full bg-[#050505] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none" />
      <div
        ref={bgGlow}
        className="absolute right-[-20%] bottom-[-20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-t from-[#D4AF37] to-[#B8860B] blur-[150px] mix-blend-screen opacity-10 pointer-events-none"
      />

      <div
        ref={heroImageContainer}
        className="absolute top-0 left-0 w-full md:w-[65vw] lg:w-[55vw] h-full z-0 overflow-hidden isolate"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-transparent to-transparent z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={heroImage}
          src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Clinic Aesthetic"
          className="object-cover object-[70%_50%] w-full h-full"
        />
      </div>

      <div className="container relative z-20 mx-auto px-6 lg:px-12 flex h-full items-center pl-0">
        <div className="w-full md:w-[80vw] lg:w-[65vw] pt-20">
          <div className="overflow-hidden mb-6 mt-12 md:mt-0">
            <div ref={badge}>
              <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur-md text-[#D4AF37] text-sm tracking-wide font-medium shadow-[0_0_20px_rgba(228,187,81,0.1)]">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                الرعاية الجلدية المتقدمة
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.25] tracking-tight mb-8">
            <div className="overflow-hidden py-2">
              <div ref={titleLine1} className="text-white drop-shadow-xl">في مجمع</div>
            </div>
            <div className="overflow-hidden py-2">
              <div
                ref={titleLine2}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4db93] via-[#D4AF37] to-[#B8860B] drop-shadow-2xl"
              >
                عيادات د. مها
              </div>
            </div>
            <div className="overflow-hidden py-2">
              <div ref={titleLine3} className="text-white drop-shadow-xl">دحلان – جدة</div>
            </div>
          </h1>

          <div className="overflow-hidden mb-12">
            <p
              ref={description}
              className="max-w-xl text-lg md:text-2xl text-zinc-300 leading-relaxed font-light drop-shadow-md bg-black/40 backdrop-blur-sm p-4 rounded-2xl md:bg-transparent md:backdrop-blur-none md:p-0"
            >
              نقدم في مجمع عيادات د. مها دحلان |{" "}
              <strong className="text-[#D4AF37] font-medium">MD Clinics</strong> مجموعة متقدمة من
              علاجات البشرة المصممة لتحسين صحة البشرة واستعادة نضارتها. من جلسات تنظيف البشرة
              المتقدمة إلى تقنيات الهيدرافيشل وتنظيف الفروة، يتم تنفيذ كل إجراء باستخدام{" "}
              <strong className="text-[#D4AF37] font-medium">أجهزة طبية حديثة</strong> وبروتوكولات
              معتمدة تناسب احتياجات كل بشرة.
            </p>
          </div>

          <div
            ref={ctaGroup}
            className="flex flex-col sm:flex-row items-center justify-start gap-4 md:gap-6"
          >
            <MagneticButton>
              <a
                href="https://wa.me/966503377702?text=مرحباً%20عندي%20استفسار%20عن%20الخدمات%20والأسعار%20(عروض_جوجل)"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full sm:w-auto px-8 md:px-12 py-5 bg-[#D4AF37] text-black font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 block text-center rounded-2xl"
              >
                <span className="relative z-10">احجز موعدك الآن</span>
                <div className="absolute inset-0 h-full w-full bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 rounded-2xl"></div>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="https://wa.me/966503377702?text=مرحباً%20عندي%20استفسار%20عن%20الخدمات%20والأسعار%20(عروض_جوجل)"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 md:px-12 py-5 border border-white/20 hover:border-[#D4AF37]/50 bg-black/40 hover:bg-black/60 text-white font-medium backdrop-blur-md transition-all duration-300 text-lg block text-center rounded-2xl"
              >
                اكتشف خدماتنا
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-4 z-30 opacity-70">
        <span className="text-xs text-zinc-400 uppercase tracking-[0.3em] rotate-90 origin-right translate-y-8 font-sans">
          Scroll
        </span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay z-40 pointer-events-none" />
    </section>
  );
}
