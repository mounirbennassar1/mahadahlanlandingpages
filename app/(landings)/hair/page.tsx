"use client";

import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import LeadForm from "./_components/LeadForm";

/* ─────────────────── animation variants ─────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const SOCIAL_LINKS = [
  {
    name: "انستغرام",
    url: "https://www.instagram.com/md_clinics_?igsh=MXNjbGt5bXEzNjgwcg==",
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  },
  {
    name: "سناب شات",
    url: "https://snapchat.com/t/RI87LsZs",
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.12 21.05c-.32 0-3.37-.21-4.71-1.07-.46-.3-1.09-.7-1.39-1.28-.42-.8 1.44-1.12 2.8-1.4 1.25-.26 1.34-.69 1.13-1.41-.33-1.1-1.41-1.42-2.31-1.68-.82-.25-1.74-.53-2.17-1.16-.36-.53-.42-1.24-.13-1.92.27-.63.92-1.03 1.83-1.11.45-.04 1.1-.03 1.88.04 1-.5 1.54-1.29 1.94-2.02.58-1 .92-2.17 1.18-3.41.2-.95.45-2.09.84-2.61.53-.7 1.27-1.02 2.22-1.02h.16c.94 0 1.68.32 2.21 1.02.39.52.63 1.66.83 2.61.26 1.24.6 2.41 1.18 3.41.4.73.94 1.52 1.94 2.02.78-.07 1.43-.08 1.88-.04.91.08 1.56.48 1.83 1.11.29.68.23 1.39-.13 1.92-.43.63-1.35.91-2.17 1.16-.9.26-1.98.58-2.31 1.68-.21.72-.12 1.15 1.13 1.41 1.36.28 3.22.61 2.8 1.4-.3.58-.93.98-1.39 1.28-1.34.86-4.39 1.07-4.72 1.07z" /></svg>
  },
  {
    name: "تيك توك",
    url: "https://www.tiktok.com/@md.clinics?_t=ZS-8wlSeJliaLx&_r=1",
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
  },
  {
    name: "إكس",
    url: "https://x.com/md_clinics_?s=21&t=FpQH2SlyziT0Q1AQPVRqfQ",
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
  },
];

const BOOKING_ANCHOR = "#booking-form";

function FloatingOrb({ size, color, x, y, duration, delay = 0 }: { size: number; color: string; x: string; y: string; duration: number; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none will-change-transform"
      style={{ width: size, height: size, background: color, left: x, top: y, transform: "translateZ(0)" }}
      animate={{ scale: [1, 1.2, 1], x: ["0%", "10%", "-5%", "0%"], y: ["0%", "-8%", "5%", "0%"] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <FloatingOrb size={500} color="rgba(201,168,76,0.15)" x="60%" y="-5%" duration={12} />
      <FloatingOrb size={400} color="rgba(26,58,42,0.25)" x="-5%" y="20%" duration={15} delay={2} />
      <FloatingOrb size={350} color="rgba(201,168,76,0.1)" x="40%" y="60%" duration={10} delay={4} />
      <FloatingOrb size={250} color="rgba(232,201,109,0.12)" x="80%" y="70%" duration={13} delay={1} />

      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hair-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hair-grid)" />
      </svg>

      <motion.div
        className="absolute top-0 left-1/2 w-[2px] h-full origin-top"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)" }}
        animate={{ rotate: [0, 15, -10, 5, 0], x: ["-50%", "0%", "-100%", "-30%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div variants={fadeUp} className="text-center px-6 py-4">
      <div className="text-4xl font-bold text-[#c9a84c] mb-1">{number}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </motion.div>
  );
}

const galleryPairs = [
  { before: "/hair/gallery/before/1before.avif", after: "/hair/gallery/after/1after.avif" },
  { before: "/hair/gallery/before/2before.avif", after: "/hair/gallery/after/2after.avif" },
  { before: "/hair/gallery/before/3before.avif", after: "/hair/gallery/after/3after.avif" },
  { before: "/hair/gallery/before/4before.avif", after: "/hair/gallery/after/4after.avif" },
];

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none shadow-2xl border border-white/10 group"
      onMouseMove={(e) => updatePosition(e.clientX)}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="بعد العلاج" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[#c9a84c] px-4 py-1.5 rounded-full text-sm font-bold z-10 border border-[#c9a84c]/20">بعد</div>

      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="قبل العلاج" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold z-10 border border-white/20">قبل</div>
      </div>

      <div className="absolute top-0 bottom-0 w-[2px] bg-white/90 shadow-[0_0_15px_rgba(0,0,0,0.8)] z-20 pointer-events-none" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 bg-[#1a3a2a] rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20 text-[#c9a84c] group-hover:scale-110 group-hover:bg-[#c9a84c] group-hover:text-[#1a3a2a] group-hover:border-transparent transition-all duration-300">
          <span className="material-symbols-outlined text-xl">compare_arrows</span>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: { name: string; text: string; rating: number; date: string } }) {
  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" className="shrink-0 opacity-50">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#1a3a2a]/5 hover:shadow-lg transition-shadow flex flex-col">
      <div className="flex gap-1 text-[#c9a84c] mb-3">
        {[...Array(review.rating)].map((_, i) => (
          <span key={i} className="material-symbols-outlined fill-1 text-sm">star</span>
        ))}
        {[...Array(5 - review.rating)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-sm text-slate-200">star</span>
        ))}
      </div>
      <p className="text-slate-600 mb-4 leading-relaxed text-sm flex-1">&ldquo;{review.text}&rdquo;</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-gradient-to-br from-[#c9a84c]/30 to-[#1a3a2a]/20 flex items-center justify-center text-[#1a3a2a] font-bold text-sm shrink-0">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm text-[#1a3a2a] leading-none mb-0.5">{review.name}</p>
            <span className="text-xs text-slate-400">{review.date}</span>
          </div>
        </div>
        <GoogleIcon />
      </div>
    </div>
  );
}

export default function HairLanding() {
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, isMobile ? 1 : 0]);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#1a3a2a]">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full border-b border-[#1a3a2a]/10 bg-[#f9f7f2]/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hair/logo.avif" alt="مها دهلان" className="h-26 w-auto object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="text-slate-500 hover:text-[#c9a84c] transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {social.svg}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.a
              href={BOOKING_ANCHOR}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:block bg-[#c9a84c] hover:bg-[#c9a84c]/90 text-[#1a3a2a] font-bold px-6 py-2.5 rounded-full transition-all text-sm shadow-lg shadow-[#c9a84c]/20"
            >
              احجز استشارتك
            </motion.a>
            <button className="md:hidden text-[#1a3a2a]" onClick={() => setMenuOpen((p) => !p)} aria-label="Toggle menu">
              <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-[#f9f7f2] border-t border-[#1a3a2a]/10"
            >
              <div className="flex flex-col px-6 py-6 gap-6">
                <div className="flex items-center justify-center gap-8 py-2">
                  {SOCIAL_LINKS.map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-[#1a3a2a] hover:text-[#c9a84c] transition-colors">
                      {social.svg}
                    </a>
                  ))}
                </div>
                <a href={BOOKING_ANCHOR} onClick={() => setMenuOpen(false)} className="bg-[#c9a84c] text-[#1a3a2a] font-bold px-6 py-3 rounded-full text-sm mt-2 text-center">
                  احجز استشارتك
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
        {/* ── Hero Section ── */}
        <section ref={heroRef} className="relative overflow-hidden min-h-[85vh] flex items-center scroll-mt-20">
          <AnimatedGrid />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity, transform: "translateZ(0)" }}
            className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 w-full grid lg:grid-cols-2 gap-12 items-center will-change-transform"
          >
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium">
                <span className="material-symbols-outlined text-base">verified</span>
                أحدث تقنيات علاج تساقط الشعر في جدة
              </motion.div>

              <motion.h2 variants={fadeUp} custom={0.05} className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.3] text-[#1a3a2a]">
                تساقط الشعر له{" "}
                <span className="relative inline-block">
                  <span className="text-[#c9a84c]">حل</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-[3px] bg-[#c9a84c]/40 rounded-full"
                    initial={{ scaleX: 0, originX: 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                ،<br /> والعلاج يبدأ من هنا
              </motion.h2>

              <motion.div variants={fadeUp} custom={0.1} className="text-base text-slate-600 max-w-xl leading-relaxed space-y-4">
                <p className="font-bold text-[#1a3a2a]">أكثر نوعين شيوعًا لتساقط الشعر:</p>

                <div className="bg-white/60 border border-white/50 p-4 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-[#1a3a2a] mb-1 flex items-center gap-2">
                    <span className="text-[#c9a84c]">🔹</span> التساقط التفاعلي
                  </h4>
                  <p className="text-sm">يحدث بسبب اضطراب مؤقت في دورة نمو الشعر، حيث تدخل نسبة كبيرة من الشعر في مرحلة الراحة فتبدأ بالتساقط.</p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold text-[#1a3a2a]">من أسبابه:</span> نقص الحديد، العدوى الفيروسية، العمليات الجراحية، التوتر والتغيرات الهرمونية. <br />
                    <span className="font-semibold text-[#c9a84c]">قابل للعلاج عند معالجة السبب.</span>
                  </p>
                </div>

                <div className="bg-white/60 border border-white/50 p-4 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-[#1a3a2a] mb-1 flex items-center gap-2">
                    <span className="text-[#c9a84c]">🔹</span> التساقط الوراثي (Androgenetic Alopecia)
                  </h4>
                  <p className="text-sm">يحدث تحت تأثير الهرمونات، مما يؤدي إلى تقلّص بصيلات الشعر تدريجيًا وضعف سماكة الشعرة مع الوقت. <br />
                    <span className="font-semibold text-[#c9a84c]">يحتاج إلى خطة علاجية مستمرة للحفاظ على البصيلات وتحفيزها.</span>
                  </p>
                </div>

                <p className="text-sm font-semibold text-[#1a3a2a] bg-[#c9a84c]/10 px-4 py-3 rounded-xl border border-[#c9a84c]/20">
                  التشخيص الدقيق هو الخطوة الأهم قبل بدء أي علاج. احجزي تقييمك الآن وحددي نوع التساقط بدقة.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} custom={0.15} className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
                <motion.a href={BOOKING_ANCHOR} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto bg-[#1a3a2a] text-[#c9a84c] px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#1a3a2a]/20 border border-[#c9a84c]/30 flex items-center justify-center gap-3 text-center">
                  <span className="material-symbols-outlined">event_available</span>
                  احجزي موعدك الآن
                </motion.a>
                <motion.a href="tel:+966920007515" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto border border-[#1a3a2a]/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1a3a2a]/5 transition-colors flex items-center justify-center gap-3 text-center" dir="ltr">
                  <span className="material-symbols-outlined">call</span>
                  920007515
                </motion.a>
              </motion.div>

              <motion.div variants={fadeIn} custom={0.3} className="flex flex-wrap gap-0 divide-x divide-x-reverse divide-[#1a3a2a]/10 pt-4 border-t border-[#1a3a2a]/10">
                {[
                  { number: "+5000", label: "حالة ناجحة" },
                  { number: "+15", label: "سنة خبرة" },
                  { number: "98%", label: "رضا العملاء" },
                ].map((s) => (
                  <StatCard key={s.label} {...s} />
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20px] rounded-[3rem] border border-dashed border-[#c9a84c]/20" />

              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-[#1a3a2a]/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="طبيب متخصص يفحص نمو الشعر"
                  className="w-full aspect-[4/5] object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkh9QMsRrWJpEnqUqi6k8Nph69GDJy3-BTjU_fNap-GUS0rqK7n4NxcEWaO5oA7I-c4uq5zQ6bEQBhRsnW2Kxqo7AQbmqHmQJ1Snxr2xGk1YFsH6-PzRW44pSy6jmYtWMuAVYqeGVkZ-ikrHKoKeN-m_b-20YZJD_zO8ENS6uH4tCTkVN68XcfIg13zTTCEJnFEglE9xng7piUhtLfQOJCyWW6WpBmaBNAHBpetjQpKUkJ8NPZq9OFE4LNfsSayBOWE2DRvjSD3emC"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a2a]/30 via-transparent to-transparent" />
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5, type: "spring", bounce: 0.4 }} className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-[#1a3a2a]/5 flex items-center gap-3">
                <div className="size-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#c9a84c] text-2xl">verified_user</span>
                </div>
                <div>
                  <div className="font-bold text-[#1a3a2a] text-sm">استشارة مجانية</div>
                  <div className="text-xs text-slate-400">مع خبير متخصص</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Features Section ── */}
        <section className="bg-[#1a3a2a] py-16 md:py-24 text-white overflow-hidden relative">
          <motion.div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 70% 50%, #c9a84c 0%, transparent 70%)" }} animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16">
              <motion.h3 variants={fadeUp} className="text-[#c9a84c] font-bold mb-4 tracking-widest uppercase text-sm">
                لماذا عيادات د. مها دحلان؟
              </motion.h3>
              <motion.p variants={fadeUp} custom={0.05} className="text-2xl md:text-3xl lg:text-4xl font-bold">
                معايير ملكية في الرعاية الصحية
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
              {[
                { icon: "biotech", title: "تقنيات متقدمة لتحفيز نمو الشعر", desc: "نوفر مجموعة من أحدث العلاجات الطبية التي تساعد على تنشيط البصيلات الضعيفة وتحفيز نمو الشعر بشكل طبيعي." },
                { icon: "medication", title: "حلول طبية متنوعة تناسب كل حالة", desc: "نختار العلاج المناسب بناءً على تقييم حالة الشعر ونوع التساقط لضمان أفضل النتائج الممكنة." },
                { icon: "assignment_ind", title: "برامج علاجية مصممة لك", desc: "كل حالة تساقط شعر تختلف عن الأخرى، لذلك يتم تحديد خطة علاجية مخصصة لتحسين كثافة الشعر وصحة فروة الرأس." },
              ].map((card) => (
                <motion.div key={card.title} variants={fadeUp} whileHover={{ y: -8, borderColor: "rgba(201,168,76,0.5)" }} className="p-8 rounded-2xl bg-white/5 border border-white/10 transition-colors group cursor-default">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="size-14 bg-[#c9a84c]/20 rounded-xl flex items-center justify-center text-[#c9a84c] mb-6">
                    <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                  </motion.div>
                  <h4 className="text-xl font-bold mb-4">{card.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Before & After Gallery ── */}
        <section id="gallery" className="py-24 bg-[#1a3a2a] relative overflow-hidden border-t border-white/5">
          <motion.div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 30% 80%, #c9a84c 0%, transparent 60%)" }} animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16">
              <motion.h3 variants={fadeUp} className="text-[#c9a84c] font-bold mb-4 uppercase text-sm tracking-widest">مكتبة النتائج</motion.h3>
              <motion.p variants={fadeUp} custom={0.05} className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">تحوّلات حقيقية تعيد الثقة</motion.p>
              <motion.div variants={fadeUp} custom={0.1} className="w-20 h-1 bg-[#c9a84c]/30 mx-auto rounded-full" />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {galleryPairs.map((pair, index) => (
                <motion.div key={index} variants={fadeUp} custom={index * 0.1}>
                  <BeforeAfterSlider before={pair.before} after={pair.after} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Medical Team Section ── */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f9f7f2]/50 -z-10 skew-x-12 translate-x-1/2" />

          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-16">
              <motion.h3 variants={fadeUp} className="text-[#c9a84c] font-bold mb-4 uppercase text-sm tracking-widest">أطباؤنا</motion.h3>
              <motion.p variants={fadeUp} custom={0.05} className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a3a2a] mb-6 leading-relaxed">نخبة من أطباء الجلدية والتجميل والليزر في جدة</motion.p>
              <motion.p variants={fadeUp} custom={0.1} className="text-slate-600">علاج متقدم لتساقط الشعر بجميع أنواعه في MD Clinics، بإشراف أطباء جلدية متخصصين وتقنيات حديثة تساعد على تحفيز نمو الشعر واستعادة كثافته بطريقة آمنة وفعالة.</motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { name: "د. مها دحلان", title: "استشارية الجلدية والتجميل والليزر", img: "/hair/team/dr-maha.avif", quals: ["البورد السعودي في طب الأمراض الجلدية والتجميل والليزر", "البورد العربي في طب الأمراض الجلدية والتناسلية", "ماجستير صحة عامة من جامعة بوسطن", "زمالة البرنامج العالمي من جامعة هارفارد للأمراض الجلدية"] },
                { name: "د. إيناس عبدالعزيز", title: "طبيب مقيم الأمراض الجلدية", img: "/hair/team/dr-inas.avif", quals: ["بكالوريوس طب وجراحة عامة - تخصص الجلدية", "الدبلوم الأمريكي للجلدية والتجميل والليزر"] },
                { name: "د. لجين الجرماني", title: "نائب الجلدية والتجميل والليزر", img: "/hair/team/dr-lajin.avif", quals: ["البورد السوري في طب الأمراض الجلدية", "الدبلوم الأمريكي للجلدية والتجميل والليزر"] },
                { name: "د. دينا محمد البشير", title: "نائب أول جلدية وتجميل وليزر", img: "/hair/team/dr-dina.avif", quals: ["البورد الأمريكي للتجميل والليزر", "الزمالة المصرية للأمراض الجلدية", "دبلوما ليزر المركز القومي للبحوث", "الدبلوما الأمريكية للتجميل النسائي"] },
              ].map((doc, idx) => (
                <motion.div key={doc.name} variants={fadeUp} custom={idx * 0.1} className="group relative bg-[#f9f7f2] rounded-3xl overflow-hidden flex flex-col h-full border border-[#1a3a2a]/5 hover:shadow-2xl hover:shadow-[#c9a84c]/10 transition-all duration-300">
                  <div className="aspect-[4/5] relative overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f9f7f2] via-[#f9f7f2]/20 to-transparent" />
                  </div>

                  <div className="p-6 relative z-10 flex-1 flex flex-col bg-[#f9f7f2] -mt-12">
                    <h4 className="text-xl font-bold text-[#1a3a2a] mb-1">{doc.name}</h4>
                    <p className="text-[#c9a84c] text-sm font-semibold mb-6 pb-4 border-b border-[#1a3a2a]/10">{doc.title}</p>
                    <ul className="space-y-3 flex-1">
                      {doc.quals.map((qual, i) => (
                        <li key={i} className="flex gap-2 items-start text-sm text-slate-600">
                          <span className="material-symbols-outlined text-[#c9a84c] text-base shrink-0 mt-0.5">verified</span>
                          <span className="leading-relaxed">{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Treatments Section ── */}
        <section id="services" className="py-24 bg-[#f9f7f2] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative">
                <div className="absolute inset-4 border-2 border-[#c9a84c]/30 rounded-[3rem] -z-10 transform -translate-x-4 translate-y-4" />

                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-[#1a3a2a]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="علاج متقدم وعناية بالشعر" className="w-full aspect-[4/5] lg:aspect-[3/4] object-cover hover:scale-105 transition-transform duration-1000 ease-out" src="/hair/ct.avif" />
                  <div className="absolute inset-0 border border-white/20 rounded-[3rem] pointer-events-none" />
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="space-y-8">
                <motion.div variants={fadeUp} className="space-y-4">
                  <h3 className="text-[#c9a84c] font-bold">حلولنا العلاجية</h3>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a2a] leading-tight">علاجات متخصصة لكل حالات تساقط الشعر</h2>
                </motion.div>

                <div className="space-y-6">
                  {[
                    { title: "Regenera Evo لتجديد بصيلات الشعر", desc: "تقنية طبية متقدمة تساعد على تنشيط الخلايا وتحفيز نمو الشعر." },
                    { title: "البلازما PRP (الكلاسيك وMagellan) مع ACell", desc: "تعزز الدورة الدموية في فروة الرأس وتساعد على تقوية البصيلات." },
                    { title: "حقن المينوكسيديل والدوتاسترايد وفيتامينات الشعر", desc: "تغذية مباشرة للبصيلات لتحسين الكثافة وتقليل التساقط." },
                    { title: "الميزوثيرابي للشعر", desc: "حقن مغذيات وفيتامينات مركزة لدعم صحة فروة الرأس." },
                    { title: "Exosome & PDRN Therapy", desc: "علاج متطور يساعد على تحفيز تجدد الخلايا ودعم نمو الشعر." },
                  ].map((item, i) => (
                    <motion.div key={item.title} variants={fadeUp} custom={i * 0.07} className="flex gap-4 items-start group">
                      <motion.div whileHover={{ scale: 1.2 }} className="mt-1 text-[#c9a84c] shrink-0">
                        <span className="material-symbols-outlined fill-1">check_circle</span>
                      </motion.div>
                      <div>
                        <h5 className="font-bold text-lg mb-1 group-hover:text-[#c9a84c] transition-colors">{item.title}</h5>
                        <p className="text-slate-500">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.a href={BOOKING_ANCHOR} variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="bg-[#c9a84c] text-[#1a3a2a] px-8 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-3 shadow-lg shadow-[#c9a84c]/20 w-full sm:w-fit transition-colors">
                  <span className="material-symbols-outlined">event_available</span>
                  احجزي استشارتك الآن
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Google Reviews ── */}
        <section id="results" className="py-16 md:py-24 bg-[#c9a84c]/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-12">
              <motion.h3 variants={fadeUp} className="text-[#c9a84c] font-bold mb-4 uppercase text-sm tracking-widest">آراء عملائنا على Google</motion.h3>
              <motion.p variants={fadeUp} custom={0.05} className="text-2xl md:text-3xl font-bold text-[#1a3a2a] mb-6">أكثر من 1,158 تقييم على Google</motion.p>

              <motion.div variants={fadeUp} custom={0.1} className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md border border-[#1a3a2a]/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#1a3a2a]">4.8</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined fill-1 text-[#c9a84c] text-base">star</span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-slate-500">(1,158 تقييم)</span>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { name: "Sara Jean", text: "من أرقى وأنظم العيادات في جدة. الأخصائية نضال محترفة جداً وطريقتها في الفيشل فريدة ومريحة.", rating: 5, date: "قبل يوم" },
                { name: "Dhahby Rahma", text: "شكر خاص للأخصائية نضال؛ صبورة وتفهم شغلها وتأديه بكل حب.", rating: 5, date: "قبل يوم" },
                { name: "Fatima Bushra", text: "أنصح بشدة بالدكتورة لجين الجرماني لمصداقيتها ومهارتها ولمستها الإبداعية في العلاج.", rating: 5, date: "قبل يومين" },
                { name: "Rafika Rafika", text: "سعيدة جداً بنتيجة فيلر الشفايف وحقن الإكسوسوم مع الدكتورة إيناس. يدها خفيفة جداً.", rating: 5, date: "قبل أسبوع" },
                { name: "Afaf Alsubhi", text: "أشكر العيادة على احترافيتها ونتائجها الممتازة. تجربة رائعة من البداية للنهاية.", rating: 5, date: "قبل أسبوع" },
                { name: "Ali Al-Masoudi", text: "شكراً للدكتورة مها دحلان على حل مشكلة بنتي الجلدية بسرعة. أنصح بها بشدة.", rating: 5, date: "قبل شهر" },
              ].map((review, idx) => (
                <ReviewCard key={idx} review={review} />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <motion.a href="https://share.google/JV3pKhHlx8xUPrHXI" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-3 bg-white border border-[#1a3a2a]/10 text-[#1a3a2a] px-8 py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                شاهد جميع التقييمات على Google
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </motion.a>
            </div>
          </div>
        </section>

        {/* ── Google Map Section ── */}
        <section className="w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7996307159806!2d39.167282300000004!3d21.5546887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d038d28772bf%3A0xc4d8dc21894c2225!2zTUQgQ2xpbmljcyAo2YXYrNmF2Lkg2LnZitin2K_Yp9iqINivLiDZhdmH2Kcg2K_YrdmE2KfZhiDYp9mE2LfYqNmKKQ!5e0!3m2!1sen!2sma!4v1773113524509!5m2!1sen!2sma"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MD Clinics Location"
          />
        </section>

        {/* ── Booking Form Section ── */}
        <section className="py-24 scroll-mt-24" id="booking-form-section">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 60, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="bg-[#1a3a2a] rounded-[3rem] p-6 md:p-10 lg:p-16 relative overflow-hidden">
              <motion.div className="absolute top-0 right-0 w-80 h-80 bg-[#c9a84c]/10 rounded-full -mr-20 -mt-20 blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c9a84c]/5 rounded-full -ml-16 -mb-16 blur-3xl" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

              <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="space-y-6 text-center lg:text-right">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium">
                    <span className="material-symbols-outlined text-base">calendar_add_on</span>
                    احجزي استشارتك الآن
                  </motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">جاهزة لعلاج مشاكل شعرك؟</motion.h2>
                  <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-slate-300 text-lg leading-relaxed">ابدئي رحلتك لاستعادة كثافة شعرك وصحة فروة رأسك مع تقييم طبي دقيق وخيارات علاجية متقدمة مصممة خصيصًا لك.</motion.p>

                  <motion.ul initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="space-y-3 text-slate-200 text-sm">
                    {[
                      "استشارة مجانية مع طبيب متخصص",
                      "خطة علاج مصممة لحالتك",
                      "أحدث التقنيات الطبية في جدة",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 justify-center lg:justify-start">
                        <span className="material-symbols-outlined text-[#c9a84c] shrink-0">check_circle</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </motion.ul>
                </div>

                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }}>
                  <LeadForm id="booking-form" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Social Connect ── */}
      <section className="bg-white py-12 border-t border-[#1a3a2a]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h4 className="text-[#1a3a2a] font-bold text-lg mb-8">تواصل معنا عبر منصاتنا</h4>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {SOCIAL_LINKS.map((social) => (
              <motion.a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, color: "#1a3a2a" }} whileTap={{ scale: 0.95 }} className="flex items-center gap-3 text-slate-500 hover:text-[#1a3a2a] transition-colors border border-transparent hover:border-[#1a3a2a]/10 px-6 py-3 rounded-full hover:bg-[#f9f7f2]">
                <div className="w-6 h-6 flex items-center justify-center">{social.svg}</div>
                <span className="font-semibold text-sm">{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#f9f7f2] pt-20 pb-10 border-t border-[#1a3a2a]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hair/logo.avif" alt="مها دهلان" className="h-20 w-auto object-contain" />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">العيادة الرائدة في المملكة لتقديم حلول طبية وتجميلية متقدمة لعلاج مشاكل الشعر بأعلى معايير الجودة العالمية.</p>
              <div className="flex gap-4">
                {["public", "share", "photo_camera"].map((icon) => (
                  <motion.a key={icon} href="#" whileHover={{ scale: 1.15, backgroundColor: "#c9a84c" }} className="size-10 rounded-full border border-[#1a3a2a]/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-[#1a3a2a]">روابط سريعة</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                {["خدماتنا", "نتائجنا", "من نحن"].map((link) => (
                  <li key={link}>
                    <a href={`#${link === "خدماتنا" ? "services" : link === "نتائجنا" ? "results" : "about"}`} className="hover:text-[#c9a84c] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-[#1a3a2a]">تواصل معنا</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-[#c9a84c] text-base mt-0.5 shrink-0">location_on</span>
                  جدة، حي الروضة، شارع الأمير محمد بن عبدالعزيز (التحلية)، مركز بن حمران - الدور الثالث
                </li>
                <li className="flex gap-2 items-center">
                  <span className="material-symbols-outlined text-[#c9a84c] text-base shrink-0">mail</span>
                  <a href="mailto:info@mahadahlan.com" className="hover:text-[#c9a84c] transition-colors">info@mahadahlan.com</a>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-[#c9a84c] text-base shrink-0 mt-0.5">call</span>
                  <div className="flex flex-col gap-1">
                    <a href="tel:966920007515" className="hover:text-[#c9a84c] transition-colors" dir="ltr">+966 920007515</a>
                    <a href="tel:966503377702" className="hover:text-[#c9a84c] transition-colors" dir="ltr">+966 503377702</a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-[#1a3a2a]">النشرة البريدية</h5>
              <p className="text-xs text-slate-500 mb-4">احصل على نصائح طبية حصرية وعروض شهرية.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input className="flex-1 bg-white border border-[#1a3a2a]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]" placeholder="بريدك الإلكتروني" type="email" />
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} type="submit" className="bg-[#c9a84c] text-[#1a3a2a] p-2 rounded-lg">
                  <span className="material-symbols-outlined">send</span>
                </motion.button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1a3a2a]/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2026 عيادات د. مها دحلان. جميع الحقوق محفوظة.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-[#c9a84c] transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-[#c9a84c] transition-colors">الشروط والأحكام</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
