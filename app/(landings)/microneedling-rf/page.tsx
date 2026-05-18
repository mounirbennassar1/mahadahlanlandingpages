"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { MobileStickyCTA } from "@/components/usablecomponents/MobileStickyCTA";
import { HeroChoreography } from "./_components/HeroChoreography";
import { ScrollProgress } from "./_components/ScrollProgress";
import { Marquee } from "./_components/Marquee";
import { LeadForm } from "./_components/LeadForm";

const WA_NUMBER = "966503377702";
const WA_TOPIC = "علاج الميكرونيدلينغ بالترددات الراديوية";
const WA = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("مرحباً عندي استفسار عن " + WA_TOPIC)}`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export default function MicroneedlingRfLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#problem", label: "عن العلاج" },
    { href: "#process", label: "خطة العلاج" },
    { href: "#doctor", label: "الطبيبة" },
    { href: "#faq", label: "أسئلة شائعة" },
  ];

  return (
    <>
      <ScrollProgress />

      {/* ───── Nav ───── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[var(--color-mrf-line)] bg-white/75 px-4 py-2.5 backdrop-blur-xl sm:inset-x-4 sm:top-4 sm:px-6 sm:py-3"
      >
        <a href="#" aria-label="MD Clinics" className="flex items-center">
          <Image
            src="/microneedling-rf/logo.png"
            alt="MD Clinics — مجمع عيادات د. مها دحلان الطبي"
            width={56}
            height={56}
            priority
            className="size-10 object-contain sm:size-12"
          />
        </a>
        <div className="hidden gap-8 text-sm font-semibold text-[var(--color-mrf-ink-soft)] md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[var(--color-mrf-primary)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#book"
            className="hidden items-center gap-2 rounded-full bg-[var(--color-mrf-ink)] px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            احجزي الآن
            <Icon.ArrowLeft className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "إغلاق القائمة" : "القائمة"}
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-mrf-line)] bg-white/80 text-[var(--color-mrf-ink)] transition-colors hover:border-[var(--color-mrf-primary)] hover:text-[var(--color-mrf-primary)] md:hidden"
          >
            {menuOpen ? <Icon.X className="size-5" /> : <Icon.Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-[var(--color-mrf-line)] bg-white/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-right text-sm font-semibold text-[var(--color-mrf-ink)] transition-colors hover:bg-[var(--color-mrf-primary)]/10 hover:text-[var(--color-mrf-primary-dim)]"
                    >
                      <Icon.ArrowLeft className="size-4 text-[var(--color-mrf-muted)]" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ───── Hero ───── */}
      <HeroChoreography>
        <header
          ref={heroRef}
          className="relative overflow-hidden bg-[var(--color-mrf-bg)] pt-20 pb-14 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32"
        >
          <div className="relative mx-auto grid max-w-7xl items-center gap-4 px-5 sm:gap-8 sm:px-6 grid-cols-[1.15fr_1fr] sm:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            <div className="space-y-3 text-right sm:space-y-6 lg:space-y-8">
              <span className="mrf-eyebrow inline-flex translate-y-2.5 items-center gap-1.5 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-2.5 py-1 text-[9px] font-semibold tracking-[0.18em] text-[var(--color-mrf-primary-dim)] opacity-0 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.22em]">
                <Icon.Sparkles className="size-3 sm:size-3.5" />
                تقنية طبية متقدمة
              </span>

              <h1 className="space-y-0.5 text-[clamp(1.15rem,3.4vw,4.75rem)] font-bold leading-[1.4] tracking-tight text-[var(--color-mrf-ink)] sm:space-y-1 sm:leading-[1.35] lg:space-y-2">
                <span className="block overflow-hidden pt-[0.1em] pb-[0.25em]">
                  <span className="mrf-line block">
                    ميكرونيدلينغ
                  </span>
                </span>
                <span className="block overflow-hidden pt-[0.1em] pb-[0.25em]">
                  <span className="mrf-line block">
                    <em className="not-italic" style={{ color: "var(--color-mrf-primary)" }}>بالترددات الراديوية</em>
                  </span>
                </span>
                <span className="block overflow-hidden pt-[0.1em] pb-[0.25em]">
                  <span className="mrf-line block">لبشرة تتجدّد من الداخل<span style={{ color: "var(--color-mrf-primary)" }}>.</span></span>
                </span>
              </h1>

              <p className="mrf-sub hidden max-w-xl translate-y-5 text-base leading-[1.9] text-[var(--color-mrf-ink-soft)] opacity-0 sm:block sm:text-lg">
                علاج طبي يجمع بين الإبر الدقيقة وموجات الترددات الراديوية لتحفيز إنتاج الكولاجين، شدّ البشرة، وتنعيم آثار حب الشباب — بإشراف د. مها دحلان.
              </p>

              <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row">
                <a
                  href="#book"
                  className="mrf-cta inline-flex h-10 translate-y-5 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-mrf-ink)] px-3 text-[11px] font-bold text-white opacity-0 shadow-md transition-transform hover:scale-[1.02] sm:h-12 sm:gap-3 sm:rounded-2xl sm:px-6 sm:text-base lg:h-14 lg:px-7 lg:py-4"
                >
                  <Icon.CalendarCheck className="size-3.5 sm:size-5" />
                  احجزي
                  <span className="hidden sm:inline">استشارتكِ</span>
                  <Icon.ArrowLeft className="hidden size-4 sm:inline" />
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mrf-cta inline-flex h-10 translate-y-5 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-mrf-ink)]/15 bg-white px-3 text-[11px] font-bold text-[var(--color-mrf-ink)] opacity-0 transition-colors hover:border-[var(--color-mrf-primary)] hover:text-[var(--color-mrf-primary)] sm:h-12 sm:gap-3 sm:rounded-2xl sm:px-6 sm:text-base lg:h-14 lg:px-7 lg:py-4"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-sm text-[#25D366] sm:text-lg" />
                  واتساب
                </a>
              </div>
            </div>

            {/* Hero media — left column in RTL natural order. Soft pastel
                glow halo behind it for a modern editorial feel. */}
            <div
              data-mrf-hero-media
              className="relative mx-auto aspect-square w-full max-w-[160px] will-change-transform sm:max-w-[300px] lg:max-w-[560px]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(closest-side,var(--color-mrf-accent)/45,transparent_70%)] blur-2xl sm:-inset-10 sm:blur-3xl"
              />
              <video
                data-mrf-hero-video
                poster="/microneedling-rf/hero.png"
                src="/microneedling-rf/vid.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="نتائج علاج الميكرونيدلينغ بالترددات الراديوية"
                className="block size-full object-cover drop-shadow-[0_20px_40px_rgba(154,90,78,0.18)]"
              />
            </div>
          </div>

          {/* Stats row — full-width under the 2-col grid so it doesn't
              squeeze the text column on mobile. */}
          <div className="relative mx-auto mt-8 grid max-w-7xl grid-cols-3 gap-3 border-t border-[var(--color-mrf-line)] px-5 pt-5 text-[var(--color-mrf-ink-soft)] sm:mt-12 sm:gap-6 sm:px-6 sm:pt-6">
            {[
              { num: "+١٢", label: "سنة خبرة" },
              { num: "٤.٩", label: "تقييم العميلات" },
              { num: "+٩٢٪", label: "تحسن واضح" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col text-right">
                <span className="text-lg font-bold text-[var(--color-mrf-ink)] sm:text-2xl">{s.num}</span>
                <span className="text-[9px] uppercase tracking-widest sm:text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </header>
      </HeroChoreography>

      <Marquee />

      {/* ───── Problem / Types ───── */}
      <section id="problem" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16"
        >
          <motion.div variants={fadeUp} className="space-y-5 text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]">
              <Icon.Sparkles className="size-3.5" />
              لماذا الميكرونيدلينغ RF؟
            </span>
            <h2
              className="font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              تقنية واحدة <em className="not-italic text-[var(--color-mrf-primary)]">تعالج أربع مشكلات</em> في آن.
            </h2>
            <p className="text-lg leading-loose text-[var(--color-mrf-ink-soft)]">
              تجمع التقنية بين إبر دقيقة جداً تخترق طبقات الجلد العميقة، وموجات
              ترددات راديوية تحفّز إنتاج الكولاجين الطبيعي من الداخل. النتيجة:
              بشرة أكثر شباباً، أكثر نعومة، وأكثر تناسقاً — بدون جراحة وبدون فترة
              نقاهة طويلة.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-5">
            {[
              {
                title: "آثار حب الشباب",
                short: "ندوب وحفر",
                desc: "تنعيم الندوب الغائرة الناتجة عن حب الشباب وتوحيد ملمس البشرة من خلال تجديد طبقات الجلد.",
                icon: <Icon.Layers className="size-5" />,
                tag: "تنعيم وتجديد",
              },
              {
                title: "ترهّل البشرة",
                short: "فقدان شد الجلد",
                desc: "شدّ البشرة في الوجه والرقبة عبر تحفيز الكولاجين، خصوصاً في خط الفك والخدود.",
                icon: <Icon.Activity className="size-5" />,
                tag: "شدّ ورفع",
              },
              {
                title: "المسام الواسعة",
                short: "ملمس غير منتظم",
                desc: "تصغير المسام الظاهرة وتنعيم البشرة وإعادة التوازن لإنتاج الدهون الطبيعية.",
                icon: <Icon.Palette className="size-5" />,
                tag: "تكثيف الجلد",
              },
              {
                title: "الخطوط الدقيقة",
                short: "علامات تقدّم البشرة",
                desc: "تخفيف الخطوط الدقيقة حول العين والفم وعلامات التعب من خلال إعادة بناء الكولاجين.",
                icon: <Icon.MoveDown className="size-5" />,
                tag: "نضارة ومرونة",
              },
            ].map((t) => (
              <motion.div
                key={t.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group flex flex-col gap-3 rounded-2xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)] p-4 transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(154,90,78,0.3)] sm:gap-4 sm:rounded-3xl sm:p-7"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-mrf-primary)]/10 text-[var(--color-mrf-primary-dim)] transition-colors group-hover:bg-[var(--color-mrf-primary)] group-hover:text-white sm:size-12 sm:rounded-2xl">
                    {t.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-[var(--color-mrf-muted)] sm:text-xs">
                    {t.short}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-tight text-[var(--color-mrf-ink)] sm:text-xl">
                  {t.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--color-mrf-ink-soft)] sm:text-sm">
                  {t.desc}
                </p>
                <span className="mt-auto self-start rounded-full bg-[var(--color-mrf-accent)]/20 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-mrf-primary-dim)] sm:px-3 sm:text-xs">
                  {t.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Process Timeline ───── */}
      <section
        id="process"
        className="relative scroll-mt-24 overflow-hidden bg-[var(--color-mrf-ink)] py-16 text-white sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[var(--color-mrf-primary)]/15 blur-3xl"
        />
        <Image
          src="/microneedling-rf/accent-bokeh.webp"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-15 mix-blend-soft-light"
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-accent)]/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-accent)]"
            >
              مراحل الجلسة
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              من الاستشارة إلى <em className="not-italic text-[var(--color-mrf-accent)]">بشرة متجدّدة</em>.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg leading-loose text-white/70"
            >
              بروتوكول واضح من أربع مراحل — كل خطوة بإشراف طبي مباشر.
            </motion.p>
          </motion.div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          >
            {[
              { num: "01", title: "استشارة وتشخيص", desc: "فحص نوع البشرة، تحديد المشكلات المستهدفة، وقياس عمق الندوب أو الترهّل." },
              { num: "02", title: "تخدير موضعي", desc: "كريم تخدير لطيف لمدة ٢٠ دقيقة لضمان راحة تامة طوال الجلسة." },
              { num: "03", title: "الجلسة العلاجية", desc: "تطبيق الإبر الدقيقة مع موجات الترددات الراديوية وفق عمق محدّد لكل منطقة." },
              { num: "04", title: "متابعة وعناية", desc: "بروتوكول عناية منزلية مفصّل ومتابعة دورية لضمان أفضل النتائج." },
            ].map((step) => (
              <motion.li
                key={step.num}
                variants={fadeUp}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-[var(--color-mrf-accent)]/40 sm:rounded-3xl sm:p-6"
              >
                <span className="block text-3xl font-black text-[var(--color-mrf-accent)] opacity-40 sm:text-5xl">
                  {step.num}
                </span>
                <h3 className="mt-1.5 text-base font-bold leading-tight sm:mt-2 sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70 sm:mt-3 sm:text-sm">
                  {step.desc}
                </p>
                <Icon.ArrowLeft className="absolute bottom-4 left-4 size-4 text-[var(--color-mrf-accent)] opacity-0 transition-opacity group-hover:opacity-100 sm:bottom-6 sm:left-6" />
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ───── Doctor ───── */}
      <section id="doctor" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          <motion.div variants={fadeUp} className="order-2 space-y-5 text-right lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]">
              الطبيبة المختصة
            </span>
            <h2
              className="font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              د. <em className="not-italic text-[var(--color-mrf-primary)]">مها</em> دحلان
            </h2>
            <p className="text-base font-semibold text-[var(--color-mrf-ink-soft)]">
              استشارية الأمراض الجلدية والتجميل والليزر
            </p>
            <blockquote className="border-r-4 border-[var(--color-mrf-primary)]/30 bg-[var(--color-mrf-surface)] px-6 py-5 text-right text-base leading-loose text-[var(--color-mrf-ink-soft)]">
              «الميكرونيدلينغ بالترددات الراديوية ليس مجرد جلسة تجميل — هو إعادة
              بناء فعلية للكولاجين تحت الجلد. النتيجة تأتي تدريجياً، لكنها تدوم.»
            </blockquote>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { num: "+١٢", label: "سنة خبرة" },
                { num: "+٢٨٠٠", label: "حالة معالجة" },
                { num: "زمالة", label: "الكلية الملكية البريطانية" },
                { num: "عضوة", label: "الجمعية الأوروبية للجلدية" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)] p-4"
                >
                  <p className="text-xl font-bold text-[var(--color-mrf-primary-dim)]">
                    {c.num}
                  </p>
                  <p className="text-xs text-[var(--color-mrf-ink-soft)]">{c.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-[0_30px_70px_-30px_rgba(154,90,78,0.4)] sm:max-w-md sm:rounded-[2rem] sm:border-8">
              <Image
                src="/microneedling-rf/doctor.png"
                alt="د. مها دحلان"
                fill
                sizes="(max-width: 1024px) 80vw, 480px"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-mrf-ink)]/40 to-transparent p-6 text-white">
                <p className="font-bold">د. مها دحلان</p>
                <p className="text-xs opacity-85">جدة، المملكة العربية السعودية</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="bg-[var(--color-mrf-surface)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]"
            >
              شهادات عميلاتنا
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              نتائج <em className="not-italic text-[var(--color-mrf-primary)]">تتحدث</em> عن نفسها
            </motion.h2>
          </motion.div>

          {(() => {
            const testimonials = [
              { name: "نورة م.", location: "جدة · آثار حب الشباب", text: "بعد ٤ جلسات صار في فرق واضح في ندوب وجهي. البشرة صارت ناعمة وموحّدة بشكل ما توقعته. الطاقم محترف ومريح." },
              { name: "لمى ع.", location: "الرياض · شدّ البشرة", text: "بشرتي صارت أكثر تماسكاً، خصوصاً منطقة الفك. اللي عجبني إن النتيجة طبيعية جداً ومحدش يلاحظ إنك سويتي إجراء." },
              { name: "ريم ك.", location: "الدمام · المسام", text: "مساماتي كانت واسعة وكل الكريمات ما نفعت. مع الميكرونيدلينغ RF صرت أحس ببشرتي ناعمة من غير ميكب. ممتنة جداً." },
              { name: "هند س.", location: "جدة · خطوط دقيقة", text: "خطوط حول العين خفّت بشكل واضح بعد ٣ جلسات فقط. الجلسة مريحة والنتيجة بدت تدريجياً بشكل طبيعي." },
              { name: "أمل ع.", location: "الرياض · تجديد عام", text: "بشرتي صارت أنضر وأكثر إشراقاً، وكل اللي حولي لاحظوا الفرق بدون ما يعرفوا السبب. تجربة ممتازة." },
              { name: "رنا ك.", location: "الدمام · ندوب قديمة", text: "ندوب من سنوات بدأت تختفي. الدكتورة شرحتلي كل خطوة قبل البدء وكان في متابعة بعد كل جلسة." },
            ];
            return (
              <div
                className="group relative overflow-hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                }}
              >
                <div className="mrf-marquee flex w-max gap-4 sm:gap-6">
                  {[...testimonials, ...testimonials].map((t, i) => (
                    <div
                      key={`${t.name}-${i}`}
                      className="flex w-[280px] shrink-0 flex-col gap-4 rounded-3xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-bg)] p-5 sm:w-[340px] sm:gap-5 sm:p-7"
                    >
                      <Icon.Quote className="size-6 text-[var(--color-mrf-primary)]" />
                      <p className="text-sm leading-loose text-[var(--color-mrf-ink-soft)]">
                        «{t.text}»
                      </p>
                      <div className="mt-auto flex items-center gap-3 border-t border-[var(--color-mrf-line)] pt-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-mrf-primary)] to-[var(--color-mrf-accent)] font-bold text-white">
                          {t.name.charAt(0)}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[var(--color-mrf-ink)]">{t.name}</p>
                          <p className="text-xs text-[var(--color-mrf-muted)]">{t.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mb-10 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]"
          >
            أسئلة شائعة
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-bold leading-tight text-[var(--color-mrf-ink)]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
          >
            إجابات قبل أن <em className="not-italic text-[var(--color-mrf-primary)]">تسألي</em>
          </motion.h2>
        </motion.div>

        <div className="space-y-3">
          {[
            { q: "ما هي تقنية الميكرونيدلينغ بالترددات الراديوية؟", a: "تقنية طبية تجمع بين إبر دقيقة جداً تخترق طبقات الجلد العميقة، وموجات ترددات راديوية تنقل حرارة محكومة تحت سطح البشرة، فتُحفّز إنتاج الكولاجين والإيلاستين الطبيعي." },
            { q: "هل العلاج مؤلم؟", a: "نطبّق كريم تخدير موضعي قبل الجلسة بـ ٢٠ دقيقة، فيكون الإحساس خفيفاً ومحتملاً تماماً. أغلب العميلات يصفنها بـ«وخز دافئ» بسيط." },
            { q: "كم جلسة أحتاج؟", a: "تختلف من حالة لأخرى — عادة ٣ إلى ٥ جلسات بفاصل ٤-٦ أسابيع. يتم تحديد العدد الدقيق في الاستشارة الأولى بناءً على عمق الندوب ودرجة الترهّل." },
            { q: "متى تظهر النتائج؟", a: "تبدأ النتائج بالظهور بعد ٢-٤ أسابيع من الجلسة الأولى، وتستمر بالتحسّن تدريجياً خلال ٣-٦ أشهر مع تكوّن الكولاجين الجديد." },
            { q: "هل أحتاج فترة نقاهة؟", a: "احمرار خفيف ليوم أو يومين هو الأكثر شيوعاً. يمكنكِ العودة لمعظم أنشطتك اليومية في اليوم التالي، مع الالتزام بواقي الشمس وكريمات الترطيب الموصى بها." },
            { q: "هل التقنية آمنة لجميع أنواع البشرة؟", a: "نعم، الميكرونيدلينغ RF آمن لجميع درجات لون البشرة، بما فيها البشرة السمراء — لأن الحرارة تنتقل بالترددات الراديوية وليس بالضوء، فلا خطر من تصبّغات." },
          ].map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              open={i === openFaq}
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) setOpenFaq(i);
              }}
              className="group overflow-hidden rounded-2xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-right text-sm font-bold text-[var(--color-mrf-ink)] sm:gap-4 sm:px-6 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <Icon.Plus className="size-5 shrink-0 text-[var(--color-mrf-primary)] transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <div className="border-t border-[var(--color-mrf-line)] px-5 py-4 text-right text-sm leading-loose text-[var(--color-mrf-ink-soft)] sm:px-6 sm:py-5">
                {f.a}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ───── Booking ───── */}
      <section
        id="book"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-[var(--color-mrf-bg)] via-[var(--color-mrf-accent)]/15 to-[var(--color-mrf-bg)] py-16 sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-1/4 size-[420px] rounded-full bg-[var(--color-mrf-accent)]/40 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-5 text-right"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]"
            >
              احجزي استشارتكِ
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
            >
              ابدئي رحلتكِ مع <em className="not-italic text-[var(--color-mrf-primary)]">بشرة متجدّدة</em>.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg leading-loose text-[var(--color-mrf-ink-soft)]"
            >
              املئي النموذج أو راسلينا مباشرة على واتساب — يصلكِ ردّ من فريقنا خلال ٢٤ ساعة.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-mrf-ink)] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <Icon.CalendarCheck className="size-4" />
                احجزي استشارتكِ
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                تواصلي عبر واتساب
              </a>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="grid gap-2.5 pt-6 text-sm text-[var(--color-mrf-ink-soft)]"
            >
              {[
                "استشارة مع طبيبة متخصصة",
                "خطة علاج مصمّمة لحالتكِ",
                "سرية تامة وخصوصية لبياناتكِ",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Icon.CheckCircle2 className="mt-0.5 size-4 text-[var(--color-mrf-primary)]" />
                  {b}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LeadForm />
          </motion.div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="bg-[var(--color-mrf-ink)] py-10 pb-24 text-white/70 sm:py-12 md:pb-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center text-sm sm:px-6 md:flex-row md:text-start">
          <p>© ٢٠٢٦ عيادات د. مها دحلان · جميع الحقوق محفوظة</p>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-[var(--color-mrf-accent)]" href="#">سياسة الخصوصية</a>
            <a className="transition-colors hover:text-[var(--color-mrf-accent)]" href="#">الشروط</a>
          </div>
        </div>
      </footer>

      <MobileStickyCTA
        tokenPrefix="mrf"
        bookHref="#book"
        whatsappNumber={WA_NUMBER}
        topicMessage={"مرحباً عندي استفسار عن " + WA_TOPIC}
      />

      <WhatsAppFAB
        tokenPrefix="mrf"
        whatsappNumber={WA_NUMBER}
        topicMessage={"مرحباً عندي استفسار عن " + WA_TOPIC}
      />
    </>
  );
}
