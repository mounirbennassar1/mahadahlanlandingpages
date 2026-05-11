"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/components/icons";
import { HeroChoreography } from "./_components/HeroChoreography";
import { ScrollProgress } from "./_components/ScrollProgress";
import { Marquee } from "./_components/Marquee";
import { LeadForm } from "./_components/LeadForm";

const WA =
  "https://wa.me/966503377702?text=مرحباً%20عندي%20استفسار%20عن%20علاج%20الهالات%20والتصبّغات";

/* shared fade-up variant */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export default function DarkCirclesLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Disable hero parallax on touch / small viewports — feels janky there,
  // and avoids a horizontal-scroll wobble during scroll-momentum.
  const [isCompact, setIsCompact] = useState(true);
  useEffect(() => {
    const check = () => {
      const touch = window.matchMedia("(pointer: coarse)").matches;
      const small = window.matchMedia("(max-width: 1023px)").matches;
      setIsCompact(touch || small);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const heroImageYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroImageY = isCompact ? "0%" : heroImageYRaw;

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#problem", label: "عن الهالات" },
    { href: "#process", label: "خطّة العلاج" },
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
        className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[var(--color-dc-line)] bg-white/75 px-4 py-2.5 backdrop-blur-xl sm:inset-x-4 sm:top-4 sm:px-6 sm:py-3"
      >
        <a href="#" aria-label="MD Clinics" className="flex items-center">
          <Image
            src="/dark-circles/logo.png"
            alt="MD Clinics — مجمع عيادات د. مها دحلان الطبي"
            width={56}
            height={56}
            priority
            className="size-10 object-contain sm:size-12"
          />
        </a>
        <div className="hidden gap-8 text-sm font-semibold text-[var(--color-dc-ink-soft)] md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[var(--color-dc-primary)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#book"
            className="hidden items-center gap-2 rounded-full bg-[var(--color-dc-ink)] px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            احجزي الآن
            <Icon.ArrowLeft className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "إغلاق القائمة" : "القائمة"}
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-dc-line)] bg-white/80 text-[var(--color-dc-ink)] transition-colors hover:border-[var(--color-dc-primary)] hover:text-[var(--color-dc-primary)] md:hidden"
          >
            {menuOpen ? <Icon.X className="size-5" /> : <Icon.Menu className="size-5" />}
          </button>
        </div>

        {/* mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-[var(--color-dc-line)] bg-white/95 p-2 shadow-2xl shadow-[var(--color-dc-primary)]/10 backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-right text-sm font-semibold text-[var(--color-dc-ink)] transition-colors hover:bg-[var(--color-dc-primary)]/10 hover:text-[var(--color-dc-primary-dim)]"
                    >
                      <Icon.ArrowLeft className="size-4 text-[var(--color-dc-muted)]" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#book"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-dc-ink)] px-5 py-3 text-sm font-bold text-white shadow-md"
              >
                <Icon.CalendarCheck className="size-4" />
                احجزي استشارتكِ
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ───── Hero ───── */}
      <HeroChoreography>
        <header
          ref={heroRef}
          className="dc-grain relative overflow-hidden bg-[var(--color-dc-bg)] pt-24 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32"
        >
          {/* warm gradient blobs — hidden on phones to save GPU + visual noise */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-32 hidden size-[480px] rounded-full bg-gradient-to-br from-[var(--color-dc-accent)] to-transparent opacity-50 blur-3xl sm:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 -left-40 hidden size-[420px] rounded-full bg-gradient-to-tr from-[var(--color-dc-primary)] to-transparent opacity-25 blur-3xl sm:block"
          />
          {/* one subtle warm wash on mobile so the bg isn't flat */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 size-72 rounded-full bg-gradient-to-br from-[var(--color-dc-accent)]/40 to-transparent blur-3xl sm:hidden"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:gap-12 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
            <div className="space-y-8 text-right">
              <span
                className="dc-eyebrow inline-flex items-center gap-2 rounded-full border border-[var(--color-dc-primary)]/25 bg-[var(--color-dc-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-dc-primary-dim)] opacity-0"
                style={{ transform: "translateY(10px)" }}
              >
                <Icon.Sparkles className="size-3.5" />
                علاج طبي متخصص
              </span>

              <h1 className="font-bold leading-[1.1] tracking-tight text-[var(--color-dc-ink)]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)" }}>
                <span className="dc-line-mask">
                  <span className="dc-line">
                    نظرة <em className="not-italic text-[var(--color-dc-primary)]">مشرقة</em>
                  </span>
                </span>
                <span className="dc-line-mask">
                  <span className="dc-line">تبدأ من تحت</span>
                </span>
                <span className="dc-line-mask">
                  <span className="dc-line">
                    العين <span className="text-[var(--color-dc-primary)]">.</span>
                  </span>
                </span>
              </h1>

              <p
                className="dc-sub max-w-xl text-lg leading-[1.9] text-[var(--color-dc-ink-soft)] opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                الهالات السوداء والتصبّغات حول العين ليست عيباً — هي إشارة من بشرتكِ.
                نُصمّم لكِ خطة علاجية دقيقة تعيد توازن المنطقة الحساسة وتمنحكِ نظرة أكثر
                صفاءً وحيوية.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#book"
                  className="dc-cta inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[var(--color-dc-ink)] px-6 text-base font-bold text-white shadow-lg shadow-[var(--color-dc-ink)]/20 opacity-0 transition-transform hover:scale-[1.02] sm:h-auto sm:px-7 sm:py-4"
                  style={{ transform: "translateY(20px)" }}
                >
                  <Icon.CalendarCheck className="size-5" />
                  احجزي استشارتكِ
                  <Icon.ArrowLeft className="size-4" />
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dc-cta inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-[var(--color-dc-ink)]/15 bg-white px-6 text-base font-bold text-[var(--color-dc-ink)] opacity-0 transition-colors hover:border-[var(--color-dc-primary)] hover:text-[var(--color-dc-primary)] sm:h-auto sm:px-7 sm:py-4"
                  style={{ transform: "translateY(20px)" }}
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-lg text-[#25D366]" />
                  تواصلي عبر واتساب
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-[var(--color-dc-line)] pt-6 text-sm text-[var(--color-dc-ink-soft)] sm:flex sm:flex-wrap sm:gap-6">
                {[
                  { num: "+١٢", label: "سنة خبرة" },
                  { num: "٤.٩", label: "تقييم العميلات" },
                  { num: "٩٠٪", label: "تحسن واضح" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-2xl font-bold text-[var(--color-dc-ink)]">
                      {s.num}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest sm:text-xs">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* hero image with parallax (desktop only) */}
            <motion.div
              style={{ y: heroImageY }}
              className="relative mx-auto mt-4 w-full max-w-[340px] sm:max-w-[440px] lg:mt-0 lg:max-w-[480px]"
            >
              <div className="absolute -inset-3 rounded-[2.5rem] border border-[var(--color-dc-primary)]/30 sm:-inset-4" />
              <div className="absolute -top-6 -right-6 hidden size-32 rounded-full bg-[var(--color-dc-accent)]/40 blur-2xl sm:block" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(154,90,78,0.45)] sm:rounded-[2rem] sm:shadow-[0_40px_80px_-30px_rgba(154,90,78,0.45)]">
                <Image
                  src="/dark-circles/hero.png"
                  alt="بشرة موحّدة ومشرقة حول العين"
                  fill
                  priority
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 480px"
                  className="dc-hero-image object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dc-ink)]/15 to-transparent" />
              </div>

              {/* floating badge — kept inside the image footprint on small phones */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="absolute -bottom-4 left-2 flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-xl backdrop-blur-md sm:-bottom-6 sm:left-4 sm:gap-3 sm:px-5 sm:py-3.5"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--color-dc-primary)]/15 text-[var(--color-dc-primary-dim)] sm:size-10">
                  <Icon.Eye className="size-4 sm:size-5" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[var(--color-dc-ink)] sm:text-sm">
                    نتائج تدوم
                  </p>
                  <p className="text-[10px] text-[var(--color-dc-ink-soft)] sm:text-xs">
                    تتحسّن أسبوعاً بعد آخر
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </header>
      </HeroChoreography>

      {/* ───── Trust marquee ───── */}
      <Marquee />

      {/* ───── Problem / types ───── */}
      <section id="problem" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16"
        >
          <motion.div variants={fadeUp} className="space-y-5 text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-dc-primary)]/25 bg-[var(--color-dc-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-dc-primary-dim)]">
              <Icon.Eye className="size-3.5" />
              ما هي الهالات؟
            </span>
            <h2
              className="font-bold leading-tight text-[var(--color-dc-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              ثلاث أنواع، ثلاث قصص — ولكل قصة <em className="not-italic text-[var(--color-dc-primary)]">علاجها الخاص</em>.
            </h2>
            <p className="text-lg leading-loose text-[var(--color-dc-ink-soft)]">
              لا تتشابه الهالات. التشخيص الدقيق هو الخطوة الأولى لاختيار البروتوكول
              العلاجي المناسب لبشرتكِ.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-5">
            {[
              {
                title: "هالات وعائية",
                short: "زرقاء أو وردية",
                desc: "ناتجة عن شفافية الجلد وانعكاس الأوعية الدموية تحته. تظهر أوضح مع التعب والسهر.",
                icon: <Icon.Activity className="size-5" />,
                tag: "تحفيز الدورة الدموية",
              },
              {
                title: "هالات تصبّغية",
                short: "بُنية أو رمادية",
                desc: "تراكم الميلانين حول العين بسبب الوراثة، الشمس، أو فرك العين المتكرّر.",
                icon: <Icon.Palette className="size-5" />,
                tag: "تفتيح بصبر",
              },
              {
                title: "هالات هيكلية",
                short: "ظل ناتج عن الفراغ",
                desc: "فقدان حجم تحت العين يُحدث ظلاً يُشبه الهالات. يستجيب لتعزيز الامتلاء الدقيق.",
                icon: <Icon.MoveDown className="size-5" />,
                tag: "تعزيز امتلاء",
              },
              {
                title: "خلط من أكثر من نوع",
                short: "الأكثر شيوعاً",
                desc: "كثير من الحالات تجمع بين نوعين أو أكثر، وتحتاج خطة مزدوجة مدروسة.",
                icon: <Icon.Layers className="size-5" />,
                tag: "خطة شخصية",
              },
            ].map((t) => (
              <motion.div
                key={t.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group flex flex-col gap-3 rounded-2xl border border-[var(--color-dc-line)] bg-[var(--color-dc-surface)] p-4 transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(154,90,78,0.3)] sm:gap-4 sm:rounded-3xl sm:p-7"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-dc-primary)]/10 text-[var(--color-dc-primary-dim)] transition-colors group-hover:bg-[var(--color-dc-primary)] group-hover:text-white sm:size-12 sm:rounded-2xl">
                    {t.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-[var(--color-dc-muted)] sm:text-xs">
                    {t.short}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-tight text-[var(--color-dc-ink)] sm:text-xl">
                  {t.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--color-dc-ink-soft)] sm:text-sm">
                  {t.desc}
                </p>
                <span className="mt-auto self-start rounded-full bg-[var(--color-dc-accent)]/20 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-dc-primary-dim)] sm:px-3 sm:text-xs">
                  {t.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Process timeline ───── */}
      <section
        id="process"
        className="relative scroll-mt-24 overflow-hidden bg-[var(--color-dc-ink)] py-16 text-white sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[var(--color-dc-primary)]/15 blur-3xl"
        />
        <Image
          src="/dark-circles/accent-bokeh.webp"
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
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-dc-accent)]/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-dc-accent)]"
            >
              مراحل العلاج
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              من التشخيص إلى نتيجة <em className="not-italic text-[var(--color-dc-accent)]">حقيقية</em>.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg leading-loose text-white/70"
            >
              برنامج علاجي مكوّن من أربع مراحل، مدروس بدقة لكل حالة على حدة.
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
              {
                num: "01",
                title: "تشخيص دقيق",
                desc: "تحديد نوع الهالات (وعائي، تصبّغي، هيكلي) عبر فحص متخصص.",
              },
              {
                num: "02",
                title: "خطة شخصية",
                desc: "بروتوكول علاجي يجمع بين التقنيات المناسبة لحالتكِ.",
              },
              {
                num: "03",
                title: "جلسات لطيفة",
                desc: "علاجات هادئة بإشراف طبي مباشر، بدون فترة نقاهة طويلة.",
              },
              {
                num: "04",
                title: "متابعة دائمة",
                desc: "نتابع تحسّن بشرتكِ ونعدّل الخطة لضمان نتائج تدوم.",
              },
            ].map((step) => (
              <motion.li
                key={step.num}
                variants={fadeUp}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-[var(--color-dc-accent)]/40 sm:rounded-3xl sm:p-6"
              >
                <span className="block text-3xl font-black text-[var(--color-dc-accent)] opacity-40 sm:text-5xl">
                  {step.num}
                </span>
                <h3 className="mt-1.5 text-base font-bold leading-tight sm:mt-2 sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70 sm:mt-3 sm:text-sm">
                  {step.desc}
                </p>
                <Icon.ArrowLeft className="absolute bottom-4 left-4 size-4 text-[var(--color-dc-accent)] opacity-0 transition-opacity group-hover:opacity-100 sm:bottom-6 sm:left-6" />
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
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-dc-primary)]/25 bg-[var(--color-dc-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-dc-primary-dim)]">
              الطبيبة المختصة
            </span>
            <h2
              className="font-bold leading-tight text-[var(--color-dc-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              د. <em className="not-italic text-[var(--color-dc-primary)]">مها</em> دحلان
            </h2>
            <p className="text-base font-semibold text-[var(--color-dc-ink-soft)]">
              استشارية الأمراض الجلدية والتجميل والليزر
            </p>
            <blockquote className="border-r-4 border-[var(--color-dc-primary)]/30 bg-[var(--color-dc-surface)] px-6 py-5 text-right text-base leading-loose text-[var(--color-dc-ink-soft)]">
              «منطقة العين هي الأكثر حساسية في الوجه — كل خطوة علاجية فيها تحتاج
              تشخيصاً دقيقاً، وأيدٍ هادئة، ومتابعة لا تنقطع.»
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
                  className="rounded-2xl border border-[var(--color-dc-line)] bg-[var(--color-dc-surface)] p-4"
                >
                  <p className="text-xl font-bold text-[var(--color-dc-primary-dim)]">
                    {c.num}
                  </p>
                  <p className="text-xs text-[var(--color-dc-ink-soft)]">{c.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-[0_30px_70px_-30px_rgba(154,90,78,0.4)] sm:max-w-md sm:rounded-[2rem] sm:border-8">
              <Image
                src="/dark-circles/hero.png"
                alt="د. مها دحلان"
                fill
                sizes="(max-width: 1024px) 80vw, 480px"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-dc-ink)]/30 to-transparent p-6 text-white">
                <p className="font-bold">د. مها دحلان</p>
                <p className="text-xs opacity-85">جدة، المملكة العربية السعودية</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="bg-[var(--color-dc-surface)] py-16 sm:py-20 lg:py-24">
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
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-dc-primary)]/25 bg-[var(--color-dc-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-dc-primary-dim)]"
            >
              شهادات عميلاتنا
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-bold leading-tight text-[var(--color-dc-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              ثقة <em className="not-italic text-[var(--color-dc-primary)]">تُروى</em> بأصواتهنّ
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              {
                name: "هند س.",
                location: "جدة · هالات وعائية",
                text: "جربت كل أنواع الكريمات بدون فرق. مع الخطة اللي رسمتها لي الدكتورة، صار في فرق حقيقي ومريح بعد ٤ جلسات فقط.",
              },
              {
                name: "أمل ع.",
                location: "الرياض · تصبّغات",
                text: "ما توقعت إن تفتيح المنطقة الحساسة يمكن يكون آمن وبهالنعومة. الفريق هادئ، والمتابعة دائمة. ممتنة جداً.",
              },
              {
                name: "رنا ك.",
                location: "الدمام · ظل ناتج عن فراغ",
                text: "الطبيبة شخّصت إن المشكلة مو هالات أصلاً، بل فراغ بسيط تحت العين. النتيجة كانت طبيعية جداً وما لاحظها أحد.",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="flex flex-col gap-4 rounded-3xl border border-[var(--color-dc-line)] bg-[var(--color-dc-bg)] p-5 transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(154,90,78,0.25)] sm:gap-5 sm:p-7"
              >
                <Icon.Quote className="size-6 text-[var(--color-dc-primary)]" />
                <p className="text-sm leading-loose text-[var(--color-dc-ink-soft)]">
                  «{t.text}»
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-[var(--color-dc-line)] pt-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-dc-primary)] to-[var(--color-dc-accent)] font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--color-dc-ink)]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[var(--color-dc-muted)]">
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-dc-primary)]/25 bg-[var(--color-dc-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-dc-primary-dim)]"
          >
            أسئلة شائعة
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-bold leading-tight text-[var(--color-dc-ink)]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
          >
            إجابات قبل أن <em className="not-italic text-[var(--color-dc-primary)]">تسألي</em>
          </motion.h2>
        </motion.div>

        <div className="space-y-3">
          {[
            {
              q: "هل العلاج آمن على المنطقة الحساسة حول العين؟",
              a: "نعم. كل بروتوكولاتنا مصمّمة خصيصاً لمنطقة العين باستخدام تقنيات لطيفة ومعتمدة، بإشراف طبي مباشر طوال الجلسة.",
            },
            {
              q: "كم عدد الجلسات اللازمة؟",
              a: "يختلف من حالة لأخرى — عادةً ما بين ٣ إلى ٦ جلسات حسب نوع الهالات. يُحدّد العدد الدقيق خلال الاستشارة الأولى.",
            },
            {
              q: "متى تظهر النتائج الأولى؟",
              a: "تبدأ بوادر التحسّن بعد الجلسة الثانية أو الثالثة. النتائج الكاملة تظهر تدريجياً خلال ٢-٣ أشهر مع المتابعة المنزلية.",
            },
            {
              q: "هل أحتاج لفترة نقاهة بعد الجلسة؟",
              a: "غالباً لا. قد يظهر احمرار خفيف ساعات قليلة، ثم يمكنكِ العودة لروتينكِ مع الحرص على واقي الشمس.",
            },
            {
              q: "هل يمكنني المتابعة عن بُعد؟",
              a: "نعم — نقدّم متابعة دورية بعد كل جلسة، ويمكن إجراء بعض المتابعات عن بُعد عبر رسائل تتضمّن صوراً.",
            },
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
              className="group overflow-hidden rounded-2xl border border-[var(--color-dc-line)] bg-[var(--color-dc-surface)]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-right text-sm font-bold text-[var(--color-dc-ink)] sm:gap-4 sm:px-6 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <Icon.Plus className="size-5 shrink-0 text-[var(--color-dc-primary)] transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <div className="border-t border-[var(--color-dc-line)] px-5 py-4 text-right text-sm leading-loose text-[var(--color-dc-ink-soft)] sm:px-6 sm:py-5">
                {f.a}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ───── Booking ───── */}
      <section
        id="book"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-[var(--color-dc-bg)] via-[var(--color-dc-accent)]/15 to-[var(--color-dc-bg)] py-16 sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-1/4 size-[420px] rounded-full bg-[var(--color-dc-accent)]/40 blur-3xl"
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
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-dc-primary)]/25 bg-[var(--color-dc-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-dc-primary-dim)]"
            >
              احجزي استشارتكِ
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-bold leading-tight text-[var(--color-dc-ink)]"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
            >
              ابدئي رحلتكِ نحو <em className="not-italic text-[var(--color-dc-primary)]">نظرة مشرقة</em>.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg leading-loose text-[var(--color-dc-ink-soft)]"
            >
              املئي النموذج أو راسلينا مباشرة على واتساب — يصلكِ ردّ من فريقنا
              خلال ٢٤ ساعة.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                +966 503377702
              </a>
              <a
                href="tel:+966920007515"
                dir="ltr"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[var(--color-dc-line)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--color-dc-ink)] transition-colors hover:border-[var(--color-dc-primary)] hover:text-[var(--color-dc-primary)]"
              >
                <Icon.Phone className="size-4" />
                +966 920007515
              </a>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="grid gap-2.5 pt-6 text-sm text-[var(--color-dc-ink-soft)]"
            >
              {[
                "استشارة مجانية مع طبيبة متخصصة",
                "خطة علاج مصمّمة لحالتكِ تحديداً",
                "سرية تامة وخصوصية بياناتكِ",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Icon.CheckCircle2 className="mt-0.5 size-4 text-[var(--color-dc-primary)]" />
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
      <footer className="bg-[var(--color-dc-ink)] py-10 pb-24 text-white/70 sm:py-12 md:pb-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center text-sm sm:px-6 md:flex-row md:text-start">
          <p>© ٢٠٢٦ عيادات د. مها دحلان · جميع الحقوق محفوظة</p>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-[var(--color-dc-accent)]" href="#">
              سياسة الخصوصية
            </a>
            <a className="transition-colors hover:text-[var(--color-dc-accent)]" href="#">
              الشروط
            </a>
          </div>
        </div>
      </footer>

      {/* ───── Mobile sticky CTA bar (md-) ───── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-dc-line)] bg-white/95 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-10px_30px_-10px_rgba(154,90,78,0.2)] backdrop-blur-xl md:hidden"
      >
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <a
            href="#book"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-dc-ink)] text-sm font-bold text-white shadow-md transition-transform active:scale-[0.98]"
          >
            <Icon.CalendarCheck className="size-4" />
            احجزي الآن
          </a>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصلي عبر واتساب"
            className="relative flex size-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md transition-transform active:scale-[0.95]"
          >
            <span className="absolute -inset-1 animate-ping rounded-2xl bg-[#25D366]/30" aria-hidden />
            <FontAwesomeIcon icon={faWhatsapp} className="relative text-2xl" />
          </a>
        </div>
      </motion.div>

      {/* ───── Floating WhatsApp (md+) ───── */}
      <motion.a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصلي عبر واتساب"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 hidden size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-500/30 md:flex"
      >
        <span className="absolute -inset-1 animate-ping rounded-full bg-[#25D366]/40" aria-hidden />
        <FontAwesomeIcon icon={faWhatsapp} className="relative text-2xl" />
      </motion.a>
    </>
  );
}
