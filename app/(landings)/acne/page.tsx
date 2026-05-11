'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, User, Phone, MapPin, Clock, Mail } from 'lucide-react';

/* ─────────────────── Google Ads conversion helper ─────────────────── */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Exposed for any client-side button handler that wants to report a
// conversion before navigating away. Currently unused in the page body —
// kept to mirror the source landing's tracking contract.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtagReportConversion(url?: string) {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-10989762778/BiufCP7R5IUcENrxqfgo",
      event_callback: () => {
        if (url) window.location.href = url;
      },
    });
  } else if (url) {
    window.location.href = url;
  }
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z" />
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.237.195-.088.39-.137.584-.137.39 0 .735.21.9.555.165.345.12.735-.12 1.035-.075.09-.195.18-.345.27-.442.272-1.069.472-1.44.596-.105.03-.195.06-.255.09-.015.045-.03.105-.03.165a.734.734 0 0 0 .06.255c.39.78 1.005 1.5 1.785 2.085.405.3.84.54 1.305.72.18.075.36.135.525.195.39.135.63.42.63.735 0 .315-.24.585-.585.705-.345.12-.72.18-1.11.18a4.5 4.5 0 0 1-.615-.045c-.24-.03-.48-.075-.735-.15-.18-.06-.33-.09-.495-.09-.135 0-.27.015-.405.06-.525.18-.87.945-1.365 1.425-.57.555-1.17.855-1.77.855-.105 0-.21-.015-.315-.03-.495-.12-.84-.39-1.17-.66-.39-.315-.795-.645-1.395-.645-.6 0-1.005.33-1.395.645-.33.27-.675.54-1.17.66a1.335 1.335 0 0 1-.315.03c-.6 0-1.2-.3-1.77-.855-.495-.48-.84-1.245-1.365-1.425a1.5 1.5 0 0 0-.405-.06c-.165 0-.315.03-.495.09-.255.075-.495.12-.735.15a4.5 4.5 0 0 1-.615.045c-.39 0-.765-.06-1.11-.18-.345-.12-.585-.39-.585-.705 0-.315.24-.6.63-.735.165-.06.345-.12.525-.195.465-.18.9-.42 1.305-.72.78-.585 1.395-1.305 1.785-2.085a.734.734 0 0 0 .06-.255c0-.06-.015-.12-.03-.165-.06-.03-.15-.06-.255-.09-.371-.124-.998-.324-1.44-.596-.15-.09-.27-.18-.345-.27-.24-.3-.285-.69-.12-1.035.165-.345.51-.555.9-.555.195 0 .39.045.584.137.264.12.624.224.922.237.198 0 .326-.045.401-.09a19.73 19.73 0 0 1-.033-.57c-.104-1.628-.23-3.654.3-4.847C7.86 1.069 11.216.793 12.206.793z" />
  </svg>
);

const heroImages = [
  "/acne/acneshow/img1.jpg",
  "/acne/acneshow/img2.jpg",
  "/acne/acneshow/img3.jpg",
  "/acne/acneshow/img4.jpg",
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AcneLanding() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const whatsappLink = `https://wa.me/966503377702?text=السلام%20عليكم%20ورحمة%20الله%20وبركاته%0Aعندي%20استفسار%20بخصوص%20علاج%20حب%20الشباب`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans overflow-x-hidden selection:bg-gold-100 selection:text-gold-900">
      {/* Floating WhatsApp Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 left-8 z-50 w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-600 transition-colors group"
      >
        <WhatsAppIcon className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-white text-gold-900 px-4 py-2 rounded-xl shadow-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-stone-100">
          تحدث معنا الآن
        </span>
      </motion.a>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl z-50 border-b border-stone-200/50">
        <motion.div
          className="absolute top-0 left-0 h-1 bg-gold-600 z-50"
          style={{ width: `${scrollProgress}%` }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/acne/logo.avif" alt="عيادات د. مها دحلان" className="h-32 w-auto object-contain" />
            </div>
            {/* Social Media Icons */}
            <div className="flex items-center gap-1">
              <a href="https://x.com/md_clinics_?s=21&t=FpQH2SlyziT0Q1AQPVRqfQ" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-100 hover:bg-gold-100 flex items-center justify-center text-stone-500 hover:text-gold-700 transition-all duration-300 hover:scale-110">
                <XIcon className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@md.clinics?_t=ZS-8wlSeJliaLx&_r=1" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-100 hover:bg-gold-100 flex items-center justify-center text-stone-500 hover:text-gold-700 transition-all duration-300 hover:scale-110">
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a href="https://snapchat.com/t/RI87LsZs" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-100 hover:bg-gold-100 flex items-center justify-center text-stone-500 hover:text-gold-700 transition-all duration-300 hover:scale-110">
                <SnapchatIcon className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/md_clinics_?igsh=MXNjbGt5bXEzNjgwcg==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-100 hover:bg-gold-100 flex items-center justify-center text-stone-500 hover:text-gold-700 transition-all duration-300 hover:scale-110">
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-gold-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gold-700 transition-colors shadow-sm hover:shadow-md"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>احجز استشارتك الآن</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold-200 rounded-full mix-blend-multiply filter blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 -left-40 w-[500px] h-[500px] bg-gold-300 rounded-full mix-blend-multiply filter blur-[100px]"
          />
        </div>

        <section className="relative z-10 pt-24 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Slider - First on Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative order-1 lg:order-2"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gold-100 rounded-full blur-3xl opacity-60 animate-pulse" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-200 rounded-full blur-3xl opacity-60 animate-pulse delay-700" />

              <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-stone-200 group">
                <AnimatePresence mode="wait">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <motion.img
                    key={currentImageIndex}
                    src={heroImages[currentImageIndex]}
                    alt="بشرة صافية"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Floating Glass Card */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -bottom-6 -right-4 md:right-10 bg-white/90 backdrop-blur-2xl p-5 md:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl border border-white/50 max-w-[220px] md:max-w-[280px] z-20"
              >
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gold-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-gold-600/20">
                      <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-base md:text-lg">نتائج طبية</div>
                      <div className="text-xs md:text-sm text-stone-500 font-medium">مثبتة علمياً</div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                    نستخدم أحدث أجهزة الليزر والتقنيات العلاجية لضمان اختفاء الحبوب للأبد.
                  </p>
                </div>
              </motion.div>

              {/* Floating Experience Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 md:-left-12 bg-white/90 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-xl border border-stone-100 hidden sm:block z-20"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-gold-600">+20</div>
                  <div className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-widest">عاماً من الخبرة</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content - Second on Mobile */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              className="space-y-8 lg:space-y-10 order-2 lg:order-1"
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100/50 text-gold-800 text-xs md:text-sm font-semibold border border-gold-200/50 backdrop-blur-sm"
              >
                <Star className="w-3 h-3 md:w-4 md:h-4 fill-gold-600 text-gold-600" />
                <span>الخيار الأول لعلاج حب الشباب في جدة</span>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.2] lg:leading-[1.1] text-stone-900 tracking-tight">
                  استعد <span className="text-gold-600 relative inline-block">
                    ثقتك
                    <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-gold-200/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span> بجمال بشرتك الصافية
                </h1>
                <p className="text-lg md:text-2xl text-stone-600 leading-relaxed max-w-xl font-light">
                  وداعاً لحب الشباب وآثاره مع أحدث التقنيات الطبية العالمية وبإشراف نخبة من استشاريي الجلدية.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-2 md:pt-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-3 bg-gold-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all hover:bg-gold-700 hover:shadow-[0_20px_50px_rgba(150,117,58,0.3)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <WhatsAppIcon className="w-6 h-6 md:w-7 md:h-7" />
                  <span>احجز استشارتك الآن</span>
                </a>

                <button
                  onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-3 bg-white text-stone-900 px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-lg md:text-xl border border-stone-200 hover:bg-stone-50 transition-all"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6 text-gold-600" />
                  <span>تعرّف على أطبائنا</span>
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">اسحب للأسفل</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-stone-200 rounded-full flex justify-center p-1"
            >
              <div className="w-1 h-2 bg-gold-600 rounded-full" />
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">لماذا تختار عيادات د. مها دحلان؟</h2>
            <p className="text-lg text-stone-600">نقدم لك أحدث التقنيات والبروتوكولات العلاجية المعتمدة عالمياً لضمان أفضل النتائج.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "تشخيص دقيق",
                desc: "نقوم بتحليل نوع بشرتك وتحديد الأسباب الجذرية لحب الشباب لوصف العلاج الأنسب.",
                icon: <User className="w-8 h-8 text-gold-600" />
              },
              {
                title: "خطة علاجية مخصصة",
                desc: "لا يوجد علاج واحد يناسب الجميع، لذا نصمم خطة متكاملة تناسب حالتك ونمط حياتك.",
                icon: <CheckCircle2 className="w-8 h-8 text-gold-600" />
              },
              {
                title: "متابعة مستمرة",
                desc: "نرافقك خطوة بخطوة خلال رحلة العلاج لضمان استجابة بشرتك وتحقيق النتائج المرجوة.",
                icon: <Clock className="w-8 h-8 text-gold-600" />
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-4">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-50/50 -z-10 skew-x-12 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.p variants={fadeIn} className="text-gold-600 font-bold mb-4 uppercase text-sm tracking-widest">
              أطباؤنا
            </motion.p>
            <motion.p variants={fadeIn} className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 mb-6 leading-relaxed">
              نخبة من أطباء الجلدية والتجميل والليزر في جدة
            </motion.p>
            <motion.p variants={fadeIn} className="text-stone-600">
              علاج متقدم لحب الشباب بجميع أنواعه في عيادات د. مها دحلان، بإشراف أطباء جلدية متخصصين وتقنيات حديثة تساعد على استعادة صفاء بشرتك بطريقة آمنة وفعالة.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              {
                name: "د. مها دحلان",
                title: "استشارية الجلدية والتجميل والليزر",
                img: "/acne/team/dr-maha.avif",
                quals: [
                  "البورد السعودي في طب الأمراض الجلدية والتجميل والليزر",
                  "البورد العربي في طب الأمراض الجلدية والتناسلية",
                  "ماجستير صحة عامة من جامعة بوسطن",
                  "زمالة البرنامج العالمي من جامعة هارفارد للأمراض الجلدية",
                ]
              },
              {
                name: "د. إيناس عبدالعزيز",
                title: "طبيب مقيم الأمراض الجلدية",
                img: "/acne/team/dr-inas.avif",
                quals: [
                  "بكالوريوس طب وجراحة عامة - تخصص الجلدية",
                  "الدبلوم الأمريكي للجلدية والتجميل والليزر",
                ]
              },
              {
                name: "د. لجين الجرماني",
                title: "نائب الجلدية والتجميل والليزر",
                img: "/acne/team/dr-lajin.avif",
                quals: [
                  "البورد السوري في طب الأمراض الجلدية",
                  "الدبلوم الأمريكي للجلدية والتجميل والليزر",
                ]
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
                ]
              },
            ].map((doc) => (
              <motion.div
                key={doc.name}
                variants={fadeIn}
                className="group relative bg-stone-50 rounded-3xl overflow-hidden flex flex-col h-full border border-stone-100 hover:shadow-2xl hover:shadow-gold-600/10 transition-all duration-300"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/20 to-transparent" />
                </div>

                <div className="p-6 relative z-10 flex-1 flex flex-col bg-stone-50 -mt-12">
                  <h4 className="text-xl font-bold text-stone-900 mb-1">{doc.name}</h4>
                  <p className="text-gold-600 text-sm font-semibold mb-6 pb-4 border-b border-stone-200">{doc.title}</p>
                  <ul className="space-y-3 flex-1">
                    {doc.quals.map((qual, i) => (
                      <li key={i} className="flex gap-2 items-start text-sm text-stone-600">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
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

      {/* Google Reviews Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
            }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-gold-600 font-bold mb-4 uppercase text-sm tracking-widest"
            >
              آراء عملائنا على Google
            </motion.p>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-2xl md:text-3xl font-bold text-stone-900 mb-6"
            >
              أكثر من 1,158 تقييم على Google
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="inline-flex items-center gap-3 bg-stone-50 rounded-full px-6 py-3 shadow-md border border-stone-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-stone-900">4.8</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-stone-500">(1,158 تقييم)</span>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Fatima Bushra", text: "أنصح بشدة بالدكتورة لجين الجرماني لمصداقيتها ومهارتها ولمستها الإبداعية في العلاج.", rating: 5, date: "قبل يومين" },
              { name: "Rafika Rafika", text: "سعيدة جداً بنتيجة فيلر الشفايف وحقن الإكسوسوم مع الدكتورة إيناس. يدها خفيفة جداً.", rating: 5, date: "قبل أسبوع" },
              { name: "Ali Al-Masoudi", text: "شكراً للدكتورة مها دحلان على حل مشكلة بنتي الجلدية بسرعة. أنصح بها بشدة.", rating: 5, date: "قبل شهر" },
              { name: "Afaf Alsubhi", text: "أشكر العيادة على احترافيتها ونتائجها الممتازة. تجربة رائعة من البداية للنهاية.", rating: 5, date: "قبل أسبوع" },
              { name: "Ruaa H.", text: "من أفضل عيادات الجلدية في المنطقة. الدكتورة مها متمكنة جداً في مجالها وفريقها مدرب على أعلى مستوى. بشرتي تحسنت بشكل ملحوظ.", rating: 5, date: "قبل شهر" },
              { name: "Jena S.", text: "أنصح بشدة بالدكتورة لجين، رائعة ومتفهمة وصادقة في توصياتها. العلاج اللي وصفته لي خلى بشرتي تنور.", rating: 5, date: "قبل أسبوعين" },
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="bg-stone-50 p-5 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-stone-200" />
                  ))}
                </div>
                <p className="text-stone-600 mb-4 leading-relaxed text-sm flex-1">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 font-bold text-sm shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900 leading-none mb-0.5">{review.name}</p>
                      <span className="text-xs text-stone-400">{review.date}</span>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" className="shrink-0 opacity-50">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-gold-600 text-white px-8 py-3.5 rounded-full font-bold shadow-sm hover:bg-gold-700 hover:shadow-md transition-all"
            >
              <WhatsAppIcon className="w-5 h-5" />
              احجز استشارتك الآن
            </motion.a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-900"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000')" }}
        ></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              لا تدع حب الشباب يؤثر على ثقتك بنفسك
            </h2>
            <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
              احجز موعدك الآن مع نخبة أطباء الجلدية في عيادات د. مها دحلان وابدأ رحلتك نحو بشرة صافية ومشرقة.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gold-500 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-gold-600 transition-all hover:scale-105 shadow-2xl"
            >
              <WhatsAppIcon className="w-7 h-7" />
              <span>احجز استشارتك عبر الواتساب</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/acne/logo.avif" alt="عيادات د. مها دحلان" className="h-28 w-auto object-contain brightness-0 invert" />
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                العيادة الرائدة في المملكة لتقديم حلول طبية وتجميلية متقدمة لعلاج مشاكل البشرة بأعلى معايير الجودة العالمية.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="https://www.instagram.com/dr.mahadahlan/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 hover:bg-gold-600 flex items-center justify-center text-stone-400 hover:text-white transition-all">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="https://x.com/drmahadahlan" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 hover:bg-gold-600 flex items-center justify-center text-stone-400 hover:text-white transition-all">
                  <XIcon className="w-4 h-4" />
                </a>
                <a href="https://www.tiktok.com/@dr.mahadahlan" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 hover:bg-gold-600 flex items-center justify-center text-stone-400 hover:text-white transition-all">
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a href="https://www.snapchat.com/add/drmahadahlan" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 hover:bg-gold-600 flex items-center justify-center text-stone-400 hover:text-white transition-all">
                  <SnapchatIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-white">روابط سريعة</h5>
              <ul className="space-y-4 text-sm text-stone-400">
                {["خدماتنا", "نتائجنا", "أطباؤنا"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link === "خدماتنا" ? "services" : link === "نتائجنا" ? "results" : "doctors"}`}
                      className="hover:text-gold-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-white">تواصل معنا</h5>
              <ul className="space-y-4 text-sm text-stone-400">
                <li className="flex gap-2 items-start">
                  <MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                  جدة، حي الروضة، شارع الأمير محمد بن عبدالعزيز (التحلية)، مركز بن حمران - الدور الثالث
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                  <a href="mailto:info@mahadahlan.com" className="hover:text-gold-400 transition-colors">info@mahadahlan.com</a>
                </li>
                <li className="flex gap-2 items-start">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <a href="tel:966920007515" className="hover:text-gold-400 transition-colors" dir="ltr">+966 920007515</a>
                    <a href="tel:966503377702" className="hover:text-gold-400 transition-colors" dir="ltr">+966 503377702</a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-white">ساعات العمل</h5>
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex justify-between">
                  <span>السبت - الخميس</span>
                  <span>12:00 ظ - 8:00 م</span>
                </li>
                <li className="flex justify-between">
                  <span>الجمعة</span>
                  <span>مغلق</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-500">&copy; {new Date().getFullYear()} عيادات د. مها دحلان. جميع الحقوق محفوظة.</p>
            <div className="flex gap-6 text-xs text-stone-500">
              <a href="#" className="hover:text-gold-400 transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-gold-400 transition-colors">الشروط والأحكام</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
