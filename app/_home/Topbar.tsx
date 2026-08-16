"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon, SocialIcon, type SocialName } from "@/components/icons";
import { HOURS_SHORT, PHONE_DISPLAY, TEL_LINK } from "./config";
import { PayLogo } from "./PayLogo";

const ANNOUNCEMENTS = [
  "قسّطي جلساتك مع تابي وتمارا على ٤ دفعات بدون فوائد",
  "طاقم نسائي بالكامل وخصوصية تامة",
  "تقييم ٤٫٨ من ٥ بأكثر من ١٢٧٠ تقييماً على Google",
];

const SOCIALS: { name: SocialName; href: string; label: string }[] = [
  {
    name: "instagram",
    href: "https://www.instagram.com/md_clinics_",
    label: "إنستغرام",
  },
  { name: "tiktok", href: "https://www.tiktok.com/@md.clinics", label: "تيك توك" },
  { name: "snapchat", href: "https://snapchat.com/t/RI87LsZs", label: "سناب شات" },
];

/**
 * Slim announcement bar above the nav: working hours on the right, a rotating
 * neon-gold message in the center, phone + socials on the left, all under an
 * animated gold sheen hairline. All messages stay mounted (translate-extension
 * safe); GSAP cycles their opacity.
 */
export function Topbar() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".md-announce");
      if (items.length < 2) return;

      const HOLD = 3.6;
      const tl = gsap.timeline({ repeat: -1 });
      items.forEach((item, i) => {
        tl.fromTo(
          item,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          i * (HOLD + 1),
        ).to(item, { autoAlpha: 0, y: -8, duration: 0.5, ease: "power2.in" }, i * (HOLD + 1) + HOLD);
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative bg-[#080604]">
      <div className="mx-auto flex h-[38px] max-w-[1180px] items-center justify-between gap-4 px-[22px] text-[0.74rem] font-bold">
        {/* hours (right in RTL) */}
        <span className="hidden shrink-0 items-center gap-2 text-[rgba(246,238,223,0.55)] lg:inline-flex">
          <span
            className="size-1.5 rounded-full bg-[#FFE9A8]"
            style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
            aria-hidden
          />
          <Icon.Clock className="size-3.5 text-[var(--color-md-champagne)]" />
          {HOURS_SHORT}
        </span>

        {/* rotating announcements */}
        <div className="relative h-full flex-1 overflow-hidden text-center">
          {ANNOUNCEMENTS.map((text, i) => (
            <span
              key={text}
              className={`md-announce absolute inset-0 flex items-center justify-center truncate px-2 ${
                i === 0 ? "" : "opacity-0"
              }`}
            >
              <span className="md-neon-text truncate">{text}</span>
            </span>
          ))}
        </div>

        {/* payments + phone + socials (left in RTL) */}
        <span className="hidden shrink-0 items-center gap-4 lg:inline-flex">
          <span
            className="flex items-center gap-2"
            title="قسّطي جلساتك مع تابي وتمارا"
          >
            <PayLogo brand="tabby" height={18} />
            <PayLogo brand="tamara" height={18} />
          </span>
          <span className="h-3.5 w-px bg-[rgba(201,156,78,0.3)]" aria-hidden />
          <a
            href={TEL_LINK}
            className="inline-flex items-center gap-1.5 text-[rgba(246,238,223,0.6)] transition-colors duration-300 hover:text-[var(--color-md-champagne)]"
          >
            <Icon.Phone className="size-3.5 text-[var(--color-md-champagne)]" />
            <span dir="ltr">{PHONE_DISPLAY}</span>
          </a>
          <span className="flex items-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-[rgba(246,238,223,0.45)] transition-all duration-300 hover:text-[#FFE9A8] hover:drop-shadow-[0_0_8px_rgba(255,233,168,0.7)]"
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </span>
        </span>
      </div>

      {/* animated gold hairline */}
      <div className="md-sheen-line h-px w-full" aria-hidden />
    </div>
  );
}
