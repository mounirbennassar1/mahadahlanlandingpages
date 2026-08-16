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

const WA_NUMBER = "966503377702";
const WA_TOPIC = "عرض عيد الأضحى — أرغب بحجز موعد";
const waLink = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA_DEFAULT = waLink(WA_TOPIC);

// 5 days from today
const EID_OFFSET_MS = 5 * 24 * 60 * 60 * 1000;

const SERVICES = [
  {
    slug: "hydrafacial",
    title: "هيدرافيشل",
    desc: "تنظيف عميق وترطيب فوري للبشرة بتقنية الهيدرافيشل لإطلالة مشرقة ليوم العيد.",
    badge: "خصم ٣٥٪",
  },
  {
    slug: "hair",
    title: "علاجات الشعر",
    desc: "البلازما الغنية والميزوثيرابي لإيقاف التساقط وتحفيز نمو شعر صحي وكثيف.",
    badge: "خصم ٣٥٪",
    image: "/eid-offer/hairv1.webp",
  },
  {
    slug: "botox",
    title: "البوتوكس",
    desc: "بوتوكس الوجه على يد استشاريين معتمدين، نتائج طبيعية تُخفي علامات التعب فوراً.",
    badge: "خصم ٢٩٪",
    image: "/eid-offer/botoxv1.webp",
  },
  {
    slug: "filler",
    title: "الفيلر",
    desc: "فيلر الشفاه والوجه لإبراز ملامحك بتناسق طبيعي ولمسة فاخرة في يوم العيد.",
    badge: "خصم ٣٠٪",
  },
  {
    slug: "dark-circles",
    title: "علاج الهالات السوداء",
    desc: "بروتوكول متقدم بالميزوثيرابي والبلازما لتفتيح منطقة تحت العين وإشراقتها.",
    badge: "خصم ٣٥٪",
    image: "/eid-offer/dark-circlev1.webp",
  },
  {
    slug: "hyperpigmentation",
    title: "علاج التصبغات",
    desc: "جلسات الليزر والتقشير المتدرج لتوحيد لون البشرة والتخلص من الكلف والبقع.",
    badge: "خصم ٣٥٪",
    image: "/eid-offer/hyperpigmentation.v1.webp",
  },
  {
    slug: "microneedling-rf",
    title: "ميكرونيدلينغ RF",
    desc: "تجديد البشرة بترددات راديوية وإبر دقيقة لشد المسام وتحفيز الكولاجين بأمان.",
    badge: "خصم ٣٠٪",
    image: "/eid-offer/microneedling-rfv1.webp",
  },
  {
    slug: "stretchmarks",
    title: "علامات التمدد",
    desc: "تقنيات الليزر والميزوثيرابي لتقليل علامات التمدد وتنعيم البشرة بشكل ملحوظ.",
    badge: "خصم ٣٥٪",
  },
];

const DOCTORS = [
  {
    name: "د. مها دحلان",
    title: "استشارية الجلدية والتجميل والليزر",
    img: "/team/dr-maha.avif",
  },
  {
    name: "د. إيناس عبدالعزيز",
    title: "طبيب مقيم الأمراض الجلدية",
    img: "/team/dr-inas.avif",
  },
  {
    name: "د. لجين الجرماني",
    title: "نائب الجلدية والتجميل والليزر",
    img: "/team/dr-lajin.avif",
  },
];

const BENEFITS = [
  {
    title: "أطباء استشاريون",
    desc: "نخبة من الأطباء المعتمدين عالمياً مع خبرة تتجاوز ١٥ عاماً في مجال التجميل.",
    path: "M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7zM9 12l2 2 4-4",
  },
  {
    title: "أحدث التقنيات",
    desc: "أجهزة طبية أمريكية وألمانية معتمدة بأعلى معايير السلامة الطبية والجودة.",
    path: "M3 4h18v16H3zM3 10h18M8 14h2M8 18h2",
  },
  {
    title: "مواعيد مرنة",
    desc: "العيادة مفتوحة طوال أيام العيد مع حجز سريع عبر الواتساب على مدار الساعة.",
    path: "M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z",
  },
  {
    title: "متابعة مستمرة",
    desc: "متابعة دقيقة لحالتك بعد كل جلسة لضمان أفضل النتائج بأمان كامل.",
    path: "M20 12V8H4v12h12M16 16l3 3 5-5",
  },
];

const arabicDigits = (n: number) =>
  String(n).padStart(2, "0").replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EidOfferPage() {
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
            <a href="#home">الرئيسية</a>
            <a href="#services">خدماتنا</a>
            <a href="#offers">باقات العيد</a>
            <a href="#doctors">أطباؤنا</a>
            <a href="#why">لماذا نحن</a>
          </div>
          <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="nav-cta">
            <FontAwesomeIcon icon={faWhatsapp} />
            احجز موعدك
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="hero" id="home">
        <div className="shell">
          <div className="hero-text">
            <span className="ribbon eyebrow">
              <span className="dot" />
              عرض حصري — عيد الأضحى المبارك
            </span>
            <h1 className="hero-title">
              فرحة العيد <br />
              تبدأ بإطلالة <span className="gilt">ذهبية</span>
            </h1>
            <p className="hero-sub">
              احتفلوا معنا بقدوم عيد الأضحى المبارك، واستمتعوا بخصومات تصل إلى
              ٤٠٪ على جميع خدماتنا التجميلية والطبية في عيادة مها دحلان.
            </p>
            <div className="hero-cta">
              <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="btn-wa">
                <FontAwesomeIcon icon={faWhatsapp} />
                احجز عبر واتساب
              </a>
              <a href="#offers" className="btn-ghost">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                اكتشف العروض
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
                <div className="label">العناية بالبشرة</div>
                <div className="val">خصم <span className="pct">٣٥٪</span></div>
              </div>
            </div>
            <div className="float-card fc2">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <div>
                <div className="label">ضمان الجودة</div>
                <div className="val">معتمد طبياً</div>
              </div>
            </div>
            <div className="float-card fc3">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <div className="label">البوتوكس والفيلر</div>
                <div className="val">خصم <span className="pct">٣٠٪</span></div>
              </div>
            </div>
            <div className="float-card fc4">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <div className="label">العرض ساري حتى</div>
                <div className="val">يوم العيد</div>
              </div>
            </div>
          </div>
        </div>

        <div className="count-strip reveal" id="countdown">
          <div className="ttl">
            <small>العرض ينتهي قريباً</small>
            احجز قبل انتهاء عيد الأضحى
          </div>
          <div className="count-cell"><div className="num">{cd.d}</div><div className="unit">يوم</div></div>
          <div className="count-cell"><div className="num">{cd.h}</div><div className="unit">ساعة</div></div>
          <div className="count-cell"><div className="num">{cd.m}</div><div className="unit">دقيقة</div></div>
          <div className="count-cell"><div className="num">{cd.s}</div><div className="unit">ثانية</div></div>
        </div>
      </header>

      {/* ===== SERVICES ===== */}
      <section className="eid-section services" id="services">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="sec-eyebrow">خدماتنا المتميزة</span>
            <h2 className="sec-title">
              خدمات <span className="gilt">شاملة</span> لجمالك في يوم العيد
            </h2>
            <p className="sec-sub">
              ٨ خدمات أساسية بأسعار العيد، احجز الآن عبر واتساب واستفد من خصومات
              مضاعفة على باقاتك المفضلة.
            </p>
          </div>

          <div className="svc-grid">
            {SERVICES.map((s) => (
              <article className="svc" key={s.slug}>
                <div className="svc-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image ?? `/eid-offer/${s.slug}.webp`} alt={s.title} loading="lazy" />
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
                    احجز عبر واتساب
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
            <span className="sec-eyebrow">باقات العيد</span>
            <h2 className="sec-title">
              باقات <span className="gilt">العيد</span> الذهبية
            </h2>
            <p className="sec-sub">
              اختاري الباقة التي تناسبك واحصلي على خصومات مضاعفة عند الحجز قبل
              انتهاء العرض.
            </p>
          </div>

          <div className="offer-grid">
            <div className="offer-card o1">
              <div className="deco" />
              <div className="num">٠١</div>
              <div>
                <div className="tag">— الباقة الأكثر طلباً</div>
                <h4>باقة الإطلالة الذهبية</h4>
                <div className="desc">
                  هيدرافيشل + بلازما ذهبية + ميزوثيرابي للوجه بسعر استثنائي للعيد.
                </div>
              </div>
              <a
                href={waLink("باقة الإطلالة الذهبية — أرغب بالحجز")}
                target="_blank"
                rel="noopener noreferrer"
                className="cta"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                احجز عبر واتساب
              </a>
            </div>

            <div className="offer-card o2">
              <div className="deco" />
              <div className="num">٠٢</div>
              <div>
                <div className="tag">— عرض جديد</div>
                <h4>باقة العروس</h4>
                <div className="desc">
                  ٦ جلسات ليزر + هيدرافيشل + علاج تصبغات بسعر مميز لعيدك.
                </div>
              </div>
              <a
                href={waLink("باقة العروس — أرغب بالحجز")}
                target="_blank"
                rel="noopener noreferrer"
                className="cta"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                احجز عبر واتساب
              </a>
            </div>

            <div className="offer-card o3">
              <div
                className="deco"
                style={{ background: "radial-gradient(circle,rgba(202,161,99,.4),transparent 70%)" }}
              />
              <div className="num">٠٣</div>
              <div>
                <div className="tag">— الأكثر توفيراً</div>
                <h4>باقة العائلة</h4>
                <div className="desc">
                  جلسات تجميلية مشتركة للأم والابنة بخصم خاص يصل إلى ٥٠٪.
                </div>
              </div>
              <a
                href={waLink("باقة العائلة — أرغب بالحجز")}
                target="_blank"
                rel="noopener noreferrer"
                className="cta"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                احجز عبر واتساب
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="eid-section benefits" id="why">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="sec-eyebrow">لماذا تختاروننا</span>
            <h2 className="sec-title">
              تجربة <span className="gilt">استثنائية</span> تستحقها
            </h2>
          </div>

          <div className="benefits-wrap">
            <div className="benefits-art reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/eid-offer/benefits-art.webp" alt="تجربة فاخرة" />
              <div className="benefits-art-overlay" />
              <div className="benefits-art-chip">
                <span className="dot" />
                تجربة ذهبية
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
            <span className="sec-eyebrow">نخبة أطبائنا</span>
            <h2 className="sec-title">
              فريق <span className="gilt">طبي استشاري</span> برعاية احترافية
            </h2>
            <p className="sec-sub">
              أيدي خبراء معتمدين عالمياً تجمع بين الخبرة والذوق الرفيع لتقديم
              تجربة تجميلية فاخرة بمناسبة عيد الأضحى المبارك.
            </p>
          </div>

          <div className="doc-grid">
            {DOCTORS.map((d) => (
              <article className="doc" key={d.name}>
                <div className="doc-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={d.name} loading="lazy" />
                  <span className="chip">استشاري</span>
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
            <span className="sec-eyebrow">شهادات عميلاتنا</span>
            <h2 className="sec-title">
              قصص <span className="gilt">نجاح</span> تروّيها التجارب
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
                عميلة موثّقة
              </div>
            </div>

            <div className="testi-body">
              <div className="testi-rating">
                <span className="stars">★★★★★</span>
                <span className="testi-rating-num">٥٫٠</span>
                <span className="testi-rating-src">— تقييم Google</span>
              </div>

              <p className="testi-quote">
                «تجربتي مع عيادة مها دحلان كانت رائعة بكل المعاني. الطاقم محترف،
                والنتائج فاقت توقعاتي. عرض العيد كان فرصة ذهبية حقيقية!»
              </p>

              <div className="testi-meta">
                <div>
                  <div className="testi-name">سارة العتيبي</div>
                  <div className="testi-role">عميلة منذ ٢٠٢٣ — جدة</div>
                </div>
                <div className="testi-stats">
                  <div className="ts-cell">
                    <div className="ts-num">٤</div>
                    <div className="ts-lbl">جلسات</div>
                  </div>
                  <div className="ts-cell">
                    <div className="ts-num">١٠٠٪</div>
                    <div className="ts-lbl">رضا</div>
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
            — احجز الآن
          </span>
          <h2 style={{ marginTop: 18 }}>
            لا تفوّتوا فرصة العمر <br />
            مع <span className="gilt">عرض العيد</span>
          </h2>
          <p>
            احجز موعدك الآن عبر واتساب واستمتع بخصومات تصل إلى ٤٠٪ على جميع
            باقات العيد، إضافةً إلى استشارة مجانية مع أحد أطبائنا الاستشاريين.
          </p>
          <div className="cta-band-actions">
            <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <FontAwesomeIcon icon={faWhatsapp} />
              احجز موعدك الآن
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
                عيادة متخصصة في الطب التجميلي والعناية بالبشرة، نجمع بين الخبرة
                الطبية والذوق الرفيع لنقدم لك أفضل النتائج.
              </p>
              <div className="socials" style={{ marginTop: 18 }}>
                <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#" aria-label="TikTok"><FontAwesomeIcon icon={faTiktok} /></a>
                <a href="#" aria-label="Snapchat"><FontAwesomeIcon icon={faSnapchat} /></a>
                <a href="#" aria-label="X"><FontAwesomeIcon icon={faXTwitter} /></a>
              </div>
            </div>
            <div className="foot-col">
              <h5>الخدمات</h5>
              <ul>
                {SERVICES.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <a href={`#services`}>{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="foot-col">
              <h5>العيادة</h5>
              <ul>
                <li><a href="#why">لماذا نحن</a></li>
                <li><a href="#doctors">فريق العمل</a></li>
                <li><a href="#offers">باقات العيد</a></li>
                <li><a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">احجز الآن</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>تواصل معنا</h5>
              <ul>
                <li><a href={`tel:+${WA_NUMBER}`}>+966 50 337 7702</a></li>
                <li><a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">واتساب مباشر</a></li>
                <li><span>السبت — الخميس</span></li>
                <li><span>٩ ص — ١٠ م</span></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <div>© ٢٠٢٦ عيادة مها دحلان. جميع الحقوق محفوظة.</div>
            <div>كل عام وأنتم بخير — عيد أضحى مبارك ✦</div>
          </div>
        </div>
      </footer>

      {/* mobile sticky WhatsApp CTA (custom, no form) */}
      <div className="eid-mobile-cta">
        <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faWhatsapp} />
          احجز عبر واتساب — عرض العيد
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
