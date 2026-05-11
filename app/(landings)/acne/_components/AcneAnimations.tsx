"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  scopeRef: React.RefObject<HTMLElement | null>;
  progressRef?: React.RefObject<HTMLDivElement | null>;
};

export default function AcneAnimations({ scopeRef, progressRef }: Props) {
  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      gsap.registerPlugin(ScrollTrigger);

      const root = scopeRef.current;
      if (!root) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        // Reduced motion: ensure everything is visible, skip animations.
        gsap.set(
          root.querySelectorAll(
            "[data-reveal], [data-reveal-stagger] > *, [data-hero-headline], [data-hero-sub], [data-hero-cta]",
          ),
          { clearProps: "all", opacity: 1, y: 0 },
        );
        return;
      }

      // Split hero headline into per-word spans for stagger.
      const heroHeadline = root.querySelector<HTMLElement>(
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

      // Set initial state in JS — if anything below errors, content stays visible.
      gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 0, y: 24 });
      gsap.set(root.querySelectorAll("[data-reveal-stagger] > *"), {
        opacity: 0,
        y: 24,
      });
      gsap.set(root.querySelectorAll("[data-hero-headline] [data-reveal-char]"), {
        opacity: 0,
        y: "40%",
      });
      gsap.set(root.querySelectorAll("[data-hero-sub], [data-hero-cta]"), {
        opacity: 0,
        y: 16,
      });

      // Hero entrance
      const heroChars = root.querySelectorAll<HTMLElement>(
        "[data-hero-headline] [data-reveal-char]",
      );
      if (heroChars.length) {
        gsap.to(heroChars, {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          duration: 1,
          stagger: 0.06,
          delay: 0.15,
        });
      }

      gsap.to(root.querySelectorAll("[data-hero-sub]"), {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.55,
      });

      gsap.to(root.querySelectorAll("[data-hero-cta]"), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.85,
      });

      // Scroll-triggered reveals
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Stagger groups
      root
        .querySelectorAll<HTMLElement>("[data-reveal-stagger]")
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
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        });

      // Counters
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count ?? "0");
        const suffix = el.dataset.countSuffix ?? "";
        const obj = { v: 0 };
        // Preserve final state in DOM as a fallback — set the end value first
        // so the number is correct even if the tween never runs.
        el.textContent = target.toLocaleString("en-US") + suffix;
        obj.v = 0;
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              obj.v = 0;
            },
          },
          onUpdate: () => {
            el.textContent =
              Math.round(obj.v).toLocaleString("en-US") + suffix;
          },
        });
      });

      // Parallax on decorative halos
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
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

      // Scroll progress bar
      if (progressRef?.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "0 50%" });
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
    { scope: scopeRef },
  );

  return null;
}
