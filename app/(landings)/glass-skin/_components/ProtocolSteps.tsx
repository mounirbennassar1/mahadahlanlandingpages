"use client";

import { motion, type Variants } from "framer-motion";
import { Icon } from "@/components/icons";

/* The Korean glass-skin session — six studied steps, client-provided copy. */
const STEPS = [
  {
    n: "٠١",
    icon: Icon.Droplets,
    label: "المرحلة الأولى",
    title: "تنظيف البشرة بعمق",
    text: "نبدأ بتنظيف البشرة لإزالة الشوائب وبقايا المكياج والدهون، وتهيئة البشرة لاستقبال باقي الخطوات.",
  },
  {
    n: "٠٢",
    icon: Icon.Pipette,
    label: "المرحلة الثانية",
    title: "سيروم الساليسيليك أسيد",
    text: "يُطبّق سيروم يحتوي على Salicylic Acid للمساعدة في التخلص من خلايا الجلد الميتة وتنقية المسام، كما يساهم في تحسين مظهر حب الشباب الخفيف.",
  },
  {
    n: "٠٣",
    icon: Icon.Activity,
    label: "المرحلة الثالثة",
    title: "رغوة تنشيط البشرة",
    text: "رغوة خاصة تساعد على تنشيط الدورة الدموية في الوجه وتعزيز امتصاص الترطيب داخل البشرة.",
  },
  {
    n: "٠٤",
    icon: Icon.Droplet,
    label: "المرحلة الرابعة",
    title: "سيروم الترطيب المكثّف",
    text: "سيروم غني بالمكونات المرطبة لدعم توازن البشرة ومنحها ترطيباً عميقاً وملمساً أكثر نعومة.",
  },
  {
    n: "٠٥",
    icon: Icon.Flower2,
    label: "المرحلة الخامسة",
    title: "ماسك كوري مغذّي",
    text: "ماسك كوري مميز يحتوي على فيتامين E وميلاتونين طبيعي للمساعدة على ترطيب البشرة وتعزيز إشراقتها ونضارتها.",
  },
  {
    n: "٠٦",
    icon: Icon.ShieldCheck,
    label: "المرحلة السادسة",
    title: "كريم حبس الرطوبة",
    text: "نختم الجلسة بكريم خفيف يساعد على حبس الرطوبة داخل الجلد وتقوية حاجز البشرة للحفاظ على نعومة وإشراقة تدوم.",
  },
];

const GOLD = "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

/* Steps slide in from the start side (right in RTL) as the spine "draws" past them. */
const stepVar: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ProtocolSteps() {
  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      className="relative mx-auto max-w-2xl"
    >
      {/* the timeline spine — gold, centered under the numbered nodes (RTL start = right) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-3 right-[27px] w-px bg-gradient-to-b from-[var(--color-gls-primary)] via-[var(--color-gls-primary)]/35 to-transparent sm:right-[31px]"
      />

      {STEPS.map((s) => (
        <motion.li
          key={s.n}
          variants={stepVar}
          className="group relative flex gap-4 pb-8 last:pb-0 sm:gap-6"
        >
          {/* numbered node on the spine */}
          <span className="relative z-10 flex size-14 shrink-0 flex-col items-center justify-center rounded-full text-[#1d2023] shadow-[0_10px_26px_-8px_rgba(212,175,55,0.6)] ring-4 ring-[#0b0c0e] transition-transform duration-300 group-hover:scale-[1.06] sm:size-16">
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: GOLD }}
              aria-hidden
            />
            <s.icon className="relative size-5 sm:size-6" />
            <span className="relative font-[family-name:var(--font-plex-arabic)] text-[10px] font-bold leading-none">
              {s.n}
            </span>
          </span>

          {/* glass card */}
          <div className="flex-1 rounded-[1.5rem] border border-[var(--color-gls-line-soft)] bg-[#16181b]/70 p-5 backdrop-blur-sm transition-all duration-300 group-hover:-translate-x-1 group-hover:border-[var(--color-gls-line)] sm:p-6">
            <span className="font-[family-name:var(--font-plex-arabic)] text-[11px] font-semibold tracking-normal text-[var(--color-gls-primary)]">
              {s.label}
            </span>
            <h3 className="mt-1.5 text-lg font-extrabold text-white sm:text-xl">
              {s.title}
            </h3>
            <p className="mt-2.5 text-sm leading-7 text-[var(--color-gls-muted)]">
              {s.text}
            </p>
            <span
              aria-hidden
              className="mt-4 block h-px w-12 bg-gradient-to-l from-[var(--color-gls-primary)]/70 to-transparent transition-all duration-300 group-hover:w-20"
            />
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
