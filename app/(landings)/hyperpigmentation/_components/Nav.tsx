"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ContentOf } from "@/lib/pages/define";
import type { HYPERPIGMENTATION } from "../content";

/** Anchors for the nav links, in content order. */
const NAV_HREFS = ["#problem", "#process", "#results", "#specialist", "#faq"] as const;

type NavCopy = ContentOf<typeof HYPERPIGMENTATION>["nav"];

export default function Nav({ copy }: { copy: NavCopy }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <a href="#" className="logo" aria-label="مها دهلان">
        <Image
          src="/hyperpigmentation/logo.avif"
          alt="مها دهلان"
          width={160}
          height={48}
          priority
          className="logo-img"
        />
      </a>
      <ul className="nav-links">
        {copy.links.map((link, i) => (
          <li key={NAV_HREFS[i]}>
            <a href={NAV_HREFS[i]}>{link.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-cta">
        <a href="tel:+966920007515" className="nav-phone">
          +966 920007515
        </a>
        <a href="#cta" className="btn btn-gold">
          {copy.book}
        </a>
      </div>
    </nav>
  );
}
