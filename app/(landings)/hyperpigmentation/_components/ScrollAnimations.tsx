"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const isSmall = window.matchMedia("(max-width: 900px)").matches;

    let disposed = false;
    let teardown: (() => void) | undefined;

    const init = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
        gsap.utils.toArray<HTMLElement>(".reveal-fade").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        });
        gsap.utils.toArray<HTMLElement>(".reveal-x").forEach((el) => {
          gsap.to(el, {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
        gsap.utils.toArray<HTMLElement>(".reveal-x-rev").forEach((el) => {
          gsap.to(el, {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        const staggerGroups = [
          ".problem-list li",
          ".process-grid .process-card",
          ".results-grid .result-card",
          ".testi-grid .testi-card",
          ".faq-wrap .faq-item",
          ".spec-creds .spec-cred",
        ];
        staggerGroups.forEach((sel) => {
          const items = gsap.utils.toArray<HTMLElement>(sel);
          if (!items.length) return;
          gsap.from(items, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: items[0].parentElement!,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        });

        if (!isSmall) {
          gsap.utils.toArray<HTMLElement>(".parallax-soft").forEach((el) => {
            gsap.to(el, {
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });
        }

        ScrollTrigger.refresh();
      });

      teardown = () => ctx.revert();
    };

    const idle =
      "requestIdleCallback" in window
        ? (cb: () => void) =>
            (
              window as unknown as {
                requestIdleCallback: (cb: () => void) => number;
              }
            ).requestIdleCallback(cb)
        : (cb: () => void) => window.setTimeout(cb, 150);
    idle(() => {
      void init();
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return null;
}
