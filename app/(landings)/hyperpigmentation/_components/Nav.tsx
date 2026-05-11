"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Nav() {
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
        <li>
          <a href="#problem">عن التصبّغ</a>
        </li>
        <li>
          <a href="#process">المراحل</a>
        </li>
        <li>
          <a href="#results">النتائج</a>
        </li>
        <li>
          <a href="#specialist">الطبيبة</a>
        </li>
        <li>
          <a href="#faq">أسئلة شائعة</a>
        </li>
      </ul>
      <div className="nav-cta">
        <a href="tel:+966920007515" className="nav-phone">
          +966 920007515
        </a>
        <a href="#cta" className="btn btn-gold">
          احجزي الآن
        </a>
      </div>
    </nav>
  );
}
