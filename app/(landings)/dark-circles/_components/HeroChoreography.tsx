"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Scopes a cinematic GSAP timeline to the hero:
 * - `.dc-line` masks slide up
 * - `.dc-eyebrow` fades in early
 * - `.dc-sub` fades in late
 * - `.dc-cta` slides in last
 * - `.dc-hero-image` does a subtle zoom-out
 *
 * Everything is bound by the `scope` ref so it tears down cleanly when this
 * client component unmounts. Skips when prefers-reduced-motion is set.
 */
export function HeroChoreography({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set([".dc-line", ".dc-eyebrow", ".dc-sub", ".dc-cta"], {
          y: 0,
          opacity: 1,
        });
        return;
      }

      gsap.set(".dc-hero-image", { scale: 1.08 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".dc-eyebrow", { opacity: 1, y: 0, duration: 0.7 }, 0.1)
        .to(
          ".dc-line",
          { y: 0, duration: 1.1, stagger: 0.12, ease: "expo.out" },
          0.25,
        )
        .to(".dc-sub", { opacity: 1, y: 0, duration: 0.8 }, 0.85)
        .to(
          ".dc-cta",
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          1.0,
        )
        .to(
          ".dc-hero-image",
          { scale: 1, duration: 2.2, ease: "power2.out" },
          0.1,
        );
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
