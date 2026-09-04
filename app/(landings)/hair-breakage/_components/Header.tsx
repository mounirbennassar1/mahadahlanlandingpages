"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";

/** Fixed header: transparent over the hero, obsidian glass after 30px. */
export function Header({ cta }: { cta: string }) {
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
          ? "border-[rgba(212,175,55,0.18)] bg-[rgba(11,11,13,0.82)] shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-[22px]">
        <Image
          src="/hair-breakage/logo.webp"
          alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
          width={58}
          height={58}
          priority
          className="size-[58px] object-contain brightness-0 invert"
        />
        <a
          href="#booking"
          className="inline-flex items-center gap-2 rounded-full px-[22px] py-2.5 text-[0.85rem] font-extrabold text-[#1A1405] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(240,212,138,0.5)]"
          style={{ background: GOLD_GRADIENT }}
        >
          {cta}
          <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
        </a>
      </div>
    </header>
  );
}
