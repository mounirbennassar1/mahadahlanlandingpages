"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";

/** Fixed header — transparent over the hero, burgundy glass after 30px. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--color-faa-line)] bg-[rgba(21,4,9,0.86)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1160px] items-center justify-between px-[22px]">
        <Image
          src="/facial-atrophy/logo.webp"
          alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
          width={58}
          height={58}
          priority
          className="size-[58px] object-contain"
        />
        <a
          href="#booking"
          className="inline-flex items-center gap-2 rounded-full px-[22px] py-2.5 text-[0.88rem] font-extrabold text-[var(--color-faa-cta-ink)] shadow-[0_10px_28px_-10px_rgba(217,179,108,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: GOLD_GRADIENT }}
        >
          احجزي استشارتك
          <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
        </a>
      </div>
    </header>
  );
}
