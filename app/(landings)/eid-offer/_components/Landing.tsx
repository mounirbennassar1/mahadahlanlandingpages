"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faInstagram,
  faXTwitter,
  faTiktok,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import type { ContentOf } from "@/lib/pages/define";
import type { EID_OFFER } from "../content";

const WA_NUMBER = "966503377702";
const WA_TOPIC = "عرض عيد الأضحى — أرغب بحجز موعد";
const waLink = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA_DEFAULT = waLink(WA_TOPIC);

// 5 days from today
const EID_OFFSET_MS = 5 * 24 * 60 * 60 * 1000;

/* ───────── design assets, zipped with the editable rows by index ───────── */

/** Nav destinations, in content order. */
const NAV_HREFS = ["#home", "#services", "#offers", "#doctors", "#why"] as const;

/** Slug (React key) and photo per service, in content order. */
const SERVICE_IMAGES = [
  { slug: "hydrafacial", image: "/eid-offer/hydrafacial.webp" },
  { slug: "hair", image: "/eid-offer/hairv1.webp" },
  { slug: "botox", image: "/eid-offer/botoxv1.webp" },
  { slug: "filler", image: "/eid-offer/filler.webp" },
  { slug: "dark-circles", image: "/eid-offer/dark-circlev1.webp" },
  { slug: "hyperpigmentation", image: "/eid-offer/hyperpigmentation.v1.webp" },
  { slug: "microneedling-rf", image: "/eid-offer/microneedling-rfv1.webp" },
  { slug: "stretchmarks", image: "/eid-offer/stretchmarks.webp" },
] as const;

/** Portraits for the medical team, in content order. */
const DOCTOR_IMAGES = [
  "/team/dr-maha.avif",
  "/team/dr-inas.avif",
  "/team/dr-lajin.avif",
] as const;

/** SVG paths for the benefit icons, in content order. */
const BENEFIT_PATHS = [
  "M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7zM9 12l2 2 4-4",
  "M3 4h18v16H3zM3 10h18M8 14h2M8 18h2",
  "M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z",
  "M20 12V8H4v12h12M16 16l3 3 5-5",
] as const;

const PHONE_DISPLAY = "+966 50 337 7702";

const arabicDigits = (n: number) =>
  String(n).padStart(2, "0").replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Landing({ content }: { content: ContentOf<typeof EID_OFFER> }) {
  const c = content;
  const NAV_LINKS = NAV_HREFS.map((href, i) => ({
    href,
    label: c.nav.links[i]?.label ?? "",
  }));
  const SERVICES = c.services.cards.map((card, i) => ({
    ...card,
    ...SERVICE_IMAGES[i],
  }));
  const DOCTORS = c.doctors.people.map((person, i) => ({
    ...person,
    img: DOCTOR_IMAGES[i],
  }));
  const BENEFITS = c.benefits.cards.map((card, i) => ({
    ...card,
    path: BENEFIT_PATHS[i],
  }));
  const OFFERS = c.offers.cards;
  const COUNT_UNITS = c.countdown.units;

  const root = useRef<HTMLDivElement>(null);
  const [cd, setCd] = useState({ d: "٠٥", h: "٠٠", m: "٠٠", s: "٠٠" });

  // Countdown: 5 full days from first mount
  useEffect(() => {
    const target = Date.now() + EID_OFFSET_MS;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setCd({
        d: arabicDigits(d),
        h: arabicDigits(h),
        m: arabicDigits(m),
        s: arabicDigits(s),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // GSAP entrance + scroll-driven animations
  useGSAP(
    () => {
      // Reveal blocks on scroll
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-text .ribbon", { opacity: 0, y: 14, duration: 0.6 })
        .from(".hero-text h1", { opacity: 0, y: 22, duration: 0.8 }, "-=0.3")
        .from(".hero-text .hero-sub", { opacity: 0, y: 16, duration: 0.7 }, "-=0.4")
        .from(".hero-text .hero-cta > *", {
          opacity: 0,
          y: 14,
          duration: 0.6,
          stagger: 0.1,
        }, "-=0.4")
        .from(".medallion", { scale: 0.85, opacity: 0, duration: 1.1, ease: "power2.out" }, "-=0.7")
        .from(".float-card", {
          opacity: 0,
          scale: 0.8,
          y: 16,
          duration: 0.6,
          stagger: 0.08,
        }, "-=0.8")
        .from(".count-strip", { opacity: 0, y: 28, duration: 0.8 }, "-=0.4");

      // Floaty cards continuous bob
      gsap.utils.toArray<HTMLElement>(".float-card").forEach((card, i) => {
        gsap.to(card, {
          y: "-=10",
          duration: 3 + (i % 3) * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.2,
        });
      });

      // Medallion floaty
      gsap.to(".medallion", {
        y: -14,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Parallax for medallion on scroll
      gsap.to(".medallion", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Service cards stagger
      gsap.from(".svc", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".svc-grid", start: "top 80%" },
      });
      gsap.from(".doc", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".doc-grid", start: "top 80%" },
      });
      gsap.from(".offer-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".offer-grid", start: "top 80%" },
      });
      gsap.from(".ben", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ben-list", start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      {/* ===== NAV ===== */}
      <nav className="eid-nav">
        <div className="shell nav-inner">
          <a href="#home" className="logo" aria-label="عيادة مها دحلان">
            <Image src="/logo.webp" alt="عيادة مها دحلان" width={140} height={44} />
          </a>
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
          <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="nav-cta">
            <FontAwesomeIcon icon={faWhatsapp} />
            {c.nav.cta}
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="hero" id="home">
        <div className="shell">
          <div className="hero-text">
            <span className="ribbon eyebrow">
              <span className="dot" />
              {c.hero.badge}
            </span>
            <h1 className="hero-title">
              {c.hero.line1} <br />
              {c.hero.line2} <span className="gilt">{c.hero.highlight}</span>
            </h1>
            <p className="hero-sub">
              {c.hero.body}
            </p>
            <div className="hero-cta">
              <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="btn-wa">
                <FontAwesomeIcon icon={faWhatsapp} />
                {c.hero.ctaWhatsapp}
              </a>
              <a href="#offers" className="btn-ghost">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                {c.hero.ctaOffers}
              </a>
            </div>
          </div>

          <div className="hero-stage">
            <div className="spark s1"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg></div>
            <div className="spark s2"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg></div>
            <div className="spark s3"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg></div>
            <div className="spark s4"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg></div>
            <div className="spark s5"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg></div>

            <div className="medallion">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/eid-offer/hero.webp" alt="إطلالة عيد ذهبية" className="hero-photo" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            </div>

            <div className="float-card fc1">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2 5 5 .5-4 3.5 1 5L12 13l-4 3 1-5L5 7.5 10 7z" />
                </svg>
              </div>
              <div>
                <div className="label">{c.hero.floats[0].label}</div>
                <div className="val">{c.hero.floats[0].value} <span className="pct">{c.hero.floats[0].percent}</span></div>
              </div>
            </div>
            <div className="float-card fc2">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <div>
                <div className="label">{c.hero.floats[1].label}</div>
                <div className="val">{c.hero.floats[1].value}</div>
              </div>
            </div>
            <div className="float-card fc3">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <div className="label">{c.hero.floats[2].label}</div>
                <div className="val">{c.hero.floats[2].value} <span className="pct">{c.hero.floats[2].percent}</span></div>
              </div>
            </div>
            <div className="float-card fc4">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <div className="label">{c.hero.floats[3].label}</div>
                <div className="val">{c.hero.floats[3].value}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="count-strip reveal" id="countdown">
          <div className="ttl">
            <small>{c.countdown.eyebrow}</small>
            {c.countdown.title}
          </div>
          <div className="count-cell"><div className="num">{cd.d}</div><div className="unit">{COUNT_UNITS[0].label}</div></div>
          <div className="count-cell"><div className="num">{cd.h}</div><div className="unit">{COUNT_UNITS[1].label}</div></div>
          <div className="count-cell"><div className="num">{cd.m}</div><div className="unit">{COUNT_UNITS[2].label}</div></div>
          <div className="count-cell"><div className="num">{cd.s}</div><div className="unit">{COUNT_UNITS[3].label}</div></div>
        </div>
      </header>

      {/* ===== SERVICES ===== */}
      <section className="eid-section services" id="services">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="sec-eyebrow">{c.services.eyebrow}</span>
            <h2 className="sec-title">
              {c.services.title} <span className="gilt">{c.services.highlight}</span> {c.services.titleRest}
            </h2>
            <p className="sec-sub">
              {c.services.sub}
            </p>
          </div>

          <div className="svc-grid">
            {SERVICES.map((s) => (
              <article className="svc" key={s.slug}>
                <div className="svc-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.title} loading="lazy" />
                  <span className="badge">{s.badge}</span>
                </div>
                <div className="svc-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <a
                    href={waLink(`عرض العيد — ${s.title}: أرغب بالحجز والاستفسار عن السعر`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="svc-wa"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    {c.services.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFERS ===== */}
      <section className="eid-section offers-band" id="offers">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="sec-eyebrow">{c.offers.eyebrow}</span>
            <h2 className="sec-title">
              {c.offers.title} <span className="gilt">{c.offers.highlight}</span> {c.offers.titleRest}
            </h2>
            <p className="sec-sub">
              {c.offers.sub}
            </p>
          </div>

          <div className="offer-grid">
            <div className="offer-card o1">
              <div className="deco" />
              <div className="num">{OFFERS[0].num}</div>
              <div>
                <div className="tag">{OFFERS[0].tag}</div>
                <h4>{OFFERS[0].title}</h4>
                <div className="desc">
                  {OFFERS[0].desc}
                </div>
              </div>
              <a
                href={waLink(`${OFFERS[0].title} — أرغب بالحجز`)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                {c.offers.cta}
              </a>
            </div>

            <div className="offer-card o2">
              <div className="deco" />
              <div className="num">{OFFERS[1].num}</div>
              <div>
                <div className="tag">{OFFERS[1].tag}</div>
                <h4>{OFFERS[1].title}</h4>
                <div className="desc">
                  {OFFERS[1].desc}
                </div>
              </div>
              <a
                href={waLink(`${OFFERS[1].title} — أرغب بالحجز`)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                {c.offers.cta}
              </a>
            </div>

            <div className="offer-card o3">
              <div
                className="deco"
                style={{ background: "radial-gradient(circle,rgba(202,161,99,.4),transparent 70%)" }}
              />
              <div className="num">{OFFERS[2].num}</div>
              <div>
                <div className="tag">{OFFERS[2].tag}</div>
                <h4>{OFFERS[2].title}</h4>
                <div className="desc">
                  {OFFERS[2].desc}
                </div>
              </div>
              <a
                href={waLink(`${OFFERS[2].title} — أرغب بالحجز`)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                {c.offers.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="eid-section benefits" id="why">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="sec-eyebrow">{c.benefits.eyebrow}</span>
            <h2 className="sec-title">
              {c.benefits.title} <span className="gilt">{c.benefits.highlight}</span> {c.benefits.titleRest}
            </h2>
          </div>

          <div className="benefits-wrap">
            <div className="benefits-art reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/eid-offer/benefits-art.webp" alt="تجربة فاخرة" />
              <div className="benefits-art-overlay" />
              <div className="benefits-art-chip">
                <span className="dot" />
                {c.benefits.chip}
              </div>
            </div>

            <div className="ben-list">
              {BENEFITS.map((b) => (
                <div className="ben" key={b.title}>
                  <div className="ben-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={b.path} />
                    </svg>
                  </div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DOCTORS ===== */}
      <section className="eid-section doctors" id="doctors">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="sec-eyebrow">{c.doctors.eyebrow}</span>
            <h2 className="sec-title">
              {c.doctors.title} <span className="gilt">{c.doctors.highlight}</span> {c.doctors.titleRest}
            </h2>
            <p className="sec-sub">
              {c.doctors.sub}
            </p>
          </div>

          <div className="doc-grid">
            {DOCTORS.map((d) => (
              <article className="doc" key={d.name}>
                <div className="doc-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={d.name} loading="lazy" />
                  <span className="chip">{c.doctors.chip}</span>
                </div>
                <div className="doc-body">
                  <h4>{d.name}</h4>
                  <p>{d.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL ===== */}
      <section className="eid-section testi">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="sec-eyebrow">{c.testimonial.eyebrow}</span>
            <h2 className="sec-title">
              {c.testimonial.title} <span className="gilt">{c.testimonial.highlight}</span> {c.testimonial.titleRest}
            </h2>
          </div>

          <div className="testi-card reveal">
            <div className="testi-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/eid-offer/avatar-sara.webp" alt="سارة العتيبي" />
              <div className="testi-media-glow" />
              <div className="testi-media-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                {c.testimonial.badge}
              </div>
            </div>

            <div className="testi-body">
              <div className="testi-rating">
                <span className="stars">★★★★★</span>
                <span className="testi-rating-num">{c.testimonial.rating}</span>
                <span className="testi-rating-src">{c.testimonial.ratingSource}</span>
              </div>

              <p className="testi-quote">
                {c.testimonial.quote}
              </p>

              <div className="testi-meta">
                <div>
                  <div className="testi-name">{c.testimonial.name}</div>
                  <div className="testi-role">{c.testimonial.role}</div>
                </div>
                <div className="testi-stats">
                  <div className="ts-cell">
                    <div className="ts-num">{c.testimonial.stats[0].num}</div>
                    <div className="ts-lbl">{c.testimonial.stats[0].label}</div>
                  </div>
                  <div className="ts-cell">
                    <div className="ts-num">{c.testimonial.stats[1].num}</div>
                    <div className="ts-lbl">{c.testimonial.stats[1].label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="eid-section" style={{ padding: "40px 0" }} id="book">
        <div className="cta-band reveal">
          <span className="sec-eyebrow" style={{ background: "rgba(184,137,62,.18)", color: "#caa163" }}>
            {c.cta.eyebrow}
          </span>
          <h2 style={{ marginTop: 18 }}>
            {c.cta.line1} <br />
            {c.cta.line2} <span className="gilt">{c.cta.highlight}</span>
          </h2>
          <p>
            {c.cta.body}
          </p>
          <div className="cta-band-actions">
            <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <FontAwesomeIcon icon={faWhatsapp} />
              {c.cta.button}
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="eid-footer" id="contact">
        <div className="shell">
          <div className="foot-grid">
            <div className="foot-col">
              <a href="#home" className="logo">
                <Image src="/logo.webp" alt="عيادة مها دحلان" width={140} height={44} />
              </a>
              <p>
                {c.footer.about}
              </p>
              <div className="socials" style={{ marginTop: 18 }}>
                <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#" aria-label="TikTok"><FontAwesomeIcon icon={faTiktok} /></a>
                <a href="#" aria-label="Snapchat"><FontAwesomeIcon icon={faSnapchat} /></a>
                <a href="#" aria-label="X"><FontAwesomeIcon icon={faXTwitter} /></a>
              </div>
            </div>
            <div className="foot-col">
              <h5>{c.footer.servicesTitle}</h5>
              <ul>
                {SERVICES.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <a href={`#services`}>{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="foot-col">
              <h5>{c.footer.clinicTitle}</h5>
              <ul>
                <li><a href="#why">{c.footer.clinicLinks[0].label}</a></li>
                <li><a href="#doctors">{c.footer.clinicLinks[1].label}</a></li>
                <li><a href="#offers">{c.footer.clinicLinks[2].label}</a></li>
                <li><a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">{c.footer.clinicLinks[3].label}</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>{c.footer.contactTitle}</h5>
              <ul>
                <li><a href={`tel:+${WA_NUMBER}`}>{PHONE_DISPLAY}</a></li>
                <li><a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">{c.footer.whatsapp}</a></li>
                <li><span>{c.footer.days}</span></li>
                <li><span>{c.footer.hours}</span></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <div>{c.footer.copyright}</div>
            <div>{c.footer.greeting}</div>
          </div>
        </div>
      </footer>

      {/* mobile sticky WhatsApp CTA (custom, no form) */}
      <div className="eid-mobile-cta">
        <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faWhatsapp} />
          {c.mobileCta.label}
        </a>
      </div>

      <WhatsAppFAB whatsappNumber={WA_NUMBER} topicMessage={WA_TOPIC} />

      <style jsx>{`
        .eid-mobile-cta {
          position: fixed;
          inset-inline: 12px;
          bottom: calc(env(safe-area-inset-bottom) + 12px);
          z-index: 50;
          display: none;
        }
        .eid-mobile-cta a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 56px;
          border-radius: 18px;
          background: #25d366;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          box-shadow: 0 18px 36px -10px rgba(37, 211, 102, 0.55);
        }
        @media (max-width: 980px) {
          .eid-mobile-cta {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
