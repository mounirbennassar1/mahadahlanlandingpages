"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TWINKLES = [
  { right: "14%", top: "24%", size: 4, color: "#C99C4E", dur: 3.6, delay: 0 },
  { right: "26%", top: "14%", size: 3, color: "#A67C3D", dur: 4.4, delay: 0.7 },
  { left: "12%", top: "20%", size: 3, color: "#C99C4E", dur: 3.9, delay: 0.3 },
  { left: "24%", top: "38%", size: 2, color: "#8A6430", dur: 4.8, delay: 1.4 },
  { right: "9%", top: "55%", size: 3, color: "#C99C4E", dur: 3.2, delay: 1 },
  { left: "8%", top: "62%", size: 4, color: "#A67C3D", dur: 5, delay: 2 },
] as const;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // entrance choreography
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.9 },
      });
      tl.from(".nkl-h", { y: 30, autoAlpha: 0, stagger: 0.14 }).from(
        ".nkl-pill",
        { scale: 0.4, autoAlpha: 0, duration: 0.8, ease: "back.out(1.6)" },
        "-=1.1",
      );

      // scroll parallax: ghost word drifts down, orb drifts up
      gsap.to(ghostRef.current, {
        yPercent: 32,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".nkl-orb", {
        y: -70,
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
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-[22px] pt-[150px] pb-[60px] text-center"
    >
      {/* dotted grid, masked to the center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(166,124,61,.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 38%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 38%, #000 30%, transparent 75%)",
        }}
        aria-hidden
      />
      {/* breathing champagne halo */}
      <div
        className="pointer-events-none absolute -top-[260px] left-1/2 h-[680px] w-[1000px] -translate-x-1/2 blur-[30px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(224,190,122,.4), transparent 70%)",
          animation: "nkl-breathe 7s ease-in-out infinite",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 -bottom-[140px] size-[460px] rounded-full blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(201,156,78,.2), transparent 65%)",
        }}
        aria-hidden
      />
      {/* twinkles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {TWINKLES.map((t, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              right: "right" in t ? t.right : undefined,
              left: "left" in t ? t.left : undefined,
              top: t.top,
              width: t.size,
              height: t.size,
              background: t.color,
              boxShadow: `0 0 9px 2px ${t.color}88`,
              animation: `nkl-twinkle ${t.dur}s ease-in-out ${t.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ghost word with scroll parallax */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span
          ref={ghostRef}
          className="nkl-serif leading-none font-bold whitespace-nowrap text-transparent select-none"
          style={{
            fontSize: "clamp(7rem, 24vw, 19rem)",
            WebkitTextStroke: "1.5px rgba(166,124,61,.13)",
          }}
        >
          شُموخ
        </span>
      </div>

      {/* floating orb photo (wide screens) */}
      <div
        className="nkl-orb pointer-events-none absolute top-[22%] right-[6%] hidden w-[170px] lg:block"
        style={{ animation: "nkl-floaty 9s ease-in-out infinite alternate" }}
        aria-hidden
      >
        <div className="aspect-square overflow-hidden rounded-full border border-[var(--color-nkl-line-strong)] shadow-[0_24px_50px_-22px_rgba(138,100,48,0.45)]">
          <Image
            src="/neck-lift/hero-orb.jpg"
            alt=""
            width={340}
            height={340}
            priority
            className="size-full object-cover"
          />
        </div>
      </div>
      {/* spinning circular text (wide screens) */}
      <div
        className="pointer-events-none absolute top-[52%] left-[5%] hidden w-[170px] lg:block"
        aria-hidden
      >
        <svg
          viewBox="0 0 200 200"
          className="block w-full"
          style={{ animation: "nkl-spin 22s linear infinite" }}
        >
          <defs>
            <path
              id="nkl-circ"
              d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
            />
          </defs>
          <circle
            cx="100"
            cy="100"
            r="52"
            fill="none"
            stroke="rgba(166,124,61,.25)"
            strokeWidth="1"
          />
          <circle cx="100" cy="100" r="4" fill="#C99C4E" />
          <text
            style={{
              fontSize: "13.5px",
              letterSpacing: "4px",
              fill: "#8A6430",
              fontWeight: 700,
            }}
          >
            <textPath href="#nkl-circ">
              عيادة مها دحلان ✦ جمالٌ يليق بكِ ✦ عيادة مها دحلان ✦
            </textPath>
          </text>
        </svg>
      </div>

      <div className="relative z-[2] flex max-w-[940px] flex-col items-center">
        <span className="nkl-h inline-flex items-center gap-2.5 rounded-full border border-[var(--color-nkl-line-strong)] bg-[rgba(255,253,249,0.7)] px-[18px] py-2 text-[0.8rem] font-bold tracking-[0.05em] text-[var(--color-nkl-bronze)] backdrop-blur-lg">
          <span
            className="size-1.5 rounded-full bg-[var(--color-nkl-gold-bright)]"
            style={{ boxShadow: "0 0 8px 2px rgba(201,156,78,.6)" }}
          />
          علاج ترهل الرقبة وعلامات التقدم بالسن
        </span>

        <h1 className="mt-7 flex flex-col items-center gap-1 text-[clamp(2.1rem,5.6vw,3.9rem)] leading-[1.32] font-extrabold">
          <span className="nkl-h">عمرُكِ سرٌّ لا يعرفه أحد…</span>
          <span className="nkl-h inline-flex flex-wrap items-center justify-center gap-[clamp(10px,2vw,22px)]">
            <span>ورقبتُكِ</span>
            <span className="nkl-pill inline-block w-[clamp(86px,11vw,150px)] shrink-0 overflow-hidden rounded-full border-2 border-[rgba(201,156,78,0.6)] shadow-[0_0_0_7px_rgba(201,156,78,0.12),0_30px_60px_-24px_rgba(138,100,48,0.5)]"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src="/neck-lift/hero-main.jpg"
                alt="رقبة مشدودة بملامح أنيقة"
                width={300}
                height={400}
                priority
                className="size-full object-cover"
              />
            </span>
            <span className="nkl-serif nkl-gold-text font-bold">
              لن تُفشيَه بعد اليوم
            </span>
          </span>
        </h1>

        <p className="nkl-h mt-6 max-w-[58ch] text-[1.08rem] font-light text-[rgba(39,28,17,0.68)]">
          الخطوط الأفقية، الترهل أسفل الذقن، وفقدان تحديد خط الفك: علاماتٌ تظهر
          على الرقبة قبل الوجه. في عيادة مها دحلان نعالجها بتقنيات غير جراحية
          دقيقة تُعيد لعنقكِ شدّه وتحديده،{" "}
          <b className="font-bold text-[var(--color-nkl-ink)]">
            بنتائج طبيعية وخصوصية تامة
          </b>
          .
        </p>

        <div className="nkl-h mt-[34px] flex flex-wrap justify-center gap-3.5">
          <a
            href="#booking"
            className="inline-flex items-center gap-2.5 rounded-full px-[34px] py-4 text-base font-extrabold text-[var(--color-nkl-ink)] shadow-[0_18px_44px_-14px_rgba(166,124,61,0.55)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_54px_-14px_rgba(201,156,78,0.6)]"
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
              className="relative inline-flex items-center gap-2.5 rounded-full bg-[#FFFDF8] px-[30px] py-[15px] text-base font-extrabold text-[var(--color-nkl-ink)] transition-colors duration-300 hover:bg-[#F7F0E2]"
            >
              <SocialIcon name="whatsapp" className="text-[19px] text-[#25D366]" />
              استشارة واتساب
            </a>
          </div>
        </div>

        <div className="nkl-h mt-[30px] flex flex-wrap justify-center gap-x-[26px] gap-y-3 text-[0.84rem] text-[rgba(39,28,17,0.55)]">
          <span className="inline-flex items-center gap-[7px]">
            <Icon.CircleCheck className="size-[15px] text-[var(--color-nkl-gold)]" />
            بدون جراحة
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <Icon.ShieldCheck className="size-[15px] text-[var(--color-nkl-gold)]" />
            إشراف طبي متخصص
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <Icon.Lock className="size-[15px] text-[var(--color-nkl-gold)]" />
            خصوصية تامة
          </span>
        </div>

        <div className="nkl-h mt-[52px] flex flex-col items-center gap-2">
          <span className="text-[0.72rem] font-bold tracking-[0.2em] text-[rgba(138,100,48,0.7)]">
            اكتشفي المزيد
          </span>
          <span className="relative block h-10 w-[1.5px] overflow-hidden rounded-sm bg-[rgba(166,124,61,0.25)]">
            <span
              className="absolute inset-x-0 top-0 h-2 rounded-sm bg-[var(--color-nkl-gold-bright)]"
              style={{ animation: "nkl-dot-y 1.8s ease-in-out infinite" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
