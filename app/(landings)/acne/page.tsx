"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import AcneAnimations from "./_components/AcneAnimations";
import MobileStickyCTA from "./_components/MobileStickyCTA";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z" />
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.237.195-.088.39-.137.584-.137.39 0 .735.21.9.555.165.345.12.735-.12 1.035-.075.09-.195.18-.345.27-.442.272-1.069.472-1.44.596-.105.03-.195.06-.255.09-.015.045-.03.105-.03.165a.734.734 0 0 0 .06.255c.39.78 1.005 1.5 1.785 2.085.405.3.84.54 1.305.72.18.075.36.135.525.195.39.135.63.42.63.735 0 .315-.24.585-.585.705-.345.12-.72.18-1.11.18a4.5 4.5 0 0 1-.615-.045c-.24-.03-.48-.075-.735-.15-.18-.06-.33-.09-.495-.09-.135 0-.27.015-.405.06-.525.18-.87.945-1.365 1.425-.57.555-1.17.855-1.77.855-.105 0-.21-.015-.315-.03-.495-.12-.84-.39-1.17-.66-.39-.315-.795-.645-1.395-.645-.6 0-1.005.33-1.395.645-.33.27-.675.54-1.17.66a1.335 1.335 0 0 1-.315.03c-.6 0-1.2-.3-1.77-.855-.495-.48-.84-1.245-1.365-1.425a1.5 1.5 0 0 0-.405-.06c-.165 0-.315.03-.495.09-.255.075-.495.12-.735.15a4.5 4.5 0 0 1-.615.045c-.39 0-.765-.06-1.11-.18-.345-.12-.585-.39-.585-.705 0-.315.24-.6.63-.735.165-.06.345-.12.525-.195.465-.18.9-.42 1.305-.72.78-.585 1.395-1.305 1.785-2.085a.734.734 0 0 0 .06-.255c0-.06-.015-.12-.03-.165-.06-.03-.15-.06-.255-.09-.371-.124-.998-.324-1.44-.596-.15-.09-.27-.18-.345-.27-.24-.3-.285-.69-.12-1.035.165-.345.51-.555.9-.555.195 0 .39.045.584.137.264.12.624.224.922.237.198 0 .326-.045.401-.09a19.73 19.73 0 0 1-.033-.57c-.104-1.628-.23-3.654.3-4.847C7.86 1.069 11.216.793 12.206.793z" />
  </svg>
);

const heroImages = [
  "/acne/acneshow/img1.jpg",
  "/acne/acneshow/img2.jpg",
  "/acne/acneshow/img3.jpg",
  "/acne/acneshow/img4.jpg",
];

const marqueeWords = [
  "بشرة صافية",
  "•",
  "ليزر متقدم",
  "•",
  "بروتوكول مخصص",
  "•",
  "إشراف طبي",
  "•",
  "نتائج موثّقة",
  "•",
  "تجربة فاخرة",
  "•",
];

const features = [
  {
    title: "تشخيص دقيق",
    desc: "نحلل نوع بشرتك ونحدد الأسباب الجذرية لحب الشباب لوصف العلاج الأنسب.",
    icon: User,
  },
  {
    title: "خطة علاجية مخصصة",
    desc: "لا يوجد علاج واحد يناسب الجميع — نصمم خطة متكاملة تناسب حالتك ونمط حياتك.",
    icon: Sparkles,
  },
  {
    title: "متابعة مستمرة",
    desc: "نرافقك خطوة بخطوة خلال رحلة العلاج لضمان استجابة البشرة وتحقيق النتائج.",
    icon: Clock,
  },
];

const doctors = [
  {
    name: "د. مها دحلان",
    title: "استشارية الجلدية والتجميل والليزر",
    img: "/acne/team/dr-maha.avif",
    quals: [
      "البورد السعودي في طب الأمراض الجلدية والتجميل والليزر",
      "البورد العربي في طب الأمراض الجلدية والتناسلية",
      "ماجستير صحة عامة من جامعة بوسطن",
      "زمالة البرنامج العالمي من جامعة هارفارد للأمراض الجلدية",
    ],
  },
  {
    name: "د. إيناس عبدالعزيز",
    title: "طبيب مقيم الأمراض الجلدية",
    img: "/acne/team/dr-inas.avif",
    quals: [
      "بكالوريوس طب وجراحة عامة - تخصص الجلدية",
      "الدبلوم الأمريكي للجلدية والتجميل والليزر",
    ],
  },
  {
    name: "د. لجين الجرماني",
    title: "نائب الجلدية والتجميل والليزر",
    img: "/acne/team/dr-lajin.avif",
    quals: [
      "البورد السوري في طب الأمراض الجلدية",
      "الدبلوم الأمريكي للجلدية والتجميل والليزر",
    ],
  },
  {
    name: "د. دينا محمد البشير",
    title: "نائب أول جلدية وتجميل وليزر",
    img: "/acne/team/dr-dina.avif",
    quals: [
      "البورد الأمريكي للتجميل والليزر",
      "الزمالة المصرية للأمراض الجلدية",
      "دبلوما ليزر المركز القومي للبحوث",
      "الدبلوما الأمريكية للتجميل النسائي",
    ],
  },
];

const reviews = [
  {
    name: "Fatima Bushra",
    text: "أنصح بشدة بالدكتورة لجين الجرماني لمصداقيتها ومهارتها ولمستها الإبداعية في العلاج.",
    rating: 5,
    date: "قبل يومين",
  },
  {
    name: "Rafika Rafika",
    text: "سعيدة جداً بنتيجة فيلر الشفايف وحقن الإكسوسوم مع الدكتورة إيناس. يدها خفيفة جداً.",
    rating: 5,
    date: "قبل أسبوع",
  },
  {
    name: "Ali Al-Masoudi",
    text: "شكراً للدكتورة مها دحلان على حل مشكلة بنتي الجلدية بسرعة. أنصح بها بشدة.",
    rating: 5,
    date: "قبل شهر",
  },
  {
    name: "Afaf Alsubhi",
    text: "أشكر العيادة على احترافيتها ونتائجها الممتازة. تجربة رائعة من البداية للنهاية.",
    rating: 5,
    date: "قبل أسبوع",
  },
  {
    name: "Ruaa H.",
    text: "من أفضل عيادات الجلدية في المنطقة. الدكتورة مها متمكنة جداً في مجالها وفريقها مدرب على أعلى مستوى.",
    rating: 5,
    date: "قبل شهر",
  },
  {
    name: "Jena S.",
    text: "أنصح بشدة بالدكتورة لجين، رائعة ومتفهمة وصادقة في توصياتها. العلاج اللي وصفته لي خلى بشرتي تنور.",
    rating: 5,
    date: "قبل أسبوعين",
  },
];

const WHATSAPP =
  "https://wa.me/966503377702?text=السلام%20عليكم%20ورحمة%20الله%20وبركاته%0Aعندي%20استفسار%20بخصوص%20علاج%20حب%20الشباب";

export default function AcneLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden text-stone-900 font-sans selection:bg-gold-100 selection:text-gold-900"
    >
      <AcneAnimations scopeRef={containerRef} progressRef={progressRef} />
      <MobileStickyCTA whatsappHref={WHATSAPP} />

      {/* Scroll progress bar */}
      <div ref={progressRef} className="acne-progress" aria-hidden />

      {/* Decorative halos */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          data-parallax="0.1"
          className="acne-halo absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(208,177,108,0.35),transparent_65%)] blur-3xl"
        />
        <div
          data-parallax="0.2"
          className="acne-halo absolute top-1/2 -left-32 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(176,141,70,0.3),transparent_65%)] blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      {/* ────────────── NAV ────────────── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          navScrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-stone-200/60 shadow-sm shadow-stone-900/[0.03] py-1"
            : "bg-transparent py-2"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
            <a
              href="#top"
              className="flex items-center shrink-0"
              aria-label="عيادات د. مها دحلان"
            >
              <Image
                src="/acne/logo.avif"
                alt="عيادات د. مها دحلان"
                width={300}
                height={120}
                priority
                className="h-14 sm:h-20 lg:h-24 w-auto object-contain"
              />
            </a>

            <div className="hidden md:flex items-center gap-1.5">
              {[
                { href: "https://x.com/md_clinics_", Icon: XIcon },
                {
                  href: "https://www.tiktok.com/@md.clinics",
                  Icon: TikTokIcon,
                },
                { href: "https://snapchat.com/t/RI87LsZs", Icon: SnapchatIcon },
                {
                  href: "https://www.instagram.com/md_clinics_",
                  Icon: InstagramIcon,
                },
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-100/80 hover:bg-gold-100 flex items-center justify-center text-stone-500 hover:text-gold-700 transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* CTA: visible on every breakpoint with strong gold contrast */}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="acne-btn-primary !py-2 !px-4 sm:!px-5 text-sm sm:text-base"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span className="hidden sm:inline">احجزي استشارتك</span>
              <span className="sm:hidden">احجزي</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ────────────── HERO ────────────── */}
      <header
        id="top"
        className="relative pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-24 lg:pb-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Image — first on mobile so it reads as the visual hook */}
            <div className="relative order-1 lg:order-2 lg:col-span-6">
              <div className="relative w-full aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-stone-200 shadow-[0_30px_60px_-15px_rgba(61,48,26,0.25)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroImages[heroIndex]}
                      alt="بشرة صافية بعد علاج حب الشباب"
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent" />

                {/* Slide indicator dots */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      aria-label={`عرض الصورة ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === heroIndex
                          ? "w-8 bg-white"
                          : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating glass card */}
              <div
                data-reveal
                className="absolute -bottom-6 -right-3 sm:right-6 lg:-right-8 acne-card p-4 sm:p-5 max-w-[230px] sm:max-w-[280px] shadow-xl shadow-stone-900/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-lg shadow-gold-700/30 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm sm:text-base">
                      نتائج طبية مثبتة
                    </div>
                    <div className="text-xs text-stone-500">
                      أحدث أجهزة الليزر العالمية
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience badge */}
              <div
                data-reveal
                className="hidden sm:flex absolute -top-4 -left-4 lg:-left-10 acne-card !rounded-2xl px-5 py-4 shadow-xl shadow-stone-900/10 items-center gap-3"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-gold-700">
                    <span data-count="20" data-count-suffix="+">0</span>
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    عاماً من الخبرة
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-2 lg:order-1 lg:col-span-6 space-y-6 sm:space-y-8">
              <div
                data-hero-cta
                className="opacity-0 translate-y-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100/70 text-gold-800 text-xs md:text-sm font-semibold border border-gold-200/60 backdrop-blur"
              >
                <Star className="w-3.5 h-3.5 fill-gold-600 text-gold-600" />
                <span>الخيار الأول لعلاج حب الشباب في جدة</span>
              </div>

              <h1
                data-hero-headline
                className="text-[2rem] sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] text-stone-900 tracking-tight"
              >
                استعدّي ثقتكِ ببشرة صافية تنطق بها مرآتك.
              </h1>

              <p
                data-hero-sub
                className="opacity-0 translate-y-3 text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-xl font-light"
              >
                وداعاً لحب الشباب وآثاره — بروتوكول طبي مخصص بأحدث أجهزة
                الليزر، تحت إشراف نخبة استشاريي الجلدية والتجميل في جدة.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <a
                  data-hero-cta
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="acne-btn-primary opacity-0 translate-y-3 !py-4 sm:!py-5 !px-7 sm:!px-9 text-base sm:text-lg"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                  <span>احجزي استشارتك الآن</span>
                </a>

                <button
                  data-hero-cta
                  onClick={() =>
                    document
                      .getElementById("doctors")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="acne-btn-ghost opacity-0 translate-y-3 !py-4 sm:!py-5 !px-7 sm:!px-9 text-base sm:text-lg"
                >
                  <User className="w-5 h-5 text-gold-700" />
                  <span>تعرّفي على أطبائنا</span>
                </button>
              </div>

              {/* Stat strip */}
              <dl className="grid grid-cols-3 gap-4 pt-6 sm:pt-8 max-w-lg">
                {[
                  { label: "تقييم Google", v: "4.8", suffix: "★" },
                  {
                    label: "عميلة سعيدة",
                    v: "1158",
                    suffix: "+",
                    isCount: true,
                  },
                  {
                    label: "سنة خبرة",
                    v: "20",
                    suffix: "+",
                    isCount: true,
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    data-reveal
                    className="border-t border-stone-300/60 pt-3"
                  >
                    <dt className="text-[11px] font-semibold text-stone-500 tracking-widest uppercase">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-black text-2xl sm:text-3xl text-stone-900">
                      {s.isCount ? (
                        <>
                          <span data-count={s.v}>0</span>
                          <span className="text-gold-700">{s.suffix}</span>
                        </>
                      ) : (
                        <>
                          {s.v}
                          <span className="text-gold-700">{s.suffix}</span>
                        </>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </header>

      {/* ────────────── MARQUEE ────────────── */}
      <section className="border-y border-stone-200/60 bg-white/60 py-5 overflow-hidden">
        <div className="acne-marquee whitespace-nowrap font-bold text-2xl sm:text-3xl text-stone-700/80 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 pe-8">
              {marqueeWords.map((w, j) => (
                <span
                  key={`${i}-${j}`}
                  className={
                    w === "•" ? "text-gold-500 text-lg" : "tracking-wide"
                  }
                >
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ────────────── WHY US ────────────── */}
      <section className="relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
            <span data-reveal className="acne-eyebrow">
              لماذا عيادات د. مها دحلان؟
            </span>
            <h2
              data-reveal
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight"
            >
              علم دقيق. لمسة راقية.{" "}
              <span className="text-gold-700">نتائج تتحدث عنكِ.</span>
            </h2>
            <p data-reveal className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed">
              نقدّم أحدث التقنيات والبروتوكولات العلاجية المعتمدة عالمياً —
              مع متابعة شخصية في كل خطوة.
            </p>
          </div>

          <ul
            data-reveal-stagger
            className="grid md:grid-cols-3 gap-5 sm:gap-7"
          >
            {features.map((f) => (
              <li
                key={f.title}
                className="group acne-card p-7 sm:p-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/[0.06]"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200/70 flex items-center justify-center mb-6 ring-1 ring-gold-300/40 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-7 h-7 text-gold-700" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                  {f.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ────────────── DOCTORS ────────────── */}
      <section id="doctors" className="relative py-20 sm:py-28 lg:py-32 bg-white">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
            <div className="max-w-xl">
              <span data-reveal className="acne-eyebrow">
                نخبة أطبائنا
              </span>
              <h2
                data-reveal
                className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight"
              >
                استشاريون لعلاج حب الشباب بكل أنواعه.
              </h2>
            </div>
            <p data-reveal className="text-sm sm:text-base text-stone-600 max-w-md leading-relaxed">
              علاج متقدم لحب الشباب بإشراف أطباء جلدية متخصصين، باستخدام
              تقنيات حديثة تعيد لبشرتك صفاءها بطريقة آمنة وفعّالة.
            </p>
          </div>

          <div
            data-reveal-stagger
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7"
          >
            {doctors.map((doc) => (
              <article
                key={doc.name}
                className="group relative rounded-3xl overflow-hidden bg-stone-50 border border-stone-200/70 flex flex-col h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-700/10"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/45 via-stone-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/85 backdrop-blur text-[10px] font-bold tracking-widest text-gold-800 uppercase border border-white/60">
                    استشاري
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h4 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">
                    {doc.name}
                  </h4>
                  <p className="text-gold-700 text-xs sm:text-sm font-semibold mb-5 pb-4 border-b border-stone-200">
                    {doc.title}
                  </p>
                  <ul className="space-y-2.5 flex-1">
                    {doc.quals.map((qual, i) => (
                      <li
                        key={i}
                        className="flex gap-2 items-start text-xs sm:text-sm text-stone-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── REVIEWS ────────────── */}
      <section className="relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span data-reveal className="acne-eyebrow">
              تقييمات Google
            </span>
            <h2
              data-reveal
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight"
            >
              أكثر من{" "}
              <span data-count="1158" className="text-gold-700">
                0
              </span>{" "}
              تقييم حقيقي.
            </h2>
            <div
              data-reveal
              className="mt-6 inline-flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-md border border-stone-200"
            >
              <svg width="24" height="24" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              <span className="text-xl font-bold text-stone-900">4.8</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            data-reveal-stagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {reviews.map((r, idx) => (
              <article
                key={idx}
                className="acne-card p-5 sm:p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/[0.06]"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-stone-600 mb-5 leading-relaxed text-sm flex-1">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center text-gold-800 font-bold text-sm shrink-0 ring-1 ring-gold-300/40">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900 leading-none mb-0.5">
                        {r.name}
                      </p>
                      <span className="text-xs text-stone-400">{r.date}</span>
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 48 48"
                    className="shrink-0 opacity-40"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                </div>
              </article>
            ))}
          </div>

          <div data-reveal className="flex justify-center mt-12">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="acne-btn-primary"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>احجزي استشارتك الآن</span>
            </a>
          </div>
        </div>
      </section>

      {/* ────────────── CTA ────────────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-stone-900 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000')",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-32 right-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40 bg-[radial-gradient(circle_at_center,rgba(208,177,108,0.5),transparent_60%)]"
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            data-reveal
            className="acne-eyebrow"
            style={{ color: "var(--color-gold-300)" }}
          >
            ابدئي اليوم
          </span>
          <h2
            data-reveal
            className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight"
          >
            لا تدعي حب الشباب يقف بين ثقتكِ ومرآتكِ.
          </h2>
          <p
            data-reveal
            className="mt-6 text-base sm:text-lg lg:text-xl text-stone-300 leading-relaxed max-w-2xl mx-auto"
          >
            احجزي استشارتك المجانية مع نخبة أطباء الجلدية في عيادات د. مها
            دحلان وابدئي رحلتك نحو بشرة صافية ومشرقة.
          </p>

          <div data-reveal className="mt-10">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="acne-btn-primary !py-5 !px-10 text-lg sm:text-xl"
            >
              <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              <span>تحدثي معنا على الواتساب</span>
            </a>
          </div>
        </div>
      </section>

      {/* ────────────── FOOTER ────────────── */}
      <footer className="bg-stone-950 text-stone-400 pt-16 sm:pt-20 pb-28 md:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-14">
            <div className="space-y-5">
              <Image
                src="/acne/logo.avif"
                alt="عيادات د. مها دحلان"
                width={300}
                height={120}
                className="h-20 w-auto object-contain brightness-0 invert"
              />
              <p className="text-sm leading-relaxed">
                العيادة الرائدة في المملكة لتقديم حلول طبية وتجميلية متقدمة
                لعلاج مشاكل البشرة بأعلى معايير الجودة العالمية.
              </p>
              <div className="flex gap-3 pt-2">
                {[
                  {
                    href: "https://www.instagram.com/dr.mahadahlan/",
                    Icon: InstagramIcon,
                  },
                  { href: "https://x.com/drmahadahlan", Icon: XIcon },
                  {
                    href: "https://www.tiktok.com/@dr.mahadahlan",
                    Icon: TikTokIcon,
                  },
                  {
                    href: "https://www.snapchat.com/add/drmahadahlan",
                    Icon: SnapchatIcon,
                  },
                ].map(({ href, Icon }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-stone-800 hover:bg-gold-600 flex items-center justify-center text-stone-400 hover:text-white transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-5 text-white">روابط سريعة</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#doctors" className="hover:text-gold-400 transition">
                    أطباؤنا
                  </a>
                </li>
                <li>
                  <a href="#top" className="hover:text-gold-400 transition">
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-400 transition"
                  >
                    احجزي استشارة
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-5 text-white">تواصلي معنا</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2 items-start">
                  <MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                  جدة، حي الروضة، شارع الأمير محمد بن عبدالعزيز (التحلية)،
                  مركز بن حمران - الدور الثالث
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                  <a
                    href="mailto:info@mahadahlan.com"
                    className="hover:text-gold-400 transition"
                  >
                    info@mahadahlan.com
                  </a>
                </li>
                <li className="flex gap-2 items-start">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <a
                      href="tel:+966920007515"
                      className="hover:text-gold-400 transition"
                      dir="ltr"
                    >
                      +966 920007515
                    </a>
                    <a
                      href="tel:+966503377702"
                      className="hover:text-gold-400 transition"
                      dir="ltr"
                    >
                      +966 503377702
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-5 text-white">ساعات العمل</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between gap-2">
                  <span>السبت - الخميس</span>
                  <span className="text-stone-300">12:00 ظ - 8:00 م</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>الجمعة</span>
                  <span className="text-stone-300">مغلق</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>
              &copy; {new Date().getFullYear()} عيادات د. مها دحلان. جميع
              الحقوق محفوظة.
            </p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-gold-400 transition">
                سياسة الخصوصية
              </a>
              <a href="#" className="hover:text-gold-400 transition">
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
