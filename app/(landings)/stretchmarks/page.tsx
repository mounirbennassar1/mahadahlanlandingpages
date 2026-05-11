"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FadeIn } from "./_components/FadeIn";

const WA =
  "https://wa.me/966503377702?text=مرحباً%20عندي%20استفسار%20عن%20الخدمات%20والأسعار%20(عروض_جوجل)";

/* ─── Hero Slider Images ─── */
const heroSlides = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCy6AfzjNkgpt4m57GqYjo25X0x5QtpOxQVRrFS--AIJOwt61e8e5mYr-P-bWbcHug4hvd9Bh15EHCvN1Q341Wt1_wb5658imBD_ThAFQT0tw2bz88YyFi4awMGxDh3vPSXXktdbEMc21_0elitzffzkJfA4YjkcXI-7EJq4T-6mX4K2Iw1OfzOThRyd91N7J8WiHij2UEvh0gR0wmx4Oh0BqEK-OIhLOqZVGXmYYWJ_HI_mEx_LML9X1UOMga7Fl2nTmqGZqvnsuY3",
    alt: "لقطة قريبة جمالية لملمس البشرة مع ضوء ناعم",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZqt9JbdI8BgBz6USUmAaNhDH3WZFS2_2YgiZALYNyo1LELPE3lXTkwTpd0ZYk1O_cGlNA4dzERPSWCfsK0bIdj2jO5qfcYYgZclFmIpp0XnWwrc7r7VHPwve2buo7iooVMDaBINs_bYJ2AlmnNPMZQESwWwt-HOZPjcv4NfYTtRB9kmnaDrDCwnwh5iONCnn3aZ9H5AT5IwMs5-P3Q-VkoIaNVkmpoR9koVAw4zbODry2O4cZw-zPkgUhiTkwIjMzkEKPfUvDGlQG",
    alt: "بشرة ناعمة ومرطبة",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFDBfTZP-XpHHE3dcWGOW0UDG014vFKbVRwVZ6MIp85mLa0-lIepGetF8x9kPW7s65Xwu3xwOSh5rnccCh2Ywhy3uCocludAVr5MyOfOWc0_ruWqdTz4oK-VbL2Bk25OoISkzRUCnWp_zS-eRWTd1TPi1oIyX5dFtGoL6Z9nxLhNs2rLH4dR3coFyfpndqA0nNOaZbmz0OpKJhfd3NyGE2VoP7rlFcKflm7uAOfXh_9g51B1kFxLigmOYY254WMSJi6MtRFLTmlygV",
    alt: "صورة مقربة لقطرات السيروم",
  },
];

const cases = [
  { image: "/stretchmarks/afterbefore/stratchmark.jpg", afterLabel: "بعد ٣ جلسات", title: "علاج علامات التمدد في البطن" },
  { image: "/stretchmarks/afterbefore/stratchmarkv.jpg", afterLabel: "بعد جلستين", title: "تحسين مرونة جلد الفخذين" },
  { image: "/stretchmarks/afterbefore/stratchmarkv2.jpg", afterLabel: "بعد ٣ جلسات", title: "نتائج ملحوظة على علامات التمدد" },
];

const faqs = [
  { q: "هل العلاج مؤلم؟", a: "يُستخدم تخدير موضعي قبل الجلسة لضمان أقصى درجات الراحة. معظم المريضات يصفن الإحساس بأنه بسيط ومحتمل جداً." },
  { q: "كم عدد الجلسات المطلوبة؟", a: "يتراوح البروتوكول عادةً بين جلستين وأربع جلسات بحسب نوع التشققات وعمقها. يُحدد العدد الدقيق بعد التقييم الأولي." },
  { q: "متى تظهر النتائج؟", a: "تبدأ التحسينات تدريجياً خلال أسابيع قليلة مع استمرار تحفيز الكولاجين، وتصل النتائج ذروتها خلال ثلاثة إلى ستة أشهر." },
  { q: "هل توجد آثار جانبية؟", a: "قد يظهر احمرار أو تورم خفيف يزول خلال يوم أو يومين. لا توجد فترة نقاهة طويلة — يمكنكِ العودة لنشاطاتك اليومية شبه فوراً." },
];

const testimonials = [
  { name: "أم سارة", stars: 5, text: "بعد الولادة كانت التشققات تزعجني كثيراً، جربت كل الكريمات بدون نتيجة. بعد جلستين مع الدكتورة مها لاحظت فرقاً حقيقياً في ملمس الجلد ووضوح التشققات. شكراً من القلب!" },
  { name: "ريم", stars: 5, text: "كنت خايفة من الإجراء بس الدكتورة شرحت كل شيء بتفصيل وحسيت بأمان تام. النتائج بعد ثلاث جلسات فاقت توقعاتي، الجلد صار أنعم وأكثر تجانساً." },
  { name: "نورة", stars: 5, text: "التشققات البيضاء القديمة كانت مستحيلة بالنسبة لي. الدكتورة وضعت لي خطة علاجية محددة وبدأت النتائج تظهر من الشهر الثاني. أنصح كل واحدة تجرب!" },
  { name: "دانة", stars: 5, text: "مركز راقي وطاقم محترف ومتفهم. الجلسة كانت مريحة جداً وما حسيت بألم. النتائج تكلم نفسها — بشرتي صارت أكثر نعومة وانتظاماً بشكل ملحوظ." },
];

export default function StretchmarksLanding() {
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback((dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "left" ? -460 : 460, behavior: "smooth" });
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const smoothScroll = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const [navScrolled, setNavScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavScrolled(y > 20);
      setNavVisible(y < 20 || y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "الأسباب والأنواع" },
    { href: "#treatments", label: "العلاجات" },
    { href: "#results", label: "النتائج" },
    { href: "#testimonials", label: "آراء العملاء" },
    { href: "#contact", label: "تواصلي معنا" },
  ];

  return (
    <>
      {/* ─── شريط التنقل العلوي ─── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          navScrolled
            ? "bg-white/90 dark:bg-rose-950/90 backdrop-blur-xl shadow-md shadow-rose-900/5 py-1"
            : "bg-transparent py-3"
        } ${navVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center justify-between px-6 md:px-8 max-w-screen-2xl mx-auto">
          <a href="#" className="flex items-center gap-3 shrink-0">
            <div className="relative w-[180px] h-[70px] md:w-[220px] md:h-[82px]">
              <Image src="/stretchmarks/logo.avif" alt="الشعار" fill className="object-contain" priority />
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 font-headline tracking-wide">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => smoothScroll(link.href)}
                className="relative text-on-surface-variant hover:text-primary transition-colors duration-300 text-sm after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label text-sm tracking-wider hover:bg-primary-dim transition-all duration-200 active:scale-95"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
              احجزي استشارة
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="القائمة"
            >
              <span className={`block h-0.5 w-6 bg-on-surface rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-on-surface rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-on-surface rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-primary/95 backdrop-blur-xl border-t border-on-primary/10"
            >
              <div className="flex flex-col px-8 py-6 gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => { setMobileOpen(false); smoothScroll(link.href); }}
                    className="text-right text-white/90 font-headline text-lg py-2 border-b border-white/10 hover:text-primary-container hover:pr-2 transition-all duration-300 ease-out"
                  >
                    {link.label}
                  </button>
                ))}
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-label text-sm font-bold tracking-wider mt-2 hover:bg-primary-container transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                  احجزي استشارة مجانية
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── قسم البطل مع سلايدر ─── */}
      <header className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4IOAQfeIwFM-H83NG5JV-uwqa3a7z16hZFwpZ_dETN58iai2jBVcJjo1MTVk5M28G9gqI9ea-IbnCpoir-VjL3pUyewvkUuFnFp0wY5gpMPcKvD1lcGZY0vtfyZSKuc-Y6HXFTYo9Gceb5TXENcTGwb0Kqw91cU32F74i0tixccFWDp2OFBBB4ZGRt-iHDJuyHCss35IR9JkL-3C4td18CT9UUxMKjUr0r_yEbiO46dCk9ItI_D6EpDddtYpLRpF6grXXJTEpNuDx"
            alt="بشرة متوهجة وصحية"
            fill priority
            className="object-cover opacity-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#faf9f6]/70 via-[#faf9f6]/30 to-transparent" />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn className="text-right order-2 lg:order-1">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-6 border border-primary/20">
                علاج طبي متخصص
              </span>
              <h1 className="text-5xl md:text-7xl font-headline text-on-background leading-tight mb-8">
                علاج التشققات <br />
                <span className="font-light opacity-80 text-primary">وعلامات التمدد</span>
              </h1>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-12 font-body max-w-lg">
                تشققات الجلد ليست قدرًا دائمًا — مع الخطة العلاجية الصحيحة، يمكن تحسين بنية الجلد من الداخل واستعادة مظهره الطبيعي بشكل حقيقي وتدريجي.
              </p>
              <div className="flex flex-col sm:flex-row-reverse gap-6">
                <a className="inline-flex items-center justify-center gap-3 bg-primary text-on-primary px-10 py-5 rounded-full text-lg font-medium hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300" href={WA} target="_blank" rel="noopener noreferrer">
                  <span>احجزي استشارتك الآن</span>
                  <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                </a>
                <button onClick={() => smoothScroll("#about")} className="inline-flex items-center justify-center gap-3 border border-outline-variant text-primary px-10 py-5 rounded-full text-lg font-medium hover:bg-white transition-all duration-300">
                  اكتشفي المزيد
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="order-1 lg:order-2 flex justify-center lg:justify-start">
              <div className="relative w-[340px] h-[460px] md:w-[400px] md:h-[520px]">
                <div className="absolute -inset-4 rounded-[2.5rem] border-2 border-primary/20 pointer-events-none" />
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroIndex}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image src={heroSlides[heroIndex].src} alt={heroSlides[heroIndex].alt} fill className="object-cover" />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroSlides.map((_, i) => (
                    <button key={i} onClick={() => setHeroIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === heroIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
                      aria-label={`عرض الصورة ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="absolute -top-6 -right-6 backdrop-blur-md bg-white/60 p-5 rounded-2xl border border-white/50 shadow-lg">
                  <p className="text-primary font-headline text-2xl mb-0.5">٩٠٪</p>
                  <p className="text-on-surface-variant text-xs font-body leading-tight max-w-[130px]">من الحالات تستجيب إيجابياً للعلاج</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      </header>

      {/* ─── أسباب وأنواع التشققات ─── */}
      <section className="py-24 bg-surface-container-low overflow-hidden" id="about">
        <div className="container mx-auto px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20">الفهم أول خطوة للعلاج</span>
            <h2 className="text-4xl md:text-5xl font-headline text-on-background mb-6">أسباب وأنواع التشققات</h2>
            <p className="text-lg text-on-surface-variant leading-loose font-body">
              تشققات الجلد تظهر نتيجة تمدد سريع يفوق قدرة الجلد على إنتاج الكولاجين والإيلاستين. تحدث غالبًا بسبب الحمل، تغيّرات الوزن، البلوغ، التمارين المكثفة، أو التغيرات الهرمونية.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn className="relative">
              <div className="organic-shape w-full aspect-square bg-white shadow-xl shadow-primary/5 overflow-hidden relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy6AfzjNkgpt4m57GqYjo25X0x5QtpOxQVRrFS--AIJOwt61e8e5mYr-P-bWbcHug4hvd9Bh15EHCvN1Q341Wt1_wb5658imBD_ThAFQT0tw2bz88YyFi4awMGxDh3vPSXXktdbEMc21_0elitzffzkJfA4YjkcXI-7EJq4T-6mX4K2Iw1OfzOThRyd91N7J8WiHij2UEvh0gR0wmx4Oh0BqEK-OIhLOqZVGXmYYWJ_HI_mEx_LML9X1UOMga7Fl2nTmqGZqvnsuY3"
                  alt="بشرة صحية" fill className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="text-right space-y-8">
              <p className="text-on-surface-variant leading-loose font-body">
                تمرّ التشققات بمرحلتين أساسيتين — والفارق بينهما مهم جداً لأنه يحدد آلية العلاج وخطته.
              </p>
              <div className="space-y-6">
                <div className="p-8 bg-white/70 rounded-2xl border-r-4 border-primary/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-rose-400 block" />
                    <h3 className="text-xl font-bold text-primary">التشققات الحمراء أو الوردية</h3>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    <span className="font-semibold text-on-surface">التشققات الجديدة</span> — تكون في بدايتها، لا تزال تحمل تروية دموية نشطة، وتستجيب للعلاج بشكل أسرع وأعمق.
                  </p>
                </div>
                <div className="p-8 bg-white/70 rounded-2xl border-r-4 border-outline-variant/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-stone-300 block" />
                    <h3 className="text-xl font-bold text-on-surface">التشققات البيضاء</h3>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    <span className="font-semibold text-on-surface">التشققات القديمة</span> — فقدت لونها وأصبحت أعمق وأكثر وضوحاً. تتطلب تقنيات متطورة لإعادة بناء الألياف الداعمة داخل الجلد.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {["الحمل والولادة", "تغيّرات الوزن", "مرحلة البلوغ", "التغيرات الهرمونية"].map((cause) => (
                  <div key={cause} className="flex items-center gap-2 text-on-surface-variant text-sm">
                    <span className="material-symbols-outlined text-primary/60 text-base">check_circle</span>
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── كيف نعالج التشققات؟ ─── */}
      <section className="py-24 bg-white" id="treatments">
        <div className="container mx-auto px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20">أحدث التقنيات الطبية</span>
            <h2 className="text-4xl md:text-5xl font-headline text-on-background mb-6">كيف نعالج التشققات؟</h2>
            <p className="text-on-surface-variant font-body leading-loose">
              علاج التشققات لا يعتمد على كريمات سطحية فقط، بل على إعادة تحفيز الجلد من الداخل لتعويض النقص في الكولاجين وإعادة بناء الألياف المتضررة.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <FadeIn delay={0.1} className="md:col-span-8 bg-surface-container-low rounded-[3rem] p-12 relative overflow-hidden group min-h-[400px]">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <span className="text-primary font-label text-sm tracking-widest mb-4 block">الخيار الأول</span>
                  <h3 className="text-3xl font-headline text-on-background mb-4">الفيلر الهجين المحفّز للكولاجين</h3>
                  <p className="text-on-surface-variant leading-relaxed text-base mb-6 max-w-md">
                    يجمع بين الامتلاء الفوري وتحفيز إنتاج الكولاجين تدريجياً. يملأ الفراغات الناتجة عن التمدد ويحسن مرونة الجلد وسماكته على المدى الطويل.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {["نتائج فورية", "تأثير طويل الأمد", "محفّز طبيعي للكولاجين"].map((tag) => (
                      <span key={tag} className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-body border border-primary/20">{tag}</span>
                    ))}
                  </div>
                </div>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-primary text-on-primary px-7 py-3 rounded-full text-sm font-medium hover:bg-primary-dim transition-all w-fit">
                  <span>استفسري عن هذا العلاج</span>
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                </a>
              </div>
              <Image src={heroSlides[2].src} alt="صورة العلاج" fill className="object-cover opacity-15 group-hover:scale-110 transition-transform duration-700" />
            </FadeIn>

            <FadeIn delay={0.2} className="md:col-span-4 bg-secondary-container/30 rounded-[3rem] p-10 flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
              </div>
              <span className="text-on-surface-variant text-xs mb-2 block">الخيار الثاني</span>
              <h3 className="text-2xl font-headline text-on-surface mb-4">فيلر الكالسيوم</h3>
              <p className="text-on-surface-variant text-sm leading-loose">
                يعمل كداعم هيكلي يعيد سماكة الجلد ويحسّن مرونته على المدى المتوسط والطويل. يُحفّز إنتاج الكولاجين بشكل طبيعي من العمق.
              </p>
            </FadeIn>

            <FadeIn delay={0.3} className="md:col-span-4 bg-primary/5 rounded-[3rem] p-10 border border-primary/10">
              <h3 className="text-xl font-headline text-primary mb-4">الدمج الذكي للتقنيات</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                يمكن دمج الخيارات العلاجية مع تقنيات تحفيز أخرى حسب تقييم الحالة. الخطة تُصمم حسب نوع التشققات، عمقها، والمنطقة المعالجة.
              </p>
              <div className="h-40 bg-white/40 rounded-2xl overflow-hidden relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYEleiSyypQFdMf5I2QU_nKbIZhZioBUCHwKFy-JOjG_hU4rSGpNh9R27_PBMQ3mb4RvEiNBDVU98_wqMEBpou0ooFtPD6IGeCRZtL9tMueyleeSJvAmC8FJ9zZMa8M2KF0sYfxHTPljVZ-47F0_q8HSKqmeK_h9rn6Rt6GN-ogNQ9_KNAcGv7HBYbMC9AIXY6ORKJPbgOr_mk9l2g1Mag9rZzfkt7NHbd08PnKHySZDnUgpfPj_AUTLpomaeoY6cUL2jj9XtzH-n5" alt="علم الجلد" fill className="object-cover opacity-60" />
              </div>
            </FadeIn>

            <FadeIn delay={0.4} className="md:col-span-8 bg-surface-container-highest rounded-[3rem] p-12 flex items-center gap-10">
              <div className="flex-1">
                <span className="text-primary font-label text-sm tracking-widest mb-2 block">كيف يعمل؟</span>
                <h3 className="text-2xl font-headline text-on-surface mb-4">من الداخل إلى الخارج</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  على عكس الكريمات، تعمل هذه العلاجات على طبقة الأدمة مباشرة — تملأ الفراغات، تحفّز الكولاجين، وتعيد بناء الألياف المتضررة لمنح الجلد سماكة وحيوية من العمق.
                </p>
                <div className="flex items-center gap-3 text-primary text-sm font-body">
                  <span className="material-symbols-outlined text-base">info</span>
                  <span>يُحدد البروتوكول المناسب خلال جلسة تقييم مجانية</span>
                </div>
              </div>
              <div className="hidden sm:block w-48 h-48 bg-white rounded-full p-2 rotate-12 relative flex-shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 relative">
                  <Image src={heroSlides[1].src} alt="بشرة ناعمة" fill className="object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── نتائجنا (قبل وبعد) ─── */}
      <section className="py-24 bg-surface-container-low overflow-hidden" id="results">
        <div className="container mx-auto px-8">
          <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-right">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20">نتائج موثوقة</span>
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20 mr-2">نتائج حقيقية</span>
              <h2 className="text-4xl md:text-5xl font-headline text-on-background mb-4">نتائجنا (قبل وبعد)</h2>
              <p className="text-on-surface-variant font-body">نتائج مضمونة وموثوقة لمريضات حقيقيات – بدون تعديل أو فلتر.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => scroll("right")} className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button onClick={() => scroll("left")} className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            </div>
          </FadeIn>
          <div ref={carouselRef} className="flex gap-8 overflow-x-auto pb-10 snap-x no-scrollbar scroll-smooth" style={{ scrollSnapType: "x mandatory" }}>
            {cases.map((c, i) => (
              <div key={i} className="min-w-[320px] md:min-w-[450px] snap-start shrink-0">
                <FadeIn delay={i * 0.15} className="bg-white p-4 rounded-[2rem] shadow-sm">
                  <div className="relative h-[400px] rounded-[1.5rem] overflow-hidden mb-6">
                    <Image src={c.image} alt={c.title} fill className="object-cover" />
                    <span className="absolute bottom-4 left-4 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">قبل</span>
                    <span className="absolute bottom-4 right-4 bg-primary/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">{c.afterLabel}</span>
                  </div>
                  <h4 className="text-xl font-headline text-center text-on-surface">{c.title}</h4>
                </FadeIn>
              </div>
            ))}
            <div className="min-w-[320px] snap-start shrink-0 flex items-center justify-center p-8 bg-primary/10 rounded-[2rem] border-2 border-dashed border-primary/20">
              <div className="text-center">
                <p className="font-headline text-2xl text-primary mb-4">انضمي لهنّ</p>
                <p className="text-on-surface-variant text-sm mb-6">احصلي على استشارتك اليوم وابدئي رحلتك</p>
                <a className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-medium hover:bg-primary-dim transition-all" href={WA} target="_blank" rel="noopener noreferrer">احجزي موعدك الأول</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── النتائج المتوقعة ─── */}
      <section className="py-24 relative overflow-hidden" id="expected">
        <div className="container mx-auto px-8 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20">ليست نتائج مؤقتة</span>
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20 mr-2">ليس إخفاءً مؤقتاً</span>
            <h2 className="text-4xl md:text-5xl font-headline text-on-background mb-6">النتائج المتوقعة</h2>
            <p className="text-on-surface-variant font-body leading-loose">
              الهدف ليس <span className="bg-primary/10 px-2 py-0.5 rounded">علاج مؤقت</span> بل تحسين حقيقي في بنية الجلد. تظهر النتائج تدريجياً خلال أسابيع، وتتحسن مع الوقت مع استمرار إنتاج الكولاجين.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: "texture", title: "تقليل عمق التشققات", desc: "دمج العلامات مع الجلد المحيط لجعلها أقل وضوحاً بشكل ملحوظ." },
              { icon: "gesture", title: "تحسن ملمس الجلد", desc: "نعومة ملموسة وتحسن واضح في جودة سطح بشرتك." },
              { icon: "straighten", title: "توحيد المظهر العام", desc: "مظهر أكثر تجانساً وطبيعية في المنطقة المعالجة." },
              { icon: "layers", title: "زيادة سماكة الجلد", desc: "تحفيز الكولاجين يعيد بناء الطبقات الداخلية ويمنحها مرونة وقوة." },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 0.1} className="group bg-white/60 p-8 rounded-3xl border border-outline-variant/20 hover:shadow-lg transition-shadow">
                <div className="mb-5 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <span className="material-symbols-outlined text-2xl text-primary">{r.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">{r.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{r.desc}</p>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="bg-white/60 rounded-3xl p-10 border border-outline-variant/20">
            <h3 className="text-2xl font-headline text-on-background mb-8 text-center">الجدول الزمني للنتائج</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { period: "الأسابيع الأولى", title: "تحسن مبكر", desc: "يبدأ الجلد في استعادة نضارته، ويظهر تحسن في الملمس بشكل تدريجي." },
                { period: "١–٣ أشهر", title: "نتائج واضحة", desc: "يواصل الكولاجين إنتاجه، وتبدو التشققات أقل عمقاً ووضوحاً بشكل ملحوظ." },
                { period: "٣–٦ أشهر", title: "النتيجة الكاملة", desc: "تكتمل النتائج مع حصول الجلد على سماكة أفضل ومظهر أكثر تجانساً وطبيعية." },
              ].map((t, i) => (
                <div key={i} className="relative text-right pr-6 border-r-2 border-primary/30">
                  <span className="text-primary text-xs font-bold tracking-widest block mb-1">{t.period}</span>
                  <h4 className="text-lg font-headline text-on-surface mb-2">{t.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* ─── الأسئلة الشائعة ─── */}
      <section className="py-24 bg-surface-container-low" id="faq">
        <div className="container mx-auto px-8 max-w-4xl">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20">لديكِ أسئلة؟</span>
            <h2 className="text-4xl md:text-5xl font-headline text-on-background">الأسئلة الأكثر شيوعاً</h2>
          </FadeIn>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-right bg-white rounded-2xl px-8 py-6 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg font-headline text-on-surface">{faq.q}</span>
                  <span className={`material-symbols-outlined text-primary transition-transform duration-300 flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>expand_more</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/60 rounded-b-2xl -mt-2 px-8 py-6 text-right">
                        <p className="text-on-surface-variant leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── آراء العملاء ─── */}
      <section className="py-24 bg-white" id="testimonials">
        <div className="container mx-auto px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-label text-sm tracking-widest mb-4 border border-primary/20">آراء حقيقية</span>
            <h2 className="text-4xl md:text-5xl font-headline text-on-background mb-4">ماذا قالت عميلاتنا؟</h2>
            <p className="text-on-surface-variant font-body">نجاحنا يُقاس بابتسامة كل مريضة خرجت من عيادتنا بثقة أعلى.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1} className="bg-surface-container-low rounded-3xl p-7 text-right">
                <div className="flex gap-1 justify-end mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="text-primary text-lg">★</span>
                  ))}
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <p className="font-headline text-on-surface text-base">{t.name}</p>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-12 text-center">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-outline-variant text-on-surface-variant px-8 py-3 rounded-full text-sm hover:bg-surface-container-low transition-colors"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-base text-[#25D366]" />
              <span>احجزي استشارتك الآن</span>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ─── خريطة جوجل ─── */}
      <section className="py-16 bg-surface-container-low" id="location">
        <div className="container mx-auto px-8">
          <FadeIn className="text-right mb-10">
            <h2 className="text-3xl font-headline text-on-background mb-2">موقعنا</h2>
            <a
              href="https://maps.google.com/maps?q=جدة+المملكة+العربية+السعودية"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              جدة، المملكة العربية السعودية — افتح في خرائط جوجل
            </a>
          </FadeIn>
          <FadeIn className="rounded-3xl overflow-hidden shadow-lg border border-outline-variant/20 h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.0804413060747!2d39.18424787601!3d21.485811180222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01fb0e53b81%3A0xaee66e9a84a8e45c!2z2KzYr9mI!5e0!3m2!1sar!2ssa!4v1711480000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="موقع عيادة د. مها دحلان"
            />
          </FadeIn>
        </div>
      </section>

      {/* ─── قسم الدعوة للعمل ─── */}
      <section className="py-24 px-8">
        <FadeIn className="max-w-6xl mx-auto bg-primary rounded-[4rem] p-12 md:p-20 relative overflow-hidden text-center text-on-primary">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline mb-8">هل أنتِ جاهزة لبداية جديدة؟</h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto leading-relaxed">
              نحن هنا لنرافقك في رحلة استعادة جمالك الطبيعي. استشارة خاصة ومجانية بانتظارك.
            </p>
            <p className="text-sm opacity-70 mb-12">بدون التزامات — فقط احجزي واكتشفي الخيار المناسب لكِ.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a className="text-primary bg-white px-12 py-5 rounded-full text-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg" href={WA} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} className="text-2xl text-[#25D366]" />
                <span>تحدثي معنا على واتساب</span>
              </a>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </FadeIn>
      </section>

      {/* ─── زر واتساب العائم ─── */}
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] group"
        aria-label="تواصل عبر واتساب"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />
        <span className="relative flex items-center gap-3 bg-[#25D366] text-white pl-5 pr-4 py-3 rounded-full shadow-xl shadow-[#25D366]/30 hover:shadow-2xl hover:shadow-[#25D366]/40 hover:scale-105 transition-all duration-300">
          <span className="hidden sm:inline text-sm font-bold">تحدثي معنا</span>
          <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
        </span>
      </a>

      {/* ─── التذييل ─── */}
      <footer className="w-full rounded-t-[3rem] mt-0 bg-rose-50 dark:bg-neutral-900" id="contact">
        <div className="bg-primary/5 border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary font-headline text-xl font-bold">٤.٩</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-primary text-lg">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-on-surface-variant text-sm">تقييمات Google من عميلات حقيقيات</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary/30 text-primary px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-base">star_rate</span>
              اقرئي جميع التقييمات
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <div className="relative w-[200px] h-[120px] mb-6">
              <Image src="/stretchmarks/logo.avif" alt="الشعار" fill className="object-contain" />
            </div>
            <p className="text-rose-800/60 dark:text-rose-400/60 text-sm font-body leading-relaxed mb-4">
              د. مها دحلان — متخصصة في علاج التشققات وعلامات التمدد بأحدث التقنيات الطبية العالمية.
            </p>
            <p className="text-rose-800/40 dark:text-rose-400/40 text-xs font-body leading-relaxed">
              جدة، المملكة العربية السعودية
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-rose-900 dark:text-rose-100 font-bold mb-4">الخدمات</h4>
            <ul className="space-y-2 text-rose-800/60 dark:text-rose-400/60 text-sm">
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#treatments">علاج التشققات</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#treatments">الفيلر الهجين المحفّز للكولاجين</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#treatments">فيلر الكالسيوم</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#results">نتائجنا</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-rose-900 dark:text-rose-100 font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-rose-800/60 dark:text-rose-400/60 text-sm">
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#about">الأسباب والأنواع</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#testimonials">تجارب العملاء</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#faq">الأسئلة الشائعة</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#location">موقعنا</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#">من نحن</a></li>
              <li><a className="hover:underline decoration-rose-200 underline-offset-4" href="#">الشروط والأحكام</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-rose-900 dark:text-rose-100 font-bold mb-4">تواصلي معنا</h4>
            <div className="flex items-center gap-2 text-rose-800/60 dark:text-rose-400/60 text-sm">
              <span className="material-symbols-outlined text-rose-900/40">location_on</span>
              <span>جدة، المملكة العربية السعودية</span>
            </div>
            <div className="flex items-center gap-2 text-rose-800/60 dark:text-rose-400/60 text-sm">
              <span className="material-symbols-outlined text-rose-900/40">phone</span>
              <span dir="ltr">+966 50 337 7702</span>
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm mt-2 hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
              <span>واتساب</span>
            </a>
            <div className="flex items-center gap-2 mt-3 bg-white/60 dark:bg-white/10 rounded-xl px-4 py-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-primary text-sm">★</span>
                ))}
              </div>
              <span className="text-rose-800/50 dark:text-rose-400/50 text-xs">٤.٩ على Google</span>
            </div>
          </div>
        </div>
        <div className="text-center py-8 border-t border-rose-900/5 text-rose-800/40 text-xs flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>© ٢٠٢٦ عيادات د. مها دحلان. جميع الحقوق محفوظة.</span>
          <span className="hidden sm:inline">|</span>
          <span>الشريك الإبداعي</span>
        </div>
      </footer>
    </>
  );
}
