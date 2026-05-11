"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

type Props = {
  scopeRef: React.RefObject<HTMLElement | null>;
  progressRef?: React.RefObject<HTMLDivElement | null>;
};

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AcneAnimations({ scopeRef, progressRef }: Props) {
  // Stable ref so the hook deps stay quiet across renders.
  const mounted = useRef(false);

  useGSAP(
    () => {
      if (mounted.current) return;
      mounted.current = true;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set("[data-reveal], [data-reveal-stagger] > *", {
              clearProps: "all",
              opacity: 1,
              y: 0,
            });
            return;
          }

          // Hero entry: split first heading into per-word spans for stagger.
          const heroHeadline = scopeRef.current?.querySelector<HTMLElement>(
            "[data-hero-headline]",
          );
          if (heroHeadline && heroHeadline.dataset.splitApplied !== "true") {
            const original = heroHeadline.textContent ?? "";
            heroHeadline.setAttribute("aria-label", original);
            const fragment = document.createDocumentFragment();
            for (const token of original.split(/(\s+)/)) {
              if (!token) continue;
              if (/^\s+$/.test(token)) {
                fragment.appendChild(document.createTextNode(token));
                continue;
              }
              const span = document.createElement("span");
              span.dataset.revealChar = "true";
              span.textContent = token;
              fragment.appendChild(span);
            }
            heroHeadline.textContent = "";
            heroHeadline.appendChild(fragment);
            heroHeadline.dataset.splitApplied = "true";
          }

          const heroChars = scopeRef.current?.querySelectorAll<HTMLElement>(
            "[data-hero-headline] [data-reveal-char]",
          );
          if (heroChars && heroChars.length) {
            gsap.to(heroChars, {
              y: 0,
              opacity: 1,
              ease: "power3.out",
              duration: 1,
              stagger: 0.06,
              delay: 0.15,
            });
          }

          gsap.to("[data-hero-sub]", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            delay: 0.55,
          });

          gsap.to("[data-hero-cta]", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.08,
            delay: 0.85,
          });

          // Generic reveals
          gsap.utils
            .toArray<HTMLElement>("[data-reveal]")
            .forEach((el) => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // Stagger groups
          gsap.utils
            .toArray<HTMLElement>("[data-reveal-stagger]")
            .forEach((group) => {
              const items = group.children;
              if (!items.length) return;
              gsap.to(items, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: group,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // Counters
          gsap.utils
            .toArray<HTMLElement>("[data-count]")
            .forEach((el) => {
              const target = Number(el.dataset.count ?? "0");
              const suffix = el.dataset.countSuffix ?? "";
              const obj = { v: 0 };
              gsap.to(obj, {
                v: target,
                duration: 1.6,
                ease: "power1.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
                onUpdate: () => {
                  el.textContent =
                    Math.round(obj.v).toLocaleString("en-US") + suffix;
                },
              });
            });

          // Subtle parallax on hero halos
          gsap.utils
            .toArray<HTMLElement>("[data-parallax]")
            .forEach((el) => {
              const speed = Number(el.dataset.parallax ?? "0.15");
              gsap.to(el, {
                yPercent: -speed * 100,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              });
            });

          // Scroll progress bar (transform scaleX, not width — cheap on the compositor)
          if (progressRef?.current) {
            gsap.to(progressRef.current, {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                start: 0,
                end: "max",
                scrub: 0.25,
              },
            });
          }
        },
        scopeRef.current ?? undefined,
      );

      return () => {
        mm.revert();
      };
    },
    { scope: scopeRef },
  );

  return null;
}
