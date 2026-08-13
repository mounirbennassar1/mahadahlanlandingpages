import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { almarai } from "@/lib/fonts";
import { Icon, SocialIcon } from "@/components/icons";
import { Providers } from "@/components/providers/Providers";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { MobileStickyCTA } from "@/components/usablecomponents/MobileStickyCTA";
import { Header } from "./_home/Header";
import { HeroSlider } from "./_home/HeroSlider";
import { MarqueeStrip } from "./_home/MarqueeStrip";
import { Specialties } from "./_home/Specialties";
import { Testimonials } from "./_home/Testimonials";
import { Footer } from "./_home/Footer";
import {
  BackToTop,
  Counter,
  Parallax,
  Reveal,
  RevealGroup,
  ScrollProgress,
} from "./_home/Motion";
import {
  GOLD_GRADIENT,
  PHONE_DISPLAY,
  SPECIALTIES,
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

/* Warm ivory ground, bronze/champagne gold accents, deep coffee ink —
   the palette shared with the newest landings. */
const paletteVars: CSSProperties = {
  "--color-md-bg": "#FBF8F3",
  "--color-md-band": "#F5EFE4",
  "--color-md-card": "#FFFDF9",
  "--color-md-ink": "#271C11",
  "--color-md-ink-soft": "#5C4526",
  "--color-md-muted": "rgba(39,28,17,.62)",
  "--color-md-bronze": "#8A6430",
  "--color-md-gold": "#A67C3D",
  "--color-md-gold-bright": "#C99C4E",
  "--color-md-champagne": "#E0BE7A",
  "--color-md-cream": "#FAF4E8",
  "--color-md-dark": "#271C11",
  "--color-md-line": "rgba(166,124,61,.18)",
  "--color-md-line-strong": "rgba(166,124,61,.35)",
  background: "#FBF8F3",
  color: "#271C11",
} as CSSProperties;

const STATS = [
  { to: 1270, prefix: "+", suffix: "", label: "تقييم موثّق على Google" },
  { to: 13, prefix: "+", suffix: "", label: "عاماً من الخبرة التجميلية" },
  { to: SPECIALTIES.length, prefix: "", suffix: "", label: "برنامجاً علاجياً متخصصاً" },
  { to: 100, prefix: "", suffix: "٪", label: "طاقم نسائي وخصوصية تامة" },
];

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

const TEAM = [
  {
    name: "نضال الجريدي",
    title: "أخصائية التجميل اللاجراحي",
    image: "/neck-lift/nidhal.jpg",
  },
  {
    name: "فادية المنصور",
    title: "أخصائية التجميل اللاجراحي",
    image: "/neck-lift/fadia.jpg",
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
      <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(255,253,249,0.75)] px-[18px] py-2 text-[0.78rem] font-bold tracking-[0.04em] text-[var(--color-md-bronze)]">
        <span className="size-1.5 rounded-full bg-[var(--color-md-gold-bright)]" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.55] font-extrabold tracking-[-0.01em]">
        {title}
        {gold ? (
          <>
            {" "}
            <span className="md-gold-text">{gold}</span>
          </>
        ) : null}
      </h2>
      {body ? (
        <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-[1.9] font-light text-[rgba(39,28,17,0.65)]">
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
          <HeroSlider />
          <MarqueeStrip />

          {/* ——— proof band ——— */}
          <Section className="bg-[var(--color-md-bg)]">
            <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-[26px] border border-[var(--color-md-line)] bg-[var(--color-md-line)] lg:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-2 bg-[var(--color-md-card)] px-4 py-9 text-center"
                >
                  <b className="text-[clamp(1.9rem,4vw,2.6rem)] leading-none font-extrabold text-[var(--color-md-bronze)]">
                    <Counter value={s.to} prefix={s.prefix} suffix={s.suffix} />
                  </b>
                  <span className="max-w-[18ch] text-[0.84rem] font-bold text-[rgba(39,28,17,0.55)]">
                    {s.label}
                  </span>
                </div>
              ))}
            </RevealGroup>
          </Section>

          {/* ——— specialties ——— */}
          <Section id="specialties" className="bg-[var(--color-md-band)]">
            <SectionHead
              eyebrow="تخصصاتنا"
              title="كل ما تحتاجينه"
              gold="تحت سقفٍ واحد"
              body="أربعة عشر برنامجاً علاجياً متخصصاً، لكلٍّ منها بروتوكول مستقل وفريق مدرَّب وأجهزة معتمدة. اختاري ما يعنيكِ واقرئي التفاصيل كاملة قبل أن تحجزي."
            />
            <Specialties />
          </Section>

          {/* ——— why us ——— */}
          <Section id="why" className="bg-[var(--color-md-bg)]">
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
                    className="inline-flex items-center gap-2.5 rounded-full px-[30px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_18px_44px_-14px_rgba(166,124,61,0.55)] transition-all duration-300 hover:-translate-y-[3px]"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    احجزي استشارتك الخاصة
                    <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
                  </a>
                </Reveal>
              </div>

              <RevealGroup className="grid gap-5 sm:grid-cols-2">
                {WHY_US.map((card) => (
                  <div
                    key={card.title}
                    className="group rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(166,124,61,0.42)] hover:shadow-[0_28px_56px_-30px_rgba(138,100,48,0.45)]"
                  >
                    <span
                      className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-[var(--color-md-ink)] transition-transform duration-400 group-hover:scale-110"
                      style={{ background: GOLD_GRADIENT }}
                      aria-hidden
                    >
                      <card.icon className="size-[22px]" strokeWidth={2} />
                    </span>
                    <h3 className="text-[1.08rem] font-extrabold">{card.title}</h3>
                    <p className="mt-2.5 text-[0.92rem] leading-[1.85] font-light text-[rgba(39,28,17,0.66)]">
                      {card.body}
                    </p>
                  </div>
                ))}
              </RevealGroup>
            </div>
          </Section>

          {/* ——— journey ——— */}
          <Section id="journey" className="relative bg-[var(--color-md-band)]">
            <SectionHead
              eyebrow="رحلتك معنا"
              title="أربع خطوات"
              gold="من أول سؤال حتى النتيجة"
            />

            <RevealGroup className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {JOURNEY.map((step) => (
                <div
                  key={step.num}
                  className="relative flex flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7"
                >
                  <span className="absolute -top-4 right-7 rounded-full bg-[var(--color-md-dark)] px-3.5 py-1.5 text-[0.78rem] font-extrabold text-[#F0D48A]">
                    {step.num}
                  </span>
                  <span
                    className="mt-3 mb-4 inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-md-line)] bg-[var(--color-md-cream)] text-[var(--color-md-bronze)]"
                    aria-hidden
                  >
                    <step.icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="text-[1.05rem] font-extrabold">{step.title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(39,28,17,0.66)]">
                    {step.body}
                  </p>
                </div>
              ))}
            </RevealGroup>
          </Section>

          {/* ——— team ——— */}
          <Section className="bg-[var(--color-md-bg)]">
            <SectionHead
              eyebrow="من يقف خلف نتيجتك"
              title="أيدٍ خبيرة"
              gold="وعينٌ تعرف التفاصيل"
              body="فريق نسائي متخصص في التجميل اللاجراحي، يعمل بإشراف د. مها دحلان، استشارية الجلدية والتجميل والليزر."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {TEAM.map((member, i) => (
                <Reveal key={member.name} delay={i * 100}>
                  <article className="group relative h-full overflow-hidden rounded-[26px] border border-[var(--color-md-line)] bg-[var(--color-md-card)]">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 1024px) 92vw, 360px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(39,28,17,.82), rgba(39,28,17,.1) 45%, transparent 65%)",
                        }}
                        aria-hidden
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <h3 className="text-[1.35rem] font-extrabold text-[#FDF8EE]">
                          {member.name}
                        </h3>
                        <p className="mt-1 text-[0.86rem] font-bold text-[var(--color-md-champagne)]">
                          {member.title}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}

              {/* supervising-doctor card, logo instead of a portrait */}
              <Reveal delay={200}>
                <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] bg-[var(--color-md-dark)] p-8 text-[#EFE6D6]">
                  <div
                    className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full blur-[40px]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(201,156,78,.3), transparent 70%)",
                    }}
                    aria-hidden
                  />
                  <div className="relative">
                    <Image
                      src="/logo.png"
                      alt="عيادات د. مها دحلان"
                      width={64}
                      height={64}
                      className="size-16 object-contain"
                    />
                    <h3 className="mt-6 text-[1.5rem] leading-[1.5] font-extrabold">
                      بإشراف د. مها دحلان
                    </h3>
                    <p className="mt-2 text-[0.9rem] font-bold text-[var(--color-md-champagne)]">
                      استشارية الجلدية والتجميل والليزر
                    </p>
                    <p className="mt-4 text-[0.92rem] leading-[1.9] font-light text-[#EFE6D6]/70">
                      كل خطة علاجية تمرّ على عينٍ واحدة قبل أن تبدأ، لتخرجي بنتيجة
                      طبيعية تشبهك ولا تُشبه أحداً غيرك.
                    </p>
                  </div>

                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mt-8 inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-6 py-3.5 text-[0.9rem] font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)]"
                  >
                    <SocialIcon name="whatsapp" className="text-[#25D366]" />
                    اسألي الفريق مباشرة
                  </a>
                </article>
              </Reveal>
            </div>
          </Section>

          {/* ——— reviews ——— */}
          <Section id="reviews" className="overflow-hidden bg-[var(--color-md-band)]">
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

          {/* ——— contact ——— */}
          <Section id="contact" className="bg-[var(--color-md-bg)]">
            <Reveal className="relative overflow-hidden rounded-[32px] bg-[var(--color-md-dark)] px-7 py-14 text-center sm:px-14">
              <div
                className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 blur-[40px]"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.3), transparent 70%)",
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
                    className="size-1.5 rounded-full bg-[var(--color-md-gold-bright)]"
                    style={{ boxShadow: "0 0 8px 2px rgba(201,156,78,.6)" }}
                  />
                  المواعيد محدودة أسبوعياً
                </span>

                <h2 className="mt-6 text-[clamp(1.8rem,4.2vw,2.7rem)] leading-[1.55] font-extrabold text-[#FDF8EE]">
                  ابدئي باستشارة،
                  <br />
                  <span className="md-gold-text">لا بقرارٍ متعجّل</span>
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
                    className="inline-flex items-center justify-center gap-2.5 rounded-full px-[32px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_18px_44px_-14px_rgba(201,156,78,0.5)] transition-transform duration-300 hover:-translate-y-[3px]"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    <SocialIcon name="whatsapp" className="text-[19px]" />
                    استشارة واتساب
                  </a>
                  <a
                    href={TEL_LINK}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-colors duration-300 hover:bg-[rgba(240,212,138,0.1)]"
                  >
                    <Icon.Phone className="size-[18px]" />
                    {PHONE_DISPLAY}
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
        <MobileStickyCTA
          tokenPrefix="md"
          bookHref="#contact"
          whatsappNumber={WHATSAPP_NUMBER}
          topicMessage={WA_TOPIC_MESSAGE}
        />
        <BackToTop />
      </div>
    </Providers>
  );
}
