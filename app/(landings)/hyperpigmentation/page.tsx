import type { Metadata } from "next";
import Image from "next/image";
import BeforeAfter from "./_components/BeforeAfter";
import ContactForm from "./_components/ContactForm";
import HeroCanvas from "./_components/HeroCanvasLazy";
import Nav from "./_components/Nav";
import ScrollAnimations from "./_components/ScrollAnimations";
import { getPageContent } from "@/lib/pages/get";
import { HYPERPIGMENTATION } from "./content";

/** Before/after pairs + alt text for the results cards, in content order. */
const RESULT_IMAGES = [
  {
    before: "/hyperpigmentation/beforeafter/before1.webp",
    after: "/hyperpigmentation/beforeafter/after1.webp",
    beforeAlt: "قبل — لون غير متجانس",
    afterAlt: "بعد — لون موحّد ومُشرق",
  },
  {
    before: "/hyperpigmentation/beforeafter/before2.webp",
    after: "/hyperpigmentation/beforeafter/after2.webp",
    beforeAlt: "قبل — بقع شمسية",
    afterAlt: "بعد — بشرة صافية مشرقة",
  },
  {
    before: "/hyperpigmentation/beforeafter/before3.webp",
    after: "/hyperpigmentation/beforeafter/after3.webp",
    beforeAlt: "قبل — آثار حبوب",
    afterAlt: "بعد — ملمس ولون متجانس",
  },
] as const;

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(HYPERPIGMENTATION);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      siteName: "عيادات د. مها دحلان",
      images: [
        {
          url: "/hyperpigmentation/afterbeforehero.webp",
          width: 1200,
          height: 630,
          alt: "عيادات د. مها دحلان — علاج التصبّغات",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description:
        "برنامج علاج التصبّغات في عيادات د. مها دحلان — خطة شخصية ونتائج موثّقة.",
      images: ["/hyperpigmentation/afterbeforehero.webp"],
    },
  };
}

export default async function HyperpigmentationLanding() {
  const c = await getPageContent(HYPERPIGMENTATION);

  return (
    <>
      <ScrollAnimations />

      <Nav copy={c.nav} />

      {/* ════════════ HERO ════════════ */}
      <header className="hero">
        <HeroCanvas />

        <div className="hero-content">
          <div className="hero-eyebrow eyebrow">
            {c.hero.eyebrow}
          </div>
          <h1 className="h-display">
            {c.hero.titleLead} <em>{c.hero.titleEm}</em>
            <br />
            {c.hero.line2}
            <br />
            {c.hero.line3}
          </h1>
          <p className="lead">
            {c.hero.lead}
          </p>
          <div className="hero-actions">
            <a href="#cta" className="btn btn-gold">
              {c.hero.book}
              <span className="arrow" />
            </a>
            <a href="#process" className="btn btn-ghost">
              {c.hero.plan}
            </a>
          </div>
          <div className="hero-stats">
            {c.hero.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <span className="stat-num">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual parallax-soft">
          <div className="deco-circle c1" />
          <div className="ph-main">
            <Image
              src="/hyperpigmentation/afterbeforehero.webp"
              alt="نتائج علاج التصبّغات — قبل وبعد"
              fill
              priority
              sizes="(max-width: 980px) 90vw, 45vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="hero-badge">
            <div className="stars">★★★★★</div>
            <div className="hero-badge-text">
              <strong>{c.hero.ratingValue}</strong>
              <span>{c.hero.ratingLabel}</span>
            </div>
          </div>
          <div className="hero-badge-2">
            <span className="num">{c.hero.badgeValue}</span>
            <span className="lbl">{c.hero.badgeLabel}</span>
          </div>
        </div>
      </header>

      {/* ════════════ PROBLEM ════════════ */}
      <section className="problem" id="problem">
        <div className="problem-grid">
          <div className="problem-text">
            <div className="eyebrow reveal" style={{ marginBottom: 28 }}>
              {c.problem.eyebrow}
            </div>
            <h2 className="h-section reveal">
              {c.problem.titleLead} <em>{c.problem.titleEm}</em> {c.problem.titleRest}
            </h2>
            <p className="lead reveal">
              {c.problem.lead}
            </p>
            <ul className="problem-list">
              {c.problem.types.map((type) => (
                <li key={type.num}>
                  <span className="num">{type.num}</span>
                  <div>
                    <strong>{type.title}</strong>
                    <p>
                      {type.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="problem-visual parallax-soft">
            <div className="problem-photo">
              <Image
                src="/hyperpigmentation/zoomin.webp"
                alt="دراسة قرب لملمس البشرة وتدرّج اللون"
                fill
                sizes="(max-width: 900px) 90vw, 45vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="problem-photo small">
              <Image
                src="/hyperpigmentation/doc.webp"
                alt="تفصيل — قطّارة سيروم ذهبي"
                fill
                sizes="(max-width: 900px) 50vw, 22vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PROCESS ════════════ */}
      <section id="process">
        <div className="section-head">
          <div className="eyebrow reveal">{c.process.eyebrow}</div>
          <h2 className="h-section reveal">
            {c.process.titleLead} <em>{c.process.titleEm}</em> {c.process.titleRest}
          </h2>
          <p className="lead reveal">
            {c.process.lead}
          </p>
        </div>
        <div className="process-grid">
          {c.process.steps.map((step) => (
            <div className="process-card" key={step.num}>
              <div className="process-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
      </div>

      {/* ════════════ RESULTS ════════════ */}
      <section className="results" id="results">
        <div className="section-head">
          <div className="eyebrow reveal">{c.results.eyebrow}</div>
          <h2 className="h-section reveal">
            {c.results.titleLead} <em>{c.results.titleEm}</em> {c.results.titleRest}
          </h2>
          <p className="lead reveal">
            {c.results.lead}
          </p>
        </div>
        <div className="results-grid">
          {c.results.cards.map((card, i) => (
            <div className="result-card" key={card.title}>
              <BeforeAfter
                beforeSrc={RESULT_IMAGES[i].before}
                afterSrc={RESULT_IMAGES[i].after}
                beforeAlt={RESULT_IMAGES[i].beforeAlt}
                afterAlt={RESULT_IMAGES[i].afterAlt}
              />
              <div className="result-meta">
                <strong>{card.title}</strong>
                <span>{card.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ SPECIALIST ════════════ */}
      <section id="specialist">
        <div className="specialist-grid">
          <div className="specialist-visual parallax-soft">
            <div className="specialist-photo">
              <Image
                src="/hyperpigmentation/doc.webp"
                alt="د. مها دهلان"
                fill
                sizes="(max-width: 900px) 90vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="specialist-text">
            <div className="eyebrow reveal">{c.specialist.eyebrow}</div>
            <h2 className="spec-name reveal">
              {c.specialist.nameLead} <em>{c.specialist.nameEm}</em> {c.specialist.nameRest}
            </h2>
            <p className="spec-role reveal">{c.specialist.role}</p>
            <p className="spec-bio reveal">
              {c.specialist.bio}
            </p>
            <div className="spec-creds">
              {c.specialist.creds.map((cred) => (
                <div className="spec-cred" key={cred.label}>
                  <strong>{cred.value}</strong>
                  <span>{cred.label}</span>
                </div>
              ))}
            </div>
            <div className="spec-sig reveal">{c.specialist.signature}</div>
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section className="testimonials">
        <div className="section-head">
          <div className="eyebrow reveal">{c.testimonials.eyebrow}</div>
          <h2 className="h-section reveal">
            {c.testimonials.titleLead} <em>{c.testimonials.titleEm}</em>{" "}
            {c.testimonials.titleRest}
          </h2>
        </div>
        <div className="testi-grid">
          {c.testimonials.cards.map((card) => (
            <div className="testi-card" key={card.name}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">
                {card.body}
              </p>
              <div className="testi-meta">
                <div className="testi-avatar" />
                <div>
                  <strong>{card.name}</strong>
                  <span>{card.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section id="faq">
        <div className="section-head">
          <div className="eyebrow reveal">{c.faq.eyebrow}</div>
          <h2 className="h-section reveal">
            {c.faq.titleLead} <em>{c.faq.titleEm}</em>
          </h2>
          <p className="lead reveal">{c.faq.lead}</p>
        </div>
        <div className="faq-wrap">
          {c.faq.questions.map((item, i) => (
            <details className="faq-item" key={item.q} open={i === 0}>
              <summary className="faq-q">
                {item.q}
                <span className="faq-icon" />
              </summary>
              <div className="faq-a">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ════════════ CTA + FORM ════════════ */}
      <section className="cta" id="cta">
        <div className="cta-grid">
          <div>
            <div className="eyebrow reveal">{c.booking.eyebrow}</div>
            <h2 className="h-section reveal">
              {c.booking.titleLead} <em>{c.booking.titleEm}</em>
              {c.booking.titleEnd}
            </h2>
            <p className="cta-lead reveal">
              {c.booking.lead}
            </p>
            <div className="cta-contact">
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span>
                  {c.booking.address}
                </span>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </span>
                <a href="mailto:info@mahadahlan.com">info@mahadahlan.com</a>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a href="tel:+966920007515" dir="ltr">
                  +966 920007515
                </a>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.78 11.78 0 0 0 12.06 0C5.5 0 .17 5.33.17 11.89a11.83 11.83 0 0 0 1.59 5.94L0 24l6.34-1.66a11.88 11.88 0 0 0 5.72 1.46h.01c6.55 0 11.89-5.33 11.89-11.89a11.82 11.82 0 0 0-3.44-8.43Zm-8.46 18.27h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.23-.38a9.85 9.85 0 0 1-1.51-5.22c0-5.45 4.44-9.89 9.9-9.89 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.45-4.44 9.85-9.9 9.85Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37 3.36 3.36 0 0 0-1.04 2.49c0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                </span>
                <a
                  href="https://wa.me/966503377702"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                >
                  +966 503377702
                  <span className="wa-tag">{c.booking.whatsappTag}</span>
                </a>
              </div>
            </div>
          </div>

          <ContactForm copy={c.booking} />
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer>
        <div>{c.footer.copyright}</div>
        <div>
          {c.footer.links.map((link) => (
            <a href="#" key={link}>
              {link}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
