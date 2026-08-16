"use client";

import Image from "next/image";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import { Icon, SocialIcon } from "@/components/icons";
import { SectionEyebrow } from "@/components/usablecomponents/SectionEyebrow";
import { CinematicFilm } from "./_components/CinematicFilm";
import { AmbientLayers } from "./_components/AmbientLayers";
import { GlassStickyCTA } from "./_components/GlassStickyCTA";
import { ScrollProgress } from "./_components/ScrollProgress";
import { Marquee } from "./_components/Marquee";
import { LeadForm } from "./_components/LeadForm";
import { DoctorsSlider } from "./_components/DoctorsSlider";
import { ProtocolSteps } from "./_components/ProtocolSteps";

/* Frame count of the scroll film — MUST match public/glass-skin/seq/fNNN.jpg */
const FRAME_COUNT = 121;

/* TikTok-ads funnel: form-only lead capture — every CTA anchors here. */
const FORM_ANCHOR = "#lead-form";

/* house animation variants */
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

/* ─────────────────────────── content data ─────────────────────────── */

const CHECKLIST = [
  {
    icon: Icon.FlaskConical,
    title: "عناية مدعومة علمياً",
    text: "مكوّنات كورية موثوقة بتركيزات طبية مدروسة لبشرتكِ.",
  },
  {
    icon: Icon.Layers,
    title: "بروتوكول متعدد الطبقات",
    text: "تنظيف وتقشير وترطيب وتغذية في جلسة واحدة متكاملة.",
  },
  {
    icon: Icon.Leaf,
    title: "مكوّنات لطيفة وآمنة",
    text: "مناسبة للبشرة الحساسة، بدون إبر وبدون تهيّج.",
  },
  {
    icon: Icon.BadgeCheck,
    title: "خبراء معتمدون في العناية بالبشرة",
    text: "يُجرى البروتوكول على يد مختصين مؤهلين بشهادات معتمدة، لضمان عناية احترافية تناسب احتياجات بشرتكِ.",
  },
];

const STATS = [
  { num: "٩٨٪", label: "نسبة رضا العميلات" },
  { num: "+٢٤٠٠", label: "جلسة ناجحة" },
  { num: "٣", label: "جلسات لنتيجة مكتملة" },
  { num: "٠", label: "فترة نقاهة" },
];

const TESTIMONIALS = [
  {
    name: "نورة",
    city: "جدة",
    text: "بشرتي صارت تعكس الضوء فعلاً! من أول جلسة حسّيت بالفرق، وبعد الثالثة صارت الإشراقة ثابتة حتى بدون مكياج.",
  },
  {
    name: "ريم",
    city: "مكة",
    text: "أول مرة أشوف لمعان طبيعي بدون فلتر. الجلسة مريحة جداً وما فيها أي ألم، وخرجت من العيادة ببشرة متوهّجة.",
  },
  {
    name: "سارة",
    city: "جدة",
    text: "التقشير اللطيف مع الترطيب العميق غيّر ملمس بشرتي تماماً. فريق العيادة دقيق ومهتم بأدق التفاصيل.",
  },
];

const FAQS = [
  {
    q: "كم جلسة أحتاج للوصول للبشرة الزجاجية؟",
    a: "تظهر الإشراقة الأولى من الجلسة الأولى، وننصح ببرنامج من ٤ جلسات بفاصل يحدد من قبل الأخصائية بحسب احتياج بشرتكِ للوصول إلى النتيجة المكتملة وتثبيتها.",
  },
  {
    q: "هل يناسب البروتوكول البشرة الحساسة؟",
    a: "نعم، جميع الخطوات لطيفة وخالية من الإبر، وتُخصَّص التركيزات بعد تقييم بشرتكِ في بداية الجلسة.",
  },
  {
    q: "هل هناك ألم أو فترة نقاهة؟",
    a: "لا. الجلسة مريحة تماماً وقد تشعرين ببرودة لطيفة فقط، وتعودين لروتينكِ اليومي فوراً مع واقي الشمس.",
  },
  {
    q: "متى تظهر النتيجة وكم تدوم؟",
    a: "اللمعان الفوري يظهر بعد الجلسة مباشرة، وتتحسّن جودة البشرة تدريجياً خلال أسبوعين. مع الالتزام بالروتين المنزلي تدوم النتيجة لأشهر.",
  },
  {
    q: "ما الفرق بين الجلاس سكين والتنظيف العميق العادي؟",
    a: "الجلاس سكين بروتوكول كوري متكامل يجمع التنظيف العميق مع التقشير الإنزيمي وضخ السيرومات وقناع التوهّج. الهدف ليس النظافة فقط، بل بشرة تعكس الضوء.",
  },
];

const NAV_LINKS = [
  { href: "#about", label: "عن الجلاس سكين" },
  { href: "#protocol", label: "بروتوكول الجلسة" },
  { href: "#doctor", label: "الأخصائيات" },
  { href: "#faq", label: "أسئلة شائعة" },
];

const SOCIAL_LINKS = [
  { name: "instagram", label: "إنستغرام" },
  { name: "tiktok", label: "تيك توك" },
  { name: "snapchat", label: "سناب شات" },
] as const;

/* ─────────────────────────────── page ─────────────────────────────── */

export default function GlassSkinLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* hide nav on scroll-down, return on scroll-up (never remove it) */
  const { scrollY } = useScroll();
  const [navHidden, setNavHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > 160 && y > prev && !menuOpen) setNavHidden(true);
    else setNavHidden(false);
  });

  return (
    <>
      <AmbientLayers />
      <ScrollProgress />

      {/* ───── Nav ───── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: navHidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[var(--color-gls-line)] bg-[#060708]/70 px-4 py-2.5 backdrop-blur-xl sm:inset-x-4 sm:top-4 sm:px-6 sm:py-3"
      >
        <a href="#film" aria-label="عيادات د. مها دحلان" className="flex items-center">
          <Image
            src="/glass-skin/logo.webp"
            alt="شعار مجمع عيادات د. مها دحلان الطبي"
            width={56}
            height={56}
            priority
            className="size-10 object-contain sm:size-12"
          />
        </a>

        <div className="hidden gap-8 text-sm font-semibold text-[var(--color-gls-ink-soft)] md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[var(--color-gls-primary-dim)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={FORM_ANCHOR}
            className="hidden items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold text-[#1d2023] shadow-[0_10px_24px_-10px_rgba(212,175,55,0.55)] transition-transform hover:scale-[1.03] sm:inline-flex"
            style={{
              background:
                "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)",
            }}
          >
            احجزي الآن
            <Icon.ArrowLeft className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "إغلاق القائمة" : "القائمة"}
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-gls-line)] bg-[#16181b]/80 text-[var(--color-gls-ink)] transition-colors hover:border-[var(--color-gls-primary)] hover:text-[var(--color-gls-primary-dim)] md:hidden"
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
              className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-[var(--color-gls-line)] bg-[#060708]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-right text-sm font-semibold text-[var(--color-gls-ink-soft)] transition-colors hover:bg-[var(--color-gls-primary)]/10 hover:text-[var(--color-gls-primary-dim)]"
                    >
                      {l.label}
                      <Icon.ChevronLeft className="size-4 text-[var(--color-gls-primary)]" />
                    </a>
                  </li>
                ))}
                <li className="p-2">
                  <a
                    href={FORM_ANCHOR}
                    onClick={() => setMenuOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold text-[#1d2023]"
                    style={{
                      background:
                        "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)",
                    }}
                  >
                    <Icon.CalendarCheck className="size-4" />
                    احجزي جلستكِ الآن
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="relative z-10">
        {/* ───── 1 · The Film (hero + scroll-scrubbed rotation) ───── */}
        <CinematicFilm frameCount={FRAME_COUNT} />

        {/* ───── 2 · Trust marquee ───── */}
        <Marquee />

        {/* ───── 3 · What is Glass Skin ───── */}
        <motion.section
          id="about"
          data-ambient="#0d0c0a"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-16 md:py-32"
        >
          {/* text — first in DOM = right column in RTL */}
          <div>
            <motion.div variants={fadeUp}>
              <SectionEyebrow tokenPrefix="gls" icon="Gem">
                طريقة البشرة الزجاجية
              </SectionEyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-5 text-3xl font-extrabold leading-snug text-white sm:text-4xl"
            >
              بشرة نقيّة كالزجاج…{" "}
              <em className="gls-gold-text not-italic">سرّ الجمال الكوري</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-[15px] leading-8 text-[var(--color-gls-ink-soft)]"
            >
              «الجلاس سكين» ليس مجرد تنظيف بشرة، بل فلسفة كورية كاملة هدفها
              بشرة صافية، ممتلئة بالترطيب، تعكس الضوء كسطح الزجاج. في عيادات
              د. مها دحلان ننقل لكِ البروتوكول الأصيل بأيدٍ طبية خبيرة
              ومنتجات كورية موثوقة.
            </motion.p>

            <motion.ul variants={stagger} className="mt-8 space-y-4">
              {CHECKLIST.map((item) => (
                <motion.li
                  key={item.title}
                  variants={fadeUp}
                  className="flex items-start gap-4"
                >
                  <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-gls-line)] bg-[var(--color-gls-primary)]/10 text-[var(--color-gls-primary-dim)]">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-[var(--color-gls-muted)]">
                      {item.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* imagery — second in DOM = left column in RTL */}
          <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-[20rem]">
            <div className="gls-float relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] border border-[var(--color-gls-line)] bg-[#060708] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
              {/* Vimeo reel (9:16) — the card is now 9:16 too, so the full
                  vertical video shows uncropped. background=1 → autoplay,
                  muted, looped, no UI. */}
              <iframe
                src="https://player.vimeo.com/video/1210474451?background=1&autoplay=1&loop=1&muted=1&autopause=0&title=0&byline=0&portrait=0&badge=0&player_id=0&app_id=58479"
                title="الجلسة الكورية"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full border-0"
                aria-label="فيديو الجلسة الكورية للبشرة الزجاجية"
              />
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,7,8,0.5), transparent 40%)",
                }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute bottom-5 right-5 font-[family-name:var(--font-plex-arabic)] text-sm font-semibold tracking-normal text-[var(--color-gls-accent)]"
              >
                نضارة وإشراقة
              </span>
            </div>
            {/* floating chip */}
            <div className="absolute -top-5 left-2 max-w-[13rem] rounded-2xl border border-[var(--color-gls-line)] bg-[#060708]/85 px-4 py-3 shadow-xl backdrop-blur-md sm:left-6">
              <span className="block text-lg font-extrabold text-[var(--color-gls-primary-dim)]">
                إشراقة فورية
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug tracking-normal text-[var(--color-gls-muted)]">
                ونضارة تدوم لعدة أيام بعد الجلسة
              </span>
            </div>
          </motion.div>
        </motion.section>

        {/* ───── 4 · Booking (lead form — early in the funnel) ───── */}
        <motion.section
          id="lead-form"
          data-ambient="#08090b"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-16 md:py-32"
        >
          {/* copy — right column in RTL */}
          <div>
            <motion.div variants={fadeUp}>
              <SectionEyebrow tokenPrefix="gls" icon="CalendarCheck">
                احجزي الآن
              </SectionEyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-5 text-3xl font-extrabold leading-snug text-white sm:text-4xl"
            >
              جاهزة لبشرةٍ{" "}
              <em className="gls-gold-text not-italic">تعكس الضوء؟</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-[15px] leading-8 text-[var(--color-gls-ink-soft)]"
            >
              اتركي بياناتكِ وسيتواصل معكِ فريقنا خلال ٢٤ ساعة لتأكيد موعدكِ
              وتخصيص البروتوكول المناسب لبشرتكِ. المقاعد محدودة أسبوعياً
              للحفاظ على جودة كل جلسة.
            </motion.p>

            <motion.ul variants={stagger} className="mt-8 space-y-4">
              <motion.li variants={fadeUp} className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-2xl border border-[var(--color-gls-line)] bg-[var(--color-gls-primary)]/10 text-[var(--color-gls-primary-dim)]">
                  <Icon.CalendarCheck className="size-5" />
                </span>
                <div>
                  <span className="block text-sm font-bold text-white">
                    استشارة مجانية
                  </span>
                  <span className="text-sm text-[var(--color-gls-muted)]">
                    عبّئي النموذج ونحدّد لكِ الموعد المناسب
                  </span>
                </div>
              </motion.li>
              <motion.li variants={fadeUp} className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-2xl border border-[var(--color-gls-line)] bg-[var(--color-gls-primary)]/10 text-[var(--color-gls-primary-dim)]">
                  <Icon.MapPin className="size-5" />
                </span>
                <div>
                  <span className="block text-sm font-bold text-white">
                    عيادات د. مها دحلان
                  </span>
                  <span className="text-sm text-[var(--color-gls-muted)]">
                    جدة، المملكة العربية السعودية
                  </span>
                </div>
              </motion.li>
              <motion.li variants={fadeUp} className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-2xl border border-[var(--color-gls-line)] bg-[var(--color-gls-primary)]/10 text-[var(--color-gls-primary-dim)]">
                  <Icon.Clock3 className="size-5" />
                </span>
                <div>
                  <span className="block text-sm font-bold text-white">
                    رد سريع
                  </span>
                  <span className="text-sm text-[var(--color-gls-muted)]">
                    نتواصل معكِ خلال ٢٤ ساعة كحد أقصى
                  </span>
                </div>
              </motion.li>
            </motion.ul>
          </div>

          {/* form — left column in RTL */}
          <motion.div variants={fadeUp}>
            <LeadForm />
          </motion.div>
        </motion.section>

        {/* ───── 5 · The G.L.O.W. protocol ───── */}
        <section
          id="protocol"
          data-ambient="#090b0d"
          className="relative overflow-hidden py-24 md:py-32"
        >
          {/* gold bokeh accent — very low opacity, ambient does the rest */}
          <div className="pointer-events-none absolute inset-0 opacity-35">
            <Image
              src="/glass-skin/accent-bokeh.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              aria-hidden
            />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="relative mx-auto max-w-6xl px-5"
          >
            <motion.div variants={fadeUp} className="text-center">
              <SectionEyebrow tokenPrefix="gls" icon="Route">
                بروتوكول الجلسة · ٦٠ دقيقة
              </SectionEyebrow>
              <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                رحلة{" "}
                <span
                  className="gls-gold-text font-[family-name:var(--font-plex-arabic)]"
                >
                  التوهّج
                </span>{" "}
                خطوة بخطوة
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[var(--color-gls-ink-soft)]">
                جلستكِ تمرّ بعدة خطوات مدروسة للعناية بالبشرة وتعزيز نضارتها،
                كل خطوة تُهيّئ بشرتكِ للتي بعدها حتى يكتمل التوهّج الزجاجي.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-14 md:mt-16">
              <ProtocolSteps />
            </motion.div>
          </motion.div>
        </section>

        {/* ───── 6 · Results band ───── */}
        <motion.section
          data-ambient="#0b0c0e"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mx-auto max-w-6xl px-5 py-20 md:py-24"
        >
          <motion.div
            variants={fadeUp}
            className="overflow-hidden rounded-[2rem] border border-[var(--color-gls-line)] bg-gradient-to-b from-[#16181b]/80 to-[#0b0c0e]/40 px-6 py-10 backdrop-blur-sm sm:px-10"
          >
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col items-center text-center ${
                    i < STATS.length - 1
                      ? "md:border-l md:border-[var(--color-gls-line-soft)]"
                      : ""
                  }`}
                >
                  <span className="gls-gold-text font-[family-name:var(--font-plex-arabic)] text-5xl font-semibold">
                    {s.num}
                  </span>
                  <span className="mt-2 text-xs font-bold tracking-normal text-[var(--color-gls-muted)]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-9 border-t border-[var(--color-gls-line-soft)] pt-7 text-center text-sm leading-7 text-[var(--color-gls-ink-soft)]">
              نتيجة تشعرين بها من الجلسة الأولى… وتكتمل وتثبت خلال ثلاث جلسات
              بإشراف طبي كامل.
            </p>
          </motion.div>
        </motion.section>

        {/* ───── 7 · The specialists (slider) ───── */}
        <motion.section
          id="doctor"
          data-ambient="#0e0c0a"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto max-w-6xl px-5 py-24 md:py-32"
        >
          <motion.div variants={fadeUp} className="text-center">
            <SectionEyebrow tokenPrefix="gls" icon="Stethoscope">
              الإشراف الطبي
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              البشرة الزجاجية الكورية{" "}
              <em className="gls-gold-text not-italic">
                في MD Clinics | مجمع عيادات د. مها دحلان
              </em>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[var(--color-gls-ink-soft)]">
              خبرات معتمدة عالمياً تشرف على كل جلسة، لتصلي إلى أنقى نسخة من
              بشرتكِ بلطف وبعلم.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 md:mt-16">
            <DoctorsSlider />
          </motion.div>
        </motion.section>

        {/* ───── 8 · Testimonials ───── */}
        <motion.section
          data-ambient="#0a0b0d"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto max-w-6xl px-5 py-24 md:py-28"
        >
          <motion.div variants={fadeUp} className="text-center">
            <SectionEyebrow tokenPrefix="gls" icon="HeartHandshake">
              قالوا عن التجربة
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              إشراقة يروينها{" "}
              <em className="gls-gold-text not-italic">بأنفسهنّ</em>
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <motion.figure
                key={t.name}
                variants={fadeUp}
                className="flex flex-col rounded-[1.75rem] border border-[var(--color-gls-line-soft)] bg-[#16181b]/70 p-7 backdrop-blur-sm"
              >
                <div className="flex gap-1 text-[var(--color-gls-primary)]" dir="ltr">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon.Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-8 text-[var(--color-gls-ink-soft)]">
                  «{t.text}»
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-gls-line-soft)] pt-4">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-gls-primary)]/12 text-sm font-extrabold text-[var(--color-gls-primary-dim)]">
                    {t.name[0]}
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-white">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-gls-muted)]">
                      {t.city} · جلسة الجلاس سكين
                    </span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>

        {/* ───── 9 · FAQ ───── */}
        <motion.section
          id="faq"
          data-ambient="#0b0c0e"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto max-w-3xl px-5 py-24 md:py-28"
        >
          <motion.div variants={fadeUp} className="text-center">
            <SectionEyebrow tokenPrefix="gls" icon="MessageCircleQuestion">
              أسئلة شائعة
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              كل ما تودّين معرفته
            </h2>
          </motion.div>

          <motion.div variants={stagger} className="mt-10 space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  variants={fadeUp}
                  className={`overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors ${
                    open
                      ? "border-[var(--color-gls-line)] bg-[#16181b]/80"
                      : "border-[var(--color-gls-line-soft)] bg-[#16181b]/45"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                  >
                    <span className="text-sm font-bold text-white sm:text-base">
                      {f.q}
                    </span>
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-gls-line)] text-[var(--color-gls-primary-dim)] transition-transform duration-300 ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      <Icon.Plus className="size-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-5 text-sm leading-8 text-[var(--color-gls-ink-soft)]">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* ───── Footer ───── */}
        <footer className="border-t border-[var(--color-gls-line-soft)] bg-[#060708]/60 py-10 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/glass-skin/logo.webp"
                alt="شعار عيادات د. مها دحلان"
                width={44}
                height={44}
                className="size-11 object-contain"
              />
              <div>
                <span className="block text-sm font-extrabold text-white">
                  عيادات د. مها دحلان
                </span>
                <span
                  className="font-[family-name:var(--font-plex-arabic)] text-[10px] font-semibold tracking-normal text-[var(--color-gls-primary-dim)]"
                >
                  بروتوكول البشرة الزجاجية
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(
                ({ name, label }) => (
                  <a
                    key={name}
                    href="#"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full border border-[var(--color-gls-line-soft)] text-[var(--color-gls-muted)] transition-colors hover:border-[var(--color-gls-primary)] hover:text-[var(--color-gls-primary-dim)]"
                  >
                    <SocialIcon name={name} />
                  </a>
                ),
              )}
            </div>

            <p className="text-center text-xs leading-6 text-[var(--color-gls-muted)]">
              © {new Date().getFullYear()} عيادات د. مها دحلان، جميع الحقوق
              محفوظة
            </p>
          </div>
        </footer>

        {/* spacer so the mobile sticky bar never covers the footer */}
        <div className="h-16 md:hidden" aria-hidden />
      </main>

      {/* ───── Floating CTA (form-only funnel — no WhatsApp) ───── */}
      <GlassStickyCTA bookHref={FORM_ANCHOR} />
    </>
  );
}
