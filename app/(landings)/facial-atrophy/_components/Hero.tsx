"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon, SocialIcon } from "@/components/icons";
import { EASE } from "./Reveal";
import { GOLD_GRADIENT, WA_LINK } from "./config";

const TWINKLES = [
  { right: "16%", top: "22%", size: 3, dur: 3.4, delay: 0 },
  { right: "28%", top: "12%", size: 2, dur: 4.2, delay: 0.6 },
  { right: "8%", top: "46%", size: 4, dur: 5, delay: 1.2 },
  { left: "14%", top: "18%", size: 3, dur: 3.8, delay: 0.3 },
  { left: "24%", top: "34%", size: 2, dur: 4.6, delay: 1.6 },
  { left: "7%", top: "58%", size: 3, dur: 3.2, delay: 0.9 },
  { right: "38%", top: "8%", size: 2, dur: 5.4, delay: 2 },
  { left: "42%", top: "6%", size: 3, dur: 4, delay: 2.6 },
  { right: "12%", top: "70%", size: 2, dur: 4.4, delay: 1.1 },
  { left: "18%", top: "76%", size: 3, dur: 3.6, delay: 0.4 },
] as const;

const fadeUpAt = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-[22px] pt-[130px] pb-[70px] text-center">
      {/* ambient burgundy radials */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(110,31,53,.55), transparent 65%), radial-gradient(900px 500px at 85% 80%, rgba(74,14,30,.5), transparent 70%)",
        }}
        aria-hidden
      />
      {/* breathing gold halo */}
      <div
        className="pointer-events-none absolute -top-60 left-1/2 h-[700px] w-[980px] -translate-x-1/2 blur-[34px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(240,212,138,.17), transparent 70%)",
          animation: "faa-breathe 7s ease-in-out infinite",
        }}
        aria-hidden
      />
      {/* floating orbs */}
      <div
        className="pointer-events-none absolute top-[18%] -right-[140px] size-[420px] rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(166,124,61,.22), transparent 65%)",
          animation: "faa-floaty 12s ease-in-out infinite alternate",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[6%] -left-40 size-[460px] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(110,31,53,.4), transparent 65%)",
          animation: "faa-floaty 14s ease-in-out infinite alternate-reverse",
        }}
        aria-hidden
      />
      {/* twinkles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {TWINKLES.map((t, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[var(--color-faa-gold-bright)]"
            style={{
              right: "right" in t ? t.right : undefined,
              left: "left" in t ? t.left : undefined,
              top: t.top,
              width: t.size,
              height: t.size,
              boxShadow: "0 0 9px 2px rgba(240,212,138,.65)",
              animation: `faa-twinkle ${t.dur}s ease-in-out ${t.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-[2] flex max-w-[860px] flex-col items-center">
        <motion.span
          {...fadeUpAt(0.05)}
          className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(217,179,108,0.32)] bg-[rgba(217,179,108,0.07)] px-[18px] py-2 text-[0.8rem] font-bold tracking-[0.06em] text-[var(--color-faa-ink-soft)] backdrop-blur-lg"
        >
          <span
            className="size-1.5 rounded-full bg-[var(--color-faa-gold-bright)]"
            style={{ boxShadow: "0 0 8px 2px rgba(240,212,138,.7)" }}
          />
          علاج ضمور الوجه بعد إبر التنحيف
        </motion.span>

        <motion.h1
          {...fadeUpAt(0.18)}
          className="mt-[26px] text-[clamp(2.2rem,6vw,4.1rem)] leading-[1.3] font-extrabold tracking-[-0.01em]"
        >
          خسرتِ الوزن بنجاح…
          <br />
          <span className="faa-serif faa-gold-text font-bold">
            فلنُعِد لوجهكِ امتلاءه وإشراقته
          </span>
        </motion.h1>

        <motion.p
          {...fadeUpAt(0.32)}
          className="mt-[22px] max-w-[56ch] text-[1.08rem] font-light text-[rgba(243,233,220,0.72)]"
        >
          فقدان الوزن السريع قد يترك ملامح الوجه أنحف وأكثر إرهاقاً مما ينبغي.
          في عيادة مها دحلان نعيد التوازن لملامحك بخطة علاجية دقيقة تُصمَّم لكِ
          وحدك،{" "}
          <b className="font-bold text-[var(--color-faa-ink)]">
            بنتائج طبيعية وخصوصية تامة
          </b>
          .
        </motion.p>

        <motion.div
          {...fadeUpAt(0.46)}
          className="mt-8 flex flex-wrap justify-center gap-3.5"
        >
          <a
            href="#booking"
            className="inline-flex items-center gap-2.5 rounded-full px-[34px] py-4 text-base font-extrabold text-[var(--color-faa-cta-ink)] shadow-[0_18px_44px_-14px_rgba(217,179,108,0.55)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_54px_-14px_rgba(240,212,138,0.65)]"
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
                  "conic-gradient(from 0deg, transparent 0 55%, #F0D48A 72%, #A67C3D 84%, transparent 96%)",
                animation: "faa-spin 3.2s linear infinite",
              }}
              aria-hidden
            />
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2.5 rounded-full bg-[#22070F] px-[30px] py-[15px] text-base font-extrabold text-[var(--color-faa-gold-pale)] transition-colors duration-300 hover:bg-[#35101C]"
            >
              <SocialIcon name="whatsapp" className="text-[19px] text-[#25D366]" />
              استشارة واتساب
            </a>
          </div>
        </motion.div>

        <motion.div
          {...fadeUpAt(0.6)}
          className="mt-7 flex flex-wrap justify-center gap-x-[26px] gap-y-3 text-[0.84rem] text-[rgba(243,233,220,0.6)]"
        >
          <span className="inline-flex items-center gap-[7px]">
            <Icon.ShieldCheck className="size-[15px] text-[var(--color-faa-gold)]" />
            إشراف طبي متخصص
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <Icon.Lock className="size-[15px] text-[var(--color-faa-gold)]" />
            خصوصية تامة
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <Icon.CircleCheck className="size-[15px] text-[var(--color-faa-gold)]" />
            نتائج طبيعية بلا مبالغة
          </span>
        </motion.div>
      </div>

      {/* floating photo trio */}
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.75 }}
        className="relative z-[2] mt-[60px] flex items-end justify-center"
      >
        <div className="z-[1] -ms-4 w-[clamp(108px,23vw,220px)] rotate-8 translate-y-[30px]">
          <div
            className="aspect-[3/4] overflow-hidden rounded-[20px] border border-[rgba(217,179,108,0.28)] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]"
            style={{ animation: "faa-floaty 7s ease-in-out .5s infinite alternate" }}
          >
            <Image
              src="/facial-atrophy/hero-glow.webp"
              alt="نضارة البشرة بعد العلاج"
              width={460}
              height={613}
              priority
              className="size-full object-cover"
            />
          </div>
        </div>
        <div className="relative z-[3] w-[clamp(150px,30vw,285px)]">
          <div
            className="aspect-[3/4] overflow-hidden rounded-3xl border-[1.5px] border-[rgba(240,212,138,0.5)] shadow-[0_0_0_6px_rgba(217,179,108,0.08),0_44px_90px_-34px_rgba(0,0,0,0.9)]"
            style={{ animation: "faa-floaty 7s ease-in-out infinite alternate" }}
          >
            <Image
              src="/facial-atrophy/hero-center.webp"
              alt="ملامح ممتلئة ومشرقة"
              width={600}
              height={800}
              priority
              className="size-full object-cover"
            />
          </div>
          <span
            className="absolute -top-3.5 -right-[30px] inline-flex items-center gap-[7px] rounded-full border border-[var(--color-faa-line-strong)] bg-[rgba(21,4,9,0.75)] px-3.5 py-[7px] text-[0.72rem] font-extrabold whitespace-nowrap text-[var(--color-faa-gold-bright)] backdrop-blur-lg"
            style={{
              animation: "faa-floaty 6s ease-in-out 1s infinite alternate-reverse",
            }}
          >
            نتائج طبيعية
          </span>
          <span
            className="absolute bottom-[22px] -left-[42px] inline-flex items-center gap-[7px] rounded-full border border-[var(--color-faa-line-strong)] bg-[rgba(21,4,9,0.75)] px-3.5 py-[7px] text-[0.72rem] font-extrabold whitespace-nowrap text-[var(--color-faa-gold-bright)] backdrop-blur-lg"
            style={{ animation: "faa-floaty 8s ease-in-out .3s infinite alternate" }}
          >
            خصوصية تامة
          </span>
        </div>
        <div className="z-[1] -me-4 w-[clamp(108px,23vw,220px)] -rotate-8 translate-y-[30px]">
          <div
            className="aspect-[3/4] overflow-hidden rounded-[20px] border border-[rgba(217,179,108,0.28)] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]"
            style={{
              animation: "faa-floaty 7s ease-in-out 1.2s infinite alternate",
            }}
          >
            <Image
              src="/facial-atrophy/hero-clinic.webp"
              alt="أجواء العيادة"
              width={460}
              height={613}
              priority
              className="size-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[140px]"
        style={{
          background: "linear-gradient(to top, #150409, transparent)",
        }}
        aria-hidden
      />
    </section>
  );
}
