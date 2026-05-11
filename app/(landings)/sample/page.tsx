"use client";

import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { Icon, SocialIcon } from "@/components/icons";

export default function SampleLanding() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: heroRef },
  );

  return (
    <main className="min-h-screen">
      <section
        ref={heroRef}
        className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-zinc-500"
        >
          نموذج صفحة هبوط
        </motion.span>

        <h1 className="hero-title font-display text-5xl font-bold sm:text-7xl">
          مرحباً بك في مها دحلان
        </h1>

        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          هذه صفحة نموذج تجمع Framer Motion و GSAP و Lenis مع دعم العربية واتجاه RTL.
          استنسخ هذه الصفحة لإنشاء صفحات هبوط جديدة.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-background"
          >
            <Icon.ArrowLeft className="size-4" />
            ابدأ الآن
          </a>
        </div>

        <div className="mt-10 flex items-center gap-5 text-zinc-500">
          <SocialIcon name="instagram" className="size-5" />
          <SocialIcon name="x" className="size-5" />
          <SocialIcon name="tiktok" className="size-5" />
          <SocialIcon name="youtube" className="size-5" />
        </div>
      </section>
    </main>
  );
}
