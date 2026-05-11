"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Reveals() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document
        .querySelectorAll<HTMLElement>(
          ".body-landing .reveal, .body-landing .reveal-char",
        )
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      document
        .querySelectorAll<HTMLElement>(
          ".body-landing [data-split], .body-landing [data-split-scroll]",
        )
        .forEach((node) => {
          if (node.dataset.splitApplied === "true") return;
          const text = node.textContent ?? "";
          node.setAttribute("aria-label", text);
          const fragment = document.createDocumentFragment();
          for (const token of text.split(/(\s+)/)) {
            if (!token) continue;
            if (/^\s+$/.test(token)) {
              fragment.appendChild(document.createTextNode(token));
              continue;
            }
            const span = document.createElement("span");
            span.className = "reveal-char";
            span.style.display = "inline-block";
            span.textContent = token;
            fragment.appendChild(span);
          }
          node.textContent = "";
          node.appendChild(fragment);
          node.dataset.splitApplied = "true";
        });

      gsap.to(".body-landing .hero-headline .reveal-char", {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1,
        stagger: 0.08,
        delay: 0.2,
      });

      gsap.to(".body-landing .hero-sub .reveal-char", {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 0.8,
        stagger: 0.04,
        delay: 0.7,
      });

      gsap.to(".body-landing .hero-cta", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1.2,
        ease: "power2.out",
      });

      gsap.utils
        .toArray<HTMLElement>(".body-landing .reveal")
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

      gsap.utils
        .toArray<HTMLElement>(".body-landing [data-split-scroll]")
        .forEach((section) => {
          const chars = section.querySelectorAll<HTMLElement>(".reveal-char");
          if (!chars.length) return;
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.7,
            stagger: 0.05,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        });

      gsap.utils
        .toArray<HTMLElement>(".body-landing [data-count]")
        .forEach((el) => {
          const target = Number(el.dataset.count ?? "0");
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "power1.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toLocaleString("ar-EG");
            },
          });
        });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
