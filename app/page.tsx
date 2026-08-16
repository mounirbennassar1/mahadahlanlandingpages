import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { almarai } from "@/lib/fonts";
import { Icon, SocialIcon } from "@/components/icons";
import { Providers } from "@/components/providers/Providers";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_home/Header";
import { Hero } from "./_home/Hero";
import { MarqueeStrip } from "./_home/MarqueeStrip";
import { PagesMarquee } from "./_home/PagesMarquee";
import { Doctors } from "./_home/Doctors";
import { Testimonials } from "./_home/Testimonials";
import { HoursMap } from "./_home/HoursMap";
import { Payments } from "./_home/Payments";
import { StickyBar } from "./_home/StickyBar";
import { Footer } from "./_home/Footer";
import {
  BackToTop,
  Parallax,
  Reveal,
  RevealGroup,
  ScrollProgress,
  ScrubLine,
} from "./_home/Motion";
import {
  GOLD_GRADIENT,
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
  WA_TOPIC_MESSAGE,
  WHATSAPP_NUMBER,
} from "./_home/config";
import "./_home/home.css";

export const metadata: Metadata = {
  title: {
    absolute: "عيادات د. مها دحلان | تجربة طبية تجميلية فاخرة في جدة",
  },
  description:
    "عيادات د. مها دحلان في جدة: البوتوكس والفيلر، شد الرقبة، الجلاس سكين الكوري، علاج التصبّغات وحب الشباب، نحت الجسم وعلاج تساقط الشعر. بإشراف نخبة الاستشاريين وطاقم نسائي بالكامل.",
  alternates: { canonical: "/" },
};

/* Onyx black ground, champagne / neon-gold accents, warm ivory type —
   the luxury dark theme of the home page. `--color-md-ink` stays the dark
   coffee used for text sitting ON gold surfaces. */
const paletteVars: CSSProperties = {
  "--color-md-bg": "#0B0805",
  "--color-md-band": "#100B07",
  "--color-md-card": "#16100A",
  "--color-md-ink": "#241A0E",
  "--color-md-text": "#F6EEDF",
  "--color-md-muted": "rgba(246,238,223,.6)",
  "--color-md-bronze": "#A67C3D",
  "--color-md-gold": "#C99C4E",
  "--color-md-gold-bright": "#E8C36A",
  "--color-md-champagne": "#F0D48A",
  "--color-md-neon": "#FFE9A8",
  "--color-md-dark": "#0B0805",
  "--color-md-line": "rgba(201,156,78,.16)",
  "--color-md-line-strong": "rgba(201,156,78,.34)",
  background: "#0B0805",
  color: "#F6EEDF",
} as CSSProperties;

const WHY_US = [
  {
    icon: Icon.HeartHandshake,
    title: "تقييم صادق",
    body: "لا نقترح عليكِ إلا ما تحتاجينه فعلاً، وقد نكتفي بتقنية واحدة بدل باقة كاملة.",
  },
  {
    icon: Icon.BadgeCheck,
    title: "مواد أصلية معتمدة",
    body: "أجهزة ومستحضرات من شركات عالمية موثّقة، تُفتح أمامك داخل الجلسة.",
  },
  {
    icon: Icon.Users,
    title: "طاقم نسائي بالكامل",
    body: "خصوصية تامة من الاستقبال حتى غرفة الجلسة وملفك الطبي.",
  },
  {
    icon: Icon.CalendarCheck,
    title: "متابعة حتى النتيجة",
    body: "مراجعات دورية مجدولة نطمئن فيها على تطور نتيجتك حتى اكتمالها.",
  },
];

const JOURNEY = [
  {
    num: "٠١",
    icon: Icon.MessageCircle,
    title: "استشارة أولى تسمعك",
    body: "نبدأ بسؤالك عن هدفك أنتِ، ثم نفحص حالتك بدقة قبل اقتراح أي إجراء.",
  },
  {
    num: "٠٢",
    icon: Icon.ClipboardList,
    title: "خطة تُرسم لك وحدك",
    body: "بروتوكول يناسب بشرتك ووقتك وميزانيتك، بتكلفة واضحة من أول لقاء.",
  },
  {
    num: "٠٣",
    icon: Icon.Sparkles,
    title: "الجلسة في راحة تامة",
    body: "غرفة خاصة، طاقم نسائي، ومواد أصلية تُفتح أمامك خطوة بخطوة.",
  },
  {
    num: "٠٤",
    icon: Icon.CalendarCheck,
    title: "متابعة حتى النتيجة",
    body: "مواعيد مراجعة مجدولة نطمئن فيها على تطور نتيجتك حتى تكتمل.",
  },
];

function SectionHead({
  eyebrow,
  title,
  gold,
  body,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  gold?: string;
  body?: string;
  align?: "center" | "start";
}) {
  return (
    <Reveal
      className={`flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start text-right"
      }`}
    >
      <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-[18px] py-2 text-[0.78rem] font-bold tracking-[0.04em] text-[var(--color-md-champagne)]">
        <span
          className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
          style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
        />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.55] font-extrabold tracking-[-0.01em] text-[var(--color-md-text)]">
        {title}
        {gold ? (
          <>
            {" "}
            {/* glow lives on the wrapper: filter + background-clip:text on the
                same element makes Chrome paint the gradient as a box */}
            <span className="md-gold-glow inline-block">
              <span className="md-gold-text">{gold}</span>
            </span>
          </>
        ) : null}
      </h2>
      {body ? (
        <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-[1.9] font-light text-[rgba(246,238,223,0.6)]">
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-[22px] py-[78px] sm:py-[96px] ${className}`}>
      <div className="mx-auto max-w-[1180px]">{children}</div>
    </section>
  );
}

/** Soft champagne halo used between the dark bands. */
function Glow({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute blur-[50px] ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,156,78,.14), transparent 70%)",
      }}
      aria-hidden
    />
  );
}

export default function Home() {
  return (
    <Providers>
      <div
        className={`md-home relative flex-1 overflow-clip ${almarai.variable}`}
        style={{
          ...paletteVars,
          fontFamily: "var(--font-almarai), system-ui, sans-serif",
          lineHeight: 1.7,
        }}
      >
        <ScrollProgress />
        <Header />

        <main>
          <Hero />
          <MarqueeStrip />

          {/* ——— specialties: every page, flowing ——— */}
          <section
            id="specialties"
            className="overflow-hidden bg-[var(--color-md-band)] py-[78px] sm:py-[96px]"
          >
            <div className="mx-auto max-w-[1180px] px-[22px]">
              <SectionHead
                eyebrow="تخصصاتنا"
                title="كل ما تحتاجينه"
                gold="تحت سقفٍ واحد"
                body="أربعة عشر برنامجاً علاجياً متخصصاً تمرّ من أمامك. مرّري بالمؤشر لإيقاف الشريط، وكل بطاقة تفتح صفحة كاملة بالتفاصيل وطريقة الحجز."
              />
            </div>
            <Reveal className="mt-12">
              <PagesMarquee />
            </Reveal>
          </section>

          {/* ——— why us ——— */}
          <Section id="why" className="bg-[var(--color-md-band)]">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <SectionHead
                  align="start"
                  eyebrow="لماذا عياداتنا"
                  title="نتيجةٌ تليق بك،"
                  gold="وطريقٌ واضح إليها"
                  body="ما يميّز التجربة عندنا ليس الجهاز وحده، بل القرار الذي يسبقه: ماذا تحتاجين فعلاً، وماذا يمكن الاستغناء عنه."
                />

                <Reveal delay={120} className="mt-8">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2.5 rounded-full px-[30px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_34px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_46px_-8px_rgba(255,223,142,0.8)]"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    احجزي استشارتك الخاصة
                    <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
                  </a>
                </Reveal>
              </div>

              <RevealGroup className="grid grid-cols-2 gap-3.5 sm:gap-5">
                {WHY_US.map((card) => (
                  <div
                    key={card.title}
                    className="group rounded-[20px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-4 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)] sm:rounded-[24px] sm:p-7"
                  >
                    <span
                      className="mb-4 inline-flex size-10 items-center justify-center rounded-xl text-[var(--color-md-ink)] shadow-[0_0_22px_-6px_rgba(232,195,106,0.55)] transition-transform duration-400 group-hover:scale-110 sm:mb-5 sm:size-12 sm:rounded-2xl"
                      style={{ background: GOLD_GRADIENT }}
                      aria-hidden
                    >
                      <card.icon className="size-[18px] sm:size-[22px]" strokeWidth={2} />
                    </span>
                    <h3 className="text-[0.95rem] font-extrabold text-[var(--color-md-text)] sm:text-[1.08rem]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[0.8rem] leading-[1.75] font-light text-[rgba(246,238,223,0.58)] sm:mt-2.5 sm:text-[0.92rem] sm:leading-[1.85]">
                      {card.body}
                    </p>
                  </div>
                ))}
              </RevealGroup>
            </div>
          </Section>

          {/* ——— journey ——— */}
          <Section id="journey" className="relative bg-[var(--color-md-bg)]">
            <Glow className="-top-16 left-1/4 h-[320px] w-[520px]" />
            <SectionHead
              eyebrow="رحلتك معنا"
              title="أربع خطوات"
              gold="من أول سؤال حتى النتيجة"
            />

            {/* gold rule draws itself with the scroll */}
            <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />

            {/* mobile: apple-style snap carousel; md+: the 4-up grid */}
            <RevealGroup className="md-carousel relative mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto -mx-[22px] px-[22px] pt-5 pb-2 scroll-px-[22px] md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pt-4 md:pb-0 lg:grid-cols-4">
              {JOURNEY.map((step) => (
                <div
                  key={step.num}
                  className="relative flex w-[76vw] max-w-[330px] shrink-0 snap-center flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-colors duration-400 hover:border-[rgba(232,195,106,0.45)] md:w-auto md:max-w-none"
                >
                  <span
                    className="absolute -top-4 right-7 rounded-full px-3.5 py-1.5 text-[0.78rem] font-extrabold text-[var(--color-md-ink)]"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    {step.num}
                  </span>
                  <span
                    className="mt-3 mb-4 inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]"
                    aria-hidden
                  >
                    <step.icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
                    {step.body}
                  </p>
                </div>
              ))}
            </RevealGroup>
          </Section>

          {/* ——— team — same doctors slider as the landing pages ——— */}
          <Section className="bg-[var(--color-md-band)]">
            <SectionHead
              eyebrow="من يقف خلف نتيجتك"
              title="أيدٍ خبيرة"
              gold="وعينٌ تعرف التفاصيل"
              body="نخبة من طبيبات الجلدية والتجميل بقيادة د. مها دحلان، استشارية الجلدية والتجميل والليزر — كل خطة علاجية تمرّ على عينها قبل أن تبدأ."
            />
            <Reveal className="mt-12">
              <Doctors />
            </Reveal>
          </Section>

          {/* ——— reviews ——— */}
          <Section id="reviews" className="relative overflow-hidden bg-[var(--color-md-bg)]">
            <Glow className="-top-10 right-1/4 h-[300px] w-[600px]" />
            <SectionHead
              eyebrow="آراء العميلات"
              title="٤٫٨ من ٥"
              gold="بأكثر من ١٢٧٠ تقييماً"
              body="مقتطفات حقيقية من تقييمات زائرات العيادة على خرائط Google."
            />
            <Parallax className="mt-12" from={18} to={-18}>
              <Testimonials />
            </Parallax>
          </Section>

          {/* ——— hours + map ——— */}
          <Section id="visit" className="bg-[var(--color-md-band)]">
            <SectionHead
              eyebrow="زورينا في جدة"
              title="موقعنا"
              gold="وساعات العمل"
              body="نستقبلك في أجواء هادئة تحفظ خصوصيتك. اطمئني على وقت الدوام، واتركي للخريطة أن تدلّك علينا."
            />
            <Reveal className="mt-12">
              <HoursMap />
            </Reveal>
          </Section>

          {/* ——— split payments ——— */}
          <Section id="installments" className="relative bg-[var(--color-md-bg)]">
            <Glow className="-top-14 left-1/3 h-[300px] w-[560px]" />
            <SectionHead
              eyebrow="الدفع على راحتك"
              title="جمالك اليوم،"
              gold="والدفع على دفعات"
              body="نوفر التقسيط عبر تابي وتمارا داخل العيادة، لتبدئي برنامجك العلاجي اليوم وتقسّمي قيمته على دفعات مريحة."
            />
            <Reveal className="mt-12">
              <Payments />
            </Reveal>
          </Section>

          {/* ——— contact ——— */}
          <Section id="contact" className="bg-[var(--color-md-band)]">
            <Reveal className="relative overflow-hidden rounded-[32px] border border-[var(--color-md-line-strong)] bg-[#120D07] px-7 py-14 text-center sm:px-14">
              <div
                className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 blur-[40px]"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.32), transparent 70%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(240,212,138,.14) 1px, transparent 1px)",
                  backgroundSize: "26px 26px",
                  maskImage:
                    "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
                }}
                aria-hidden
              />

              <div className="relative mx-auto flex max-w-[640px] flex-col items-center">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.3)] px-[18px] py-2 text-[0.78rem] font-bold text-[#F0D48A]">
                  <span
                    className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                    style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
                  />
                  المواعيد محدودة أسبوعياً
                </span>

                <h2 className="mt-6 text-[clamp(1.8rem,4.2vw,2.7rem)] leading-[1.55] font-extrabold text-[#FDF8EE]">
                  ابدئي باستشارة،
                  <br />
                  <span className="md-gold-glow inline-block">
                    <span className="md-gold-text">لا بقرارٍ متعجّل</span>
                  </span>
                </h2>
                <p className="mt-4 text-[1rem] leading-[1.9] font-light text-[#EFE6D6]/70">
                  أخبرينا بما يشغلك، ونرسل لكِ التقييم المبدئي والتكلفة المتوقعة
                  قبل أن تخطي خطوة واحدة نحو العيادة.
                </p>

                <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full px-[32px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_38px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_52px_-8px_rgba(255,223,142,0.8)]"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    <SocialIcon name="whatsapp" className="text-[19px]" />
                    استشارة واتساب
                  </a>
                  <a
                    href={TEL_LINK}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)] hover:shadow-[0_0_28px_-8px_rgba(255,233,168,0.5)]"
                  >
                    <Icon.Phone className="size-[18px]" />
                    <span dir="ltr">{PHONE_DISPLAY}</span>
                  </a>
                </div>

                <ul className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.84rem] font-bold text-[#EFE6D6]/60">
                  {["تقييم مبدئي قبل الحجز", "تكلفة واضحة مسبقاً", "خصوصية تامة"].map(
                    (item) => (
                      <li key={item} className="inline-flex items-center gap-2">
                        <Icon.Check
                          className="size-4 text-[var(--color-md-champagne)]"
                          strokeWidth={3}
                        />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </Reveal>
          </Section>
        </main>

        <Footer />

        <WhatsAppFAB
          whatsappNumber={WHATSAPP_NUMBER}
          topicMessage={WA_TOPIC_MESSAGE}
        />
        <StickyBar />
        <BackToTop />
      </div>
    </Providers>
  );
}
