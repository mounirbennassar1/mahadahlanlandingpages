"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroChoreography({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── intro timeline ─────────────────────────────────────────────
      gsap.set(".mrf-line", { yPercent: 110 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });

      tl.to(".mrf-line", {
        yPercent: 0,
        stagger: 0.12,
        duration: 1.1,
      })
        .to(".mrf-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, "-=0.8")
        .to(".mrf-sub", { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
        .to(
          ".mrf-cta",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.5",
        );

      // ── scroll-linked parallax on hero media ───────────────────────
      // Only on devices that can hover (desktop-ish) and don't request reduced motion.
      const matchMedia = gsap.matchMedia();
      matchMedia.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const media = ref.current?.querySelector<HTMLElement>("[data-mrf-hero-media]");
          if (!media) return;

          // Parallax: media drifts down ~22% of its height as the hero
          // scrolls out of view. ScrollTrigger handles all the math.
          gsap.fromTo(
            media,
            { yPercent: 0, scale: 1 },
            {
              yPercent: 22,
              scale: 1.04,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );

          // Subtle counter-parallax on the headline column for depth.
          const headline = ref.current?.querySelector<HTMLElement>("h1");
          if (headline) {
            gsap.fromTo(
              headline,
              { yPercent: 0 },
              {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            );
          }
        },
      );
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
