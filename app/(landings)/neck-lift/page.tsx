import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import { Parallax, Reveal, ScrollProgress, SpotlightCard } from "./_components/Gsap";
import { Doctors } from "./_components/Doctors";
import { BeforeAfter } from "./_components/BeforeAfter";
import { Journey } from "./_components/Journey";
import { Testimonials } from "./_components/Testimonials";
import { Booking } from "./_components/Booking";
import { StickyBar } from "./_components/StickyBar";
import {
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
  WA_TOPIC_MESSAGE,
  WHATSAPP_NUMBER,
} from "./_components/config";

const WHY_CARDS = [
  {
    num: "٠١",
    title: "جلدٌ أرقّ وأكثر حساسية",
    body: "طبقة الجلد في الرقبة أرقّ من الوجه وأقلّ كولاجيناً، فتظهر عليها الخطوط والترهل مبكراً.",
  },
  {
    num: "٠٢",
    title: "غددٌ دهنية أقل",
    body: "ترطيبها الطبيعي محدود، فتجفّ أسرع وتصبح أكثر عرضة للتجاعيد الرقيقة وتغيّر الملمس.",
  },
  {
    num: "٠٣",
    title: "حركةٌ دائمة وإهمالٌ شائع",
    body: "آلاف الحركات يومياً ونظرٌ مستمر إلى الشاشات، وقلّما تنال من العناية ما نمنحه للوجه.",
  },
];

const SIGNS = [
  {
    icon: Icon.AlignJustify,
    title: "الخطوط الأفقية",
    body: "حلقاتٌ دقيقة تحيط بالرقبة وتزداد وضوحاً مع الوقت، وقد تظهر مبكراً بسبب وضعيات النوم والجوال.",
  },
  {
    icon: Icon.Waves,
    title: "ترهل الجلد",
    body: "ارتخاءٌ تدريجي أسفل الذقن وعلى جانبي الرقبة يُفقد المنطقة شدّها ونعومة انحنائها.",
  },
  {
    icon: Icon.Spline,
    title: "فقدان تحديد خط الفك",
    body: "تلاشي الزاوية الواضحة بين الوجه والرقبة، وظهور ما يُعرف بالذقن المزدوج.",
  },
  {
    icon: Icon.Smartphone,
    title: "رقبة التقنية",
    body: "تجاعيد مبكرة يسبّبها الانحناء المتكرر نحو الشاشات ساعاتٍ طويلة كل يوم.",
  },
  {
    icon: Icon.Grip,
    title: "تغيّر ملمس الجلد",
    body: "رقّةٌ وتجعّد يشبه ورق الكريب، نتيجة تراجع الكولاجين والإيلاستين مع السنوات.",
  },
  {
    icon: Icon.Columns2,
    title: "الخطوط العمودية العضلية",
    body: "بروز حوافّ عضلة الرقبة الأمامية مع الوقت وظهور خطوط عمودية عند الشدّ أو الكلام.",
  },
];

const SOLUTIONS = [
  {
    num: "٠١",
    icon: Icon.MoveUpLeft,
    title: "شد الرقبة بالخيوط التجميلية",
    body: "رفعٌ فوري للجلد المترهل وتحفيزٌ طويل الأمد للكولاجين، بجلسة واحدة ودون جراحة.",
  },
  {
    num: "٠٢",
    icon: Icon.Radio,
    title: "الهايفو بالموجات المركزة",
    body: "شدٌّ عميق يصل إلى الطبقة العضلية نفسها التي تستهدفها عمليات الشد، بلا تدخل جراحي.",
  },
  {
    num: "٠٣",
    icon: Icon.Crown,
    title: "بوتوكس نفرتيتي",
    body: "إعادة رسم زاوية الفك وتنعيم عضلة الرقبة، لإطلالة مرفوعة أنيقة مستوحاة من اسمها.",
  },
  {
    num: "٠٤",
    icon: Icon.PenTool,
    title: "فيلر تحديد خط الفك",
    body: "استعادة الحدود الواضحة بين الوجه والرقبة بتوازنٍ محسوب يليق بملامحك.",
  },
  {
    num: "٠٥",
    icon: Icon.Droplet,
    title: "سكين بوستر ومحفزات الكولاجين",
    body: "ترطيبٌ عميق يعيد للجلد كثافته وملمسه الحريري، ويخفف الخطوط الأفقية الدقيقة.",
  },
  {
    num: "٠٦",
    icon: Icon.Sparkles,
    title: "التقشير والليزر التجميلي",
    body: "توحيد اللون وتجديد سطح الجلد، لملمسٍ أكثر نعومة وإشراقٍ يدوم.",
  },
];

const FAQ = [
  {
    q: "متى تظهر النتائج؟",
    a: "بعض التقنيات كالخيوط والفيلر تمنح نتيجة فورية، بينما تتحسن نتائج الهايفو ومحفزات الكولاجين تدريجياً خلال شهرين إلى ثلاثة مع استمرار بناء الكولاجين.",
  },
  {
    q: "هل الإجراءات مؤلمة؟",
    a: "نستخدم كريمات التخدير الموضعي قبل كل جلسة، وتصف معظم مراجعاتنا الإحساس بأنه وخزٌ خفيف محتمل لا يستدعي القلق.",
  },
  {
    q: "هل أحتاج فترة تعافٍ؟",
    a: "معظم الإجراءات لا تتطلب انقطاعاً عن حياتك اليومية؛ قد يظهر احمرار أو تورّم خفيف يزول خلال أيام قليلة، ونزوّدك بتعليمات عناية واضحة بعد كل جلسة.",
  },
  {
    q: "كم تدوم النتائج؟",
    a: "بحسب التقنية: من أربعة إلى ستة أشهر للبوتوكس، وحتى اثني عشر إلى ثمانية عشر شهراً للخيوط والهايفو، مع إمكانية جلسات محافظة تطيل النتيجة.",
  },
  {
    q: "كيف أعرف العلاج المناسب لي؟",
    a: "هذا تحديداً دور الاستشارة؛ نقيّم حالتك ونصارحك بما تحتاجينه فعلاً، وقد تكفي تقنية واحدة فقط للوصول إلى النتيجة التي تتمنينها.",
  },
];

function SectionHead({
  eyebrow,
  title,
  highlight,
  sub,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  sub?: string;
}) {
  return (
    <Reveal className="mb-[54px] flex flex-col items-center gap-3.5 text-center">
      <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-nkl-gold)]">
        {eyebrow}
      </span>
      <h2 className="nkl-serif m-0 text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.35] font-bold">
        {title}{" "}
        {highlight && (
          <span className="text-[var(--color-nkl-gold)]">{highlight}</span>
        )}
      </h2>
      {sub && (
        <p className="m-0 max-w-[54ch] font-light text-[var(--color-nkl-muted)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export default function NeckLiftPage() {
  return (
    <main>
      <ScrollProgress />
      <Header />
      <Hero />
      <MarqueeStrip />

      {/* ——— لماذا الرقبة أولاً ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] pt-[110px] pb-[90px]">
        <SectionHead
          eyebrow="٠١ ، لماذا الرقبة أولاً؟"
          title="لماذا تُفصِح الرقبة عن العمر"
          highlight="قبل الوجه؟"
          sub="نمنح وجوهنا عنايةً يومية… وننسى أن الرقبة تحمل خصائص تجعلها أسرع تأثراً بمرور الوقت."
        />
        <div className="grid gap-[22px] md:grid-cols-3">
          {WHY_CARDS.map((c, i) => (
            <Reveal key={c.num} delay={i * 120}>
              <div className="relative overflow-hidden rounded-[22px] border border-[var(--color-nkl-line)] bg-[var(--color-nkl-card)] px-7 py-[34px] transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(166,124,61,0.4)] hover:shadow-[0_26px_54px_-26px_rgba(138,100,48,0.35)]">
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #8A6430, #E0BE7A, transparent)",
                  }}
                  aria-hidden
                />
                <span className="nkl-serif text-[2.6rem] leading-none font-bold text-[rgba(166,124,61,0.25)]">
                  {c.num}
                </span>
                <h3 className="mt-3.5 mb-2.5 text-[1.15rem] font-extrabold">
                  {c.title}
                </h3>
                <p className="m-0 text-[0.94rem] font-light text-[var(--color-nkl-muted)]">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— العلامات ——— */}
      <section className="relative border-y border-[rgba(166,124,61,0.15)] bg-[var(--color-nkl-band)] px-[22px] py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow="٠٢ ، العلامات"
            title="علامات التقدم بالسن"
            highlight="في الرقبة"
            sub="تعرّفي على العلامات الست الأكثر شيوعاً، وكلها قابلة للعلاج دون جراحة."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNS.map((s, i) => (
              <SpotlightCard
                key={s.title}
                delay={(i % 3) * 80}
                className="rounded-[22px] px-[26px] py-[30px]"
              >
                <div
                  className="mb-4 flex size-[46px] items-center justify-center rounded-[14px] border border-[rgba(166,124,61,0.3)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,156,78,.18), rgba(138,100,48,.08))",
                  }}
                >
                  <s.icon className="size-[22px] text-[var(--color-nkl-bronze)]" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2 text-[1.1rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[var(--color-nkl-muted)]">
                  {s.body}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ——— الحلول ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow="٠٣ ، الحلول"
          title="تقنياتٌ دقيقة…"
          sub="لا توجد تقنية واحدة تناسب الجميع؛ نختار لكِ من هذه الحلول ما يلائم درجة الترهل ونوع بشرتك."
        />
        <Reveal className="-mt-12 mb-[54px] text-center">
          <span className="nkl-serif nkl-gold-text text-[clamp(1.5rem,3vw,2.2rem)] font-bold">
            ونتائج تُرى ولا تُلاحَظ
          </span>
        </Reveal>
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 90}>
              <div className="relative overflow-hidden rounded-3xl border border-[var(--color-nkl-line)] bg-[var(--color-nkl-card)] px-7 py-[34px] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(201,156,78,0.5)] hover:shadow-[0_28px_58px_-26px_rgba(138,100,48,0.38)]">
                <span className="nkl-serif absolute top-3.5 left-5 text-[3.4rem] leading-none font-bold text-[rgba(166,124,61,0.1)]">
                  {s.num}
                </span>
                <div
                  className="mb-[18px] flex size-[52px] items-center justify-center rounded-full shadow-[0_10px_24px_-10px_rgba(138,100,48,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #8A6430, #E0BE7A)",
                  }}
                >
                  <s.icon className="size-6 text-[#FFFDF8]" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2.5 text-[1.2rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.94rem] font-light text-[var(--color-nkl-muted)]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— الأخصائيات ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(166,124,61,0.15)] bg-[var(--color-nkl-band)] px-[22px] py-[100px]">
        <div
          className="pointer-events-none absolute -top-[120px] -left-[140px] size-[420px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(224,190,122,.3), transparent 65%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1080px]">
          <SectionHead
            eyebrow="٠٤ ، بإشراف"
            title="فريق نسائي"
            highlight="متخصص"
            sub="فلسفتنا في علاج الرقبة تقوم على التدرّج والدقة: نبدأ بتقييمٍ صادق، ثم نختار أقلّ التقنيات تدخلاً وأكثرها أثراً."
          />
          <Reveal delay={120}>
            <Doctors />
          </Reveal>
          <Reveal delay={200} className="mx-auto mt-10 max-w-[560px]">
            <div
              className="rounded-l-[14px] rounded-r border-r-[3px] border-[var(--color-nkl-gold-bright)] px-[22px] py-[18px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(201,156,78,.1), transparent 70%)",
              }}
            >
              <p className="nkl-serif m-0 text-center text-[1.12rem] text-[var(--color-nkl-ink-soft)] italic">
                &#8220;جمال الرقبة في انسجامها مع الوجه؛ نشدّ ونحدّد دون أن
                نغيّر ملامحك.&#8221;
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— قبل وبعد ——— */}
      <section className="relative mx-auto max-w-[1020px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow="٠٥ ، النتائج"
          title="شاهدي الفرق"
          highlight="بنفسك"
          sub="اسحبي المؤشر لمقارنة الحالة قبل العلاج وبعده."
        />
        <Parallax from={30} to={-30}>
          <Reveal delay={120}>
            <BeforeAfter />
          </Reveal>
        </Parallax>
        <Reveal delay={200}>
          <p className="mt-[18px] mb-0 text-center text-[0.78rem] text-[rgba(39,28,17,0.45)]">
            الصور توضيحية بمحاكاة تقريبية وليست حالة فعلية، وتختلف النتائج من
            حالة إلى أخرى بحسب التقييم الطبي.
          </p>
        </Reveal>
      </section>

      {/* ——— رحلة العلاج ——— */}
      <section className="relative border-y border-[rgba(166,124,61,0.15)] bg-[var(--color-nkl-band)] px-[22px] py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow="٠٦ ، الرحلة"
            title="رحلتكِ معنا…"
            highlight="خطوة بخطوة"
          />
          <Journey />
        </div>
      </section>

      {/* ——— قالت مراجعاتنا ——— */}
      <section className="relative overflow-hidden py-[110px]">
        <div className="px-[22px]">
          <SectionHead
            eyebrow="٠٧ ، قالوا عنا"
            title="ثقةٌ تتحدث"
            highlight="عن نفسها"
            sub="من تقييمات Google الحقيقية لعيادات مها دحلان: ٤٫٨ من ٥ عبر أكثر من ١٢٧٠ تقييم."
          />
        </div>
        <Testimonials />
      </section>

      {/* ——— الأسئلة الشائعة ——— */}
      <section className="relative mx-auto max-w-[780px] px-[22px] pt-5 pb-[110px]">
        <SectionHead
          eyebrow="٠٨ ، الأسئلة الشائعة"
          title="كل ما يهمّك"
          highlight="معرفته"
        />
        <div className="flex flex-col gap-3.5">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="overflow-hidden rounded-[18px] border border-[rgba(166,124,61,0.2)] bg-[var(--color-nkl-card)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-extrabold">
                  {f.q}
                  <span className="nkl-pm inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(166,124,61,0.4)] text-[1.2rem] font-normal text-[var(--color-nkl-bronze)]">
                    +
                  </span>
                </summary>
                <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[rgba(39,28,17,0.65)]">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— الحجز ——— */}
      <section
        id="booking"
        className="relative mx-auto max-w-[1180px] px-[22px] pb-[110px]"
      >
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-[var(--color-nkl-dark)] p-[clamp(36px,6vw,70px)]">
            <div
              className="pointer-events-none absolute -top-[180px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 blur-[30px]"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(224,190,122,.22), transparent 70%)",
                animation: "nkl-breathe 7s ease-in-out infinite",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(224,190,122,.1) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center justify-center gap-[46px]">
              <div className="min-w-[290px] max-w-[520px] flex-1 text-[var(--color-nkl-cream)]">
                <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-nkl-gold-bright)]">
                  ٠٩ ، الحجز
                </span>
                <h2 className="nkl-serif mt-3 mb-0 text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.4] font-bold">
                  استشارتكِ الخاصة{" "}
                  <span className="nkl-gold-text">تبدأ من هنا</span>
                </h2>
                <p className="mt-[18px] mb-0 font-light text-[rgba(250,244,232,0.7)]">
                  اتركي بياناتك وسيتواصل معك فريقنا لتنسيق موعدك في أقرب وقت
                  يناسبك.
                </p>
                <div className="mt-[26px] flex flex-col gap-3.5">
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(250,244,232,0.75)]">
                    <Icon.Lock className="size-4 shrink-0 text-[var(--color-nkl-gold-bright)]" />
                    خصوصية تامة وملف طبي سرّي
                  </span>
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(250,244,232,0.75)]">
                    <Icon.CircleCheck className="size-4 shrink-0 text-[var(--color-nkl-gold-bright)]" />
                    تقييم صادق دون أي التزام
                  </span>
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(250,244,232,0.75)]">
                    <Icon.Clock className="size-4 shrink-0 text-[var(--color-nkl-gold-bright)]" />
                    ردٌّ سريع خلال ساعات العمل
                  </span>
                </div>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[rgba(37,211,102,0.5)] px-[26px] py-[13px] text-[0.95rem] font-extrabold text-[#25D366] transition-colors duration-300 hover:bg-[rgba(37,211,102,0.1)]"
                >
                  <Icon.MessageCircle className="size-[18px]" />
                  أو تحدثي معنا مباشرة عبر واتساب
                </a>
              </div>
              <div className="min-w-[290px] max-w-[480px] flex-1">
                <Booking />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— الفوتر ——— */}
      <footer className="border-t border-[var(--color-nkl-line)] px-[22px] pt-11 pb-[120px] text-center md:pb-11">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/neck-lift/logo.png"
            alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
            width={110}
            height={110}
            className="size-[110px] object-contain"
          />
        </div>
        <div className="flex justify-center gap-5 text-[0.86rem]">
          <a
            dir="ltr"
            href={TEL_LINK}
            className="text-[var(--color-nkl-bronze)] hover:text-[var(--color-nkl-gold)]"
          >
            {PHONE_DISPLAY}
          </a>
          <span className="text-[rgba(166,124,61,0.4)]">✦</span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-nkl-bronze)] hover:text-[var(--color-nkl-gold)]"
          >
            واتساب العيادة
          </a>
          <span className="text-[rgba(166,124,61,0.4)]">✦</span>
          <a
            href="#booking"
            className="text-[var(--color-nkl-bronze)] hover:text-[var(--color-nkl-gold)]"
          >
            حجز استشارة
          </a>
        </div>
        <p className="mt-4 mb-0 text-[0.74rem] text-[rgba(39,28,17,0.4)]">
          جميع العلاجات تُجرى بعد تقييم طبي متخصص. النتائج تختلف من حالة إلى
          أخرى.
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="nkl"
        whatsappNumber={WHATSAPP_NUMBER}
        topicMessage={WA_TOPIC_MESSAGE}
      />
      <StickyBar />
    </main>
  );
}
