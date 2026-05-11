'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Reusable reveal wrapper ─── */
function Reveal({
  children,
  delay = 0,
  y = 40,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Floating gold particle ─── */
function Particle({ style, delay }: { style: React.CSSProperties; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -30, 0], opacity: [0.4, 0.9, 0.4], scale: [1, 1.3, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

/* ─── RTL arrow (points left for Arabic) ─── */
function ArrowRtl({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    </svg>
  )
}

/* ─── Service card ─── */
function ServiceCard({
  img, alt, icon, title, desc, delay,
}: {
  img: string; alt: string; icon: React.ReactNode
  title: string; desc: string; delay: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <motion.div
        className="group bg-white rounded-3xl overflow-hidden shadow-elegant cursor-pointer flex flex-col h-full"
        whileHover={{ y: -10, boxShadow: '0 30px 60px -10px rgba(212,175,55,0.25)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="img-zoom-container h-64 shrink-0 relative">
          <Image
            src={img}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-8 relative flex flex-col flex-1">
          <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center text-gold-500 absolute -top-6 left-8 border-4 border-white shadow-sm">
            {icon}
          </div>
          <h4 className="font-serif text-2xl text-charcoal mb-3">{title}</h4>
          <p className="text-sm text-gray-500 mb-6 leading-loose flex-1">{desc}</p>
          <a
            href="#book"
            className="text-gold-500 text-sm font-semibold flex items-center gap-2 group-hover:text-gold-600 transition-colors"
          >
            احجزي الآن
            <ArrowRtl />
          </a>
        </div>
      </motion.div>
    </Reveal>
  )
}

/* ─── Map iframe — only mounts when scrolled close to viewport ─── */
function LazyMap() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '300px' })
  return (
    <div ref={ref} className="relative w-full h-full min-h-[280px]">
      {inView ? (
        <iframe
          title="موقع عيادة مها دحلان"
          src="https://www.openstreetmap.org/export/embed.html?bbox=39.1600%2C21.5950%2C39.1900%2C21.6150&layer=mapnik&marker=21.6050%2C39.1750"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '280px', filter: 'sepia(30%) saturate(70%) brightness(0.85) contrast(1.05)' }}
          loading="lazy"
          className="block"
        />
      ) : (
        <div className="absolute inset-0 bg-charcoal/30" />
      )}
    </div>
  )
}

/* ─── Booking form (lead-panel integration) ─── */
function BookingForm() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'success' }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' })

  const inputClass =
    'w-full border border-white/15 rounded-xl px-5 py-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-400/70 transition-colors disabled:opacity-60'
  const inputStyle = { background: 'rgba(255,255,255,0.06)' } as const

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return

    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      setStatus({ kind: 'error', message: 'الرجاء تعبئة الاسم الكامل ورقم الجوال والمدينة.' })
      return
    }

    setSubmitting(true)
    setStatus({ kind: 'idle' })

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          source: 'botox',
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus({
          kind: 'error',
          message: data?.error || 'تعذّر إرسال طلبكِ، حاولي مرة أخرى لاحقاً.',
        })
        return
      }

      setStatus({ kind: 'success' })
      setFullName('')
      setPhone('')
      setCity('')
    } catch {
      setStatus({ kind: 'error', message: 'تعذّر الاتصال بالخادم. تحققي من اتصالكِ بالإنترنت.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="fullName"
        autoComplete="name"
        placeholder="الاسم الكامل"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        disabled={submitting}
        required
        className={inputClass}
        style={inputStyle}
      />
      <input
        type="tel"
        name="phone"
        autoComplete="tel"
        inputMode="tel"
        placeholder="رقم الجوال"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={submitting}
        required
        className={inputClass}
        style={inputStyle}
      />
      <input
        type="text"
        name="city"
        autoComplete="address-level2"
        placeholder="المدينة"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={submitting}
        required
        className={inputClass}
        style={inputStyle}
      />

      <motion.button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-gold text-white rounded-xl px-8 py-4 font-semibold text-sm shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
        whileHover={submitting ? undefined : { y: -3, boxShadow: '0 20px 40px -5px rgba(212,175,55,0.55)' }}
        whileTap={submitting ? undefined : { scale: 0.97 }}
      >
        {submitting ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
        {!submitting && <ArrowRtl />}
      </motion.button>

      {status.kind === 'success' && (
        <p
          role="status"
          className="text-sm text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 rounded-xl px-4 py-3"
        >
          تم استلام طلبكِ بنجاح. سيتواصل فريقنا معكِ خلال ٢٤ ساعة.
        </p>
      )}
      {status.kind === 'error' && (
        <p
          role="alert"
          className="text-sm text-red-300 bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3"
        >
          {status.message}
        </p>
      )}
    </form>
  )
}

/* ─── Main page ─── */
export default function BotoxLanding() {
  const heroRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!bgRef.current || !heroRef.current) return
    gsap.to(bgRef.current, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const particles = useMemo(() => [
    { w:5, h:5, l:'8%',  t:'18%', d:0.2 },  { w:4, h:4, l:'15%', t:'72%', d:1.1 },
    { w:7, h:7, l:'22%', t:'35%', d:0.6 },  { w:3, h:3, l:'30%', t:'85%', d:2.0 },
    { w:6, h:6, l:'38%', t:'15%', d:0.9 },  { w:4, h:4, l:'45%', t:'60%', d:1.5 },
    { w:5, h:5, l:'52%', t:'28%', d:0.3 },  { w:8, h:8, l:'60%', t:'78%', d:2.2 },
    { w:4, h:4, l:'67%', t:'12%', d:0.7 },  { w:6, h:6, l:'73%', t:'50%', d:1.3 },
    { w:3, h:3, l:'80%', t:'90%', d:0.5 },  { w:5, h:5, l:'87%', t:'32%', d:1.8 },
    { w:7, h:7, l:'92%', t:'65%', d:0.1 },  { w:4, h:4, l:'12%', t:'48%', d:2.4 },
    { w:6, h:6, l:'56%', t:'88%', d:1.0 },  { w:3, h:3, l:'70%', t:'22%', d:0.4 },
    { w:5, h:5, l:'35%', t:'55%', d:1.7 },  { w:4, h:4, l:'48%', t:'42%', d:0.8 },
  ], [])

  // Page-local utility classes. We deliberately do NOT set
  // `html { scroll-behavior: smooth }` here — Lenis owns scroll behavior.
  const shimmerCSS = `
    @keyframes shimmerGold {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    .text-shimmer-gold {
      background: linear-gradient(90deg,
        #b5952f 0%, #f1d787 30%, #D4AF37 50%, #f1d787 70%, #b5952f 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmerGold 3.5s linear infinite;
    }
    .bg-gradient-gold  { background: linear-gradient(135deg, #D4AF37 0%, #B5952F 100%); }
    .text-gradient-gold {
      background: linear-gradient(135deg, #D4AF37 0%, #B5952F 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .glass-panel {
      background: rgba(255,255,255,0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.8);
      box-shadow: 0 8px 32px 0 rgba(0,0,0,0.05);
    }
    .aesthetic-map {
      filter: sepia(30%) saturate(70%) brightness(0.85) contrast(1.05);
      transition: filter 0.5s ease;
    }
    .aesthetic-map:hover { filter: sepia(10%) saturate(90%) brightness(1); }
    .img-zoom-container { overflow: hidden; }
    .img-zoom-container img { transition: transform 0.7s ease; }
    .img-zoom-container:hover img { transform: scale(1.07); }

    @keyframes orbFloat {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      33%      { transform: translateY(-20px) rotate(120deg); }
      66%      { transform: translateY(10px) rotate(240deg); }
    }
    .orb   { animation: orbFloat 8s ease-in-out infinite; }
    .orb-2 { animation: orbFloat 11s ease-in-out infinite reverse; }
    .orb-3 { animation: orbFloat 14s ease-in-out infinite 2s; }

    .botox-landing h1,
    .botox-landing h2,
    .botox-landing h3,
    .botox-landing h4 { line-height: 1.4; }
    .botox-landing p { line-height: 1.9; }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerCSS }} />

      {/* ══ NAVBAR ══ */}
      <motion.nav
        className="fixed top-6 right-1/2 translate-x-1/2 w-[95%] max-w-6xl z-50 glass-panel rounded-full py-4 px-8 flex justify-between items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/botox/logo.png"
          alt="MD Clinics - مجمع عيادات د. مها دحلان الطبي"
          width={200}
          height={56}
          priority
          className="h-14 w-auto object-contain"
        />

        <div className="hidden lg:flex gap-10 text-xs font-semibold text-gray-700">
          {[
            { href: '#about',    label: 'عن العيادة' },
            { href: '#services', label: 'خدماتنا'    },
            { href: '#reviews',  label: 'آراء العملاء'},
            { href: '#location', label: 'موقعنا'     },
          ].map(({ href, label }) => (
            <motion.a key={href} href={href} className="hover:text-gold-400 transition-colors" whileHover={{ y: -2 }}>
              {label}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#book"
          className="bg-charcoal text-white px-6 py-2.5 rounded-full text-xs font-medium shadow-lg"
          whileHover={{ backgroundColor: '#D4AF37', y: -2, boxShadow: '0 10px 25px -5px rgba(212,175,55,0.5)' }}
          transition={{ duration: 0.25 }}
        >
          احجزي الآن
        </motion.a>
      </motion.nav>

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bgRef}
          src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=75"
          alt="داخل عيادة أنيقة"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-[130%] object-cover object-center -top-[15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/82 via-black/55 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb absolute w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #D4AF37, transparent)', top: '-10%', right: '-10%' }} />
          <div className="orb-2 absolute w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f1d787, transparent)', bottom: '5%', right: '20%' }} />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p, i) => (
            <Particle
              key={i}
              delay={p.d}
              style={{
                width: `${p.w}px`, height: `${p.h}px`,
                left: p.l, top: p.t,
                background: 'radial-gradient(circle, #f1d787, #D4AF37)',
                filter: 'blur(0.5px)',
                boxShadow: '0 0 6px 2px rgba(212,175,55,0.5)',
              }}
            />
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen">

            <div className="flex items-center lg:pl-12">
              <motion.div
                className="w-full max-w-xl"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              >
                <motion.div
                  className="flex items-center gap-3 mb-6 mt-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <span className="w-8 h-px bg-gradient-to-l from-gold-400 to-gold-300" />
                  <span className="text-xs font-semibold text-gold-500">
                    تجميل راقٍ · بيفرلي هيلز، كاليفورنيا
                  </span>
                </motion.div>

                <motion.h2
                  className="font-script text-5xl md:text-6xl text-shimmer-gold mb-3 block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.45 }}
                >
                  نتائج ناعمة تناسب ملامحكِ
                </motion.h2>

                <motion.h1
                  className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-white mb-7"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  جمالكِ الطبيعي<br />
                  <span className="italic font-light text-white/70">...</span>{' '}
                  <span className="font-bold">ببساطة.</span>
                </motion.h1>

                <motion.div
                  className="w-16 h-0.5 bg-gradient-gold mb-7 rounded-full"
                  initial={{ scaleX: 0, originX: 1 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                />

                <motion.p
                  className="font-sans text-white/75 leading-loose mb-10 text-sm md:text-base max-w-md"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.9 }}
                >
                  نقدّم لكِ علاجات البوتوكس والفيلر بتقنيات متقدمة لتعزيز الامتلاء
                  بأسلوب مدروس يحافظ على شكل وجهكِ ويمنحكِ مظهراً أنعم وأجمل بدون مبالغة.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 1.05 }}
                >
                  <motion.a
                    href="#book"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-white px-9 py-4 rounded-full font-semibold text-sm shadow-lg"
                    whileHover={{ y: -4, boxShadow: '0 22px 44px -6px rgba(212,175,55,0.55)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    احجزي استشارتكِ
                    <ArrowRtl />
                  </motion.a>
                  <motion.a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-9 py-4 rounded-full font-medium text-sm backdrop-blur-sm bg-white/10"
                    whileHover={{ borderColor: '#D4AF37', color: '#f1d787', y: -4, backgroundColor: 'rgba(255,255,255,0.18)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    استكشفي الخدمات
                  </motion.a>
                </motion.div>

                <motion.div
                  className="mt-12 flex items-center gap-6 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {[
                    { val: '+١٠ آلاف', label: 'علاج' },
                    { val: '٥.٠ ★',   label: 'تقييم جوجل' },
                    { val: '٨ سنوات', label: 'خبرة' },
                  ].map(({ val, label }, i) => (
                    <motion.div
                      key={label}
                      className="text-right"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.35 + i * 0.1 }}
                    >
                      <p className="text-xl font-serif text-gradient-gold font-bold leading-none">{val}</p>
                      <p className="text-[10px] text-white/50 mt-0.5">{label}</p>
                    </motion.div>
                  ))}
                  <div className="hidden sm:block w-px h-8 bg-white/20 mx-1" />
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.65 }}
                  >
                    {[
                      { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                      { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                      { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                      { label: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                    ].map(({ label, path }, i) => (
                      <motion.a
                        key={label}
                        href="#"
                        aria-label={label}
                        className="text-gold-400 bg-gold-400/10 border border-gold-400/30 p-2 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.7 + i * 0.08, type: 'spring', stiffness: 400 }}
                        whileHover={{ scale: 1.2, backgroundColor: 'rgba(212,175,55,0.25)', borderColor: '#D4AF37' }}
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d={path} />
                        </svg>
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <div className="relative hidden lg:flex items-center justify-start h-full">
              <motion.div
                className="absolute top-8 left-0 glass-panel px-5 py-4 rounded-2xl flex items-center gap-3 shadow-lg"
                initial={{ opacity: 0, y: -20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.9, delay: 1.2 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center shadow-md"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <div className="text-right">
                  <p className="font-serif font-bold text-charcoal text-sm leading-none">معتمدة طبياً</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">خبراء في الحقن</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-24 right-0 glass-panel px-5 py-4 rounded-2xl shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 1.45 }}
              >
                <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-300 animate-pulse" />
                  <span className="text-[11px] text-gray-500 font-semibold">متاح الآن</span>
                </div>
                <p className="font-serif text-charcoal text-sm font-medium text-right">
                  أقرب موعد: <span className="text-gold-500">اليوم ٣ م</span>
                </p>
              </motion.div>

              <motion.div
                className="absolute bottom-44 left-4 glass-panel px-5 py-4 rounded-2xl shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 1.6, type: 'spring', stiffness: 200 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center shadow-md shrink-0"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </motion.div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-charcoal leading-none">نتائج تدوم</p>
                    <p className="text-[11px] text-gold-500 mt-0.5">٦ – ١٢ شهراً</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-[10px] text-white/50">تمرير</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-gold-400 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            style={{ originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div
          className="absolute -left-40 top-20 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
        />
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            <Reveal className="w-full lg:w-1/2 relative" delay={0}>
              <div className="absolute -inset-4 border border-gold-300 rounded-[2rem] transform -rotate-3 scale-105 z-0 hidden md:block" />
              <motion.div
                className="img-zoom-container rounded-[2rem] shadow-elegant relative z-10 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[600px]">
                  <Image
                    src="/botox/botox_about.png"
                    alt="داخل العيادة"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 opacity-0"
                  style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(212,175,55,0.15) 50%, transparent 60%)' }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
              <Reveal delay={0.3} className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl z-20 w-64 hidden md:block">
                <h4 className="font-script text-3xl text-gold-400 mb-2">فلسفتنا</h4>
                <p className="text-xs text-gray-500 leading-loose">
                  ملامح مشدودة، مرتاحة، ومنسجمة مع ذاتكِ.
                </p>
              </Reveal>
            </Reveal>

            <Reveal className="w-full lg:w-1/2" delay={0.2}>
              <h2 className="font-script text-4xl text-shimmer-gold mb-2">معيار مها دحلان</h2>
              <h3 className="font-serif text-4xl md:text-5xl text-charcoal mb-8">
                معايير جديدة للجمال الطبي مع <span className="text-gradient-gold">MD Clinics</span>
              </h3>
              <p className="text-gray-600 leading-loose mb-6">
                في عيادتنا، الجمال ليس تغييراً للملامح... بل إعادةُ شغفها. نُركّز على
                التفاصيل الصغيرة التي تصنع الفرق الكبير: نعومة البشرة، توازن الملامح،
                وراحة التعبير.
              </p>
              <p className="text-gray-600 leading-loose mb-6">
                نستخدم أحدث تقنيات الحقن لعلاج:
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  'خطوط الوجه التعبيرية',
                  'فقدان الحجم في الشفاه والخدود والوجه',
                  'ملامح الوجه المرهقة أو غير المتناسقة',
                ].map((item, i) => (
                  <Reveal key={item} delay={0.25 + i * 0.1}>
                    <li className="flex items-start gap-3 text-gray-600 leading-loose">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-gold shrink-0" />
                      <span>{item}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="py-24 lg:py-32 bg-blush-50 relative overflow-hidden">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #D4AF37, transparent)' }}
        />
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <Reveal className="text-center mb-20">
            <h2 className="font-script text-4xl text-shimmer-gold mb-2">فلسفتنا في الجمال</h2>
            <h3 className="font-serif text-4xl md:text-5xl text-charcoal">
              ملامح مشدودة، مرتاحة، ومنسجمة مع ذاتكِ
            </h3>
            <motion.div
              className="w-24 h-1 bg-gradient-gold mx-auto mt-6 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            <ServiceCard
              img="/botox/botox-service.jpg"
              alt="حقن البوتوكس"
              delay={0}
              title="حقن البوتوكس"
              desc="حقن دقيق لإزالة الحركات الزائدة عن الوجه، خصوصاً في الجبهة، حول العين، ومحيط الفم. كل ذلك دون الإضرار بأي تعابير طبيعية."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
            />
            <ServiceCard
              img="/botox/filler-treatment.png"
              alt="تعزيز الامتلاء وتجديد الملامح بالفيلر"
              delay={0.15}
              title="تعزيز الامتلاء وتجديد الملامح بالفيلر"
              desc="تقنيات مدروسة تُعالج فقدان الدهون في الوجه، وإبراز الشفاه، وتجديد الخدود وحدود الوجه ببساطة."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              }
            />
            <ServiceCard
              img="/botox/filler.png"
              alt="علاجات الإشراقة والنضارة"
              delay={0.3}
              title="علاجات الـ Glow Up"
              desc="علاجات متكاملة تُغذّي البشرة من الداخل، وتُعزّز الترطيب، وتمنحكِ الإشراقة الطبيعية دون أي تغيير في الملامح."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══ */}
      <section id="reviews" className="py-24 bg-white border-t border-blush-200">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <Reveal>
              <h2 className="font-script text-4xl text-shimmer-gold mb-2">تقييمات عميلاتنا</h2>
              <h3 className="font-serif text-4xl text-charcoal">نتائج حقيقية وقصص ملهمة</h3>
            </Reveal>
            <Reveal delay={0.2} className="mt-4 md:mt-0 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  className="w-6 h-6 text-gold-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 400 }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: '«انبهرت تماماً بنتيجة فيلر الشفاه! كانت الطبيبة دقيقة للغاية وحرصت على أن يتناسب الشكل مع ملامح وجهي. النتيجة طبيعية جداً، وهذا بالضبط ما أردتُه.»',
                initial: 'س', name: 'سارة م.', service: 'تكبير الشفاه',
              },
              {
                quote: '«أفضل تجربة بوتوكس مررت بها على الإطلاق. لا وجه متجمداً، بل مظهر منتعش ومشرق تماماً. العيادة رائعة وتشعرينكِ بالراحة الكاملة.»',
                initial: 'إ', name: 'إيمان ر.', service: 'البوتوكس',
              },
              {
                quote: '«نحتت الطبيبة فكي وذقني بشكل رائع جداً. باتت ثقتي بنفسي أكبر كثيراً في الصور. خدمة احترافية وفنية وراقية من البداية حتى النهاية.»',
                initial: 'ج', name: 'جهاد ت.', service: 'الفيلر الجلدي',
              },
            ].map(({ quote, initial, name, service }, i) => (
              <Reveal key={name} delay={i * 0.15}>
                <motion.div
                  className="bg-blush-50 p-8 rounded-[2rem] relative shadow-sm border border-blush-100 h-full"
                  whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(212,175,55,0.2)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <svg className="absolute top-6 right-6 w-8 h-8 text-gold-300 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-600 mt-8 mb-6 relative z-10 leading-loose">{quote}</p>
                  <div className="flex items-center gap-4 flex-row-reverse justify-end">
                    <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center font-serif text-white font-bold shadow">
                      {initial}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-charcoal">{name}</p>
                      <p className="text-xs text-gray-400">{service}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOOKING / LOCATION ══ */}
      <section id="book" className="relative py-28 overflow-hidden">
        <Image
          src="/botox/hero_section_botox.png"
          alt="داخل العيادة الفاخرة"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-[#1a1208]/90 via-[#2a1f10]/80 to-[#0f0c06]/92" />

        <motion.div
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12), transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-6 lg:px-16 max-w-7xl relative z-10">
          <Reveal className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold-400" />
              <span className="text-xs text-gold-400/80 font-semibold">رعاية شخصية متكاملة</span>
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold-400" />
            </div>
            <h2 className="font-script text-5xl text-shimmer-gold mb-2">ابدئي رحلتكِ</h2>
            <h3 className="font-serif text-3xl md:text-4xl text-white/90">احجزي استشارتكِ</h3>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            <Reveal className="lg:col-span-3" delay={0.1}>
              <div
                className="rounded-3xl overflow-hidden border border-white/10"
                style={{ background: 'rgba(255,252,248,0.06)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
              >
                <div className="p-8 md:p-10">
                  <p className="text-white/60 mb-8 text-sm leading-loose">
                    سيقوم متخصصونا بإعداد خطة علاج مخصصة تتناسب مع أهدافكِ تماماً. نرد خلال ٢٤ ساعة.
                  </p>
                  <BookingForm />

                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-5">
                    {[
                      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'سرية تامة' },
                      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'رد خلال ٢٤ ساعة' },
                      { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', label: 'خطة مخصصة لكِ' },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex items-center gap-2 text-white/50 text-xs">
                        <svg className="w-4 h-4 text-gold-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                        </svg>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-2" delay={0.25}>
              <div
                id="location"
                className="rounded-3xl overflow-hidden border border-white/10 flex flex-col h-full"
                style={{ background: 'rgba(255,252,248,0.06)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
              >
                <div className="p-8 space-y-5">
                  <h4 className="font-serif text-xl text-white font-semibold">عيادتنا</h4>
                  {[
                    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'جدة، حي الروضة، شارع الأمير محمد بن عبدالعزيز (التحلية)\nمركز بن حمران - الدور الثالث' },
                    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+966 920007515\n+966 503377702' },
                    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'info@mahadahlan.com' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: 'rgba(212,175,55,0.15)' }}>
                        <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                        </svg>
                      </div>
                      <p className="text-sm text-white/70 leading-loose whitespace-pre-line">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="relative flex-grow min-h-[280px] overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent z-10" />
                  <LazyMap />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 30px 10px rgba(26,18,8,0.45)' }} />
                  <a
                    href="https://www.openstreetmap.org/?mlat=21.6050&mlon=39.1750#map=16/21.6050/39.1750"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-charcoal/80 backdrop-blur-sm text-white/80 text-[11px] font-medium px-4 py-2 rounded-full border border-white/10 hover:border-gold-400/50 hover:text-gold-300 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    فتح في الخرائط
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-charcoal pt-16 pb-8 border-t border-gold-400/30 text-white">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <Reveal>
            <div className="font-script text-5xl text-shimmer-gold mb-6">مها دحلان</div>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto leading-loose">
              الارتقاء بجمالكِ الطبيعي من خلال العلم والفن. متخصصة في الحقن الراقية
              والبوتوكس والفيلر الجلدي.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="flex justify-center gap-6 mb-12">
            {[
              'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
              'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
            ].map((d, i) => (
              <motion.a
                key={i}
                href="#"
                className="text-gold-400 bg-gold-400/10 border border-gold-400/30 p-3 rounded-full"
                whileHover={{ scale: 1.15, backgroundColor: 'rgba(212,175,55,0.25)', borderColor: '#D4AF37' }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={d} />
                </svg>
              </motion.a>
            ))}
          </Reveal>

          <div className="border-t border-gold-400/30 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© ٢٠٢٦ عيادة مها دحلان. جميع الحقوق محفوظة.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <motion.a href="#" className="hover:text-gold-400 transition-colors" whileHover={{ y: -1 }}>سياسة الخصوصية</motion.a>
              <motion.a href="#" className="hover:text-gold-400 transition-colors" whileHover={{ y: -1 }}>شروط الخدمة</motion.a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
