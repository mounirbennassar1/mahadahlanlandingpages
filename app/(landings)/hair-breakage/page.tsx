import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import {
  Counter,
  Parallax,
  Reveal,
  ScrollProgress,
  SpotlightCard,
} from "./_components/Gsap";
import { Protocol } from "./_components/Protocol";
import { Doctor } from "./_components/Doctor";
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

const SIGNS = [
  "شعيرات قصيرة متطايرة تقف أعلى الرأس مهما مشّطتِ",
  "أطراف بيضاء متشعّبة تصعد مع الوقت نحو منتصف الخصلة",
  "خصلات تتقطع على الفرشاة والمخدة دون جذور في نهايتها",
  "هيشان دائم ولمعان غائب حتى بعد الاستشوار",
];

const CAUSES = [
  {
    icon: Icon.Flame,
    title: "الحرارة اليومية",
    body: "مكواة وسيشوار بدرجات مرتفعة يبخّران رطوبة الشعرة ويكسران بروتينها تدريجياً، حتى تنقصف عند أبسط شد.",
  },
  {
    icon: Icon.Palette,
    title: "الصبغات والمواد الكيميائية",
    body: "التفتيح والصبغ والفرد الكيميائي تفتح قشرة الشعرة لتصل إلى لبّها، وكل جلسة غير مدروسة تُضعف بنيتها الداخلية.",
  },
  {
    icon: Icon.Wheat,
    title: "نقص البروتين والتغذية",
    body: "الشعرة تُبنى من الكيراتين؛ نقص البروتين والحديد وفيتامين د يجعلها تخرج من الجذر رقيقة هشة سريعة التكسر.",
  },
  {
    icon: Icon.Cable,
    title: "الشد والتصفيف القاسي",
    body: "ربطات الذيل المشدودة والتمشيط العنيف على شعر مبلل يقصف الشعرة عند نقاط الضغط نفسها كل يوم.",
  },
  {
    icon: Icon.Droplet,
    title: "الجفاف ونقص الترطيب",
    body: "شمس وماء بحر وكلور ومكيفات… بيئة تسحب الترطيب من شعرك، والشعرة الجافة تنكسر بدل أن تنثني.",
  },
  {
    icon: Icon.Moon,
    title: "عادات صغيرة تتراكم",
    body: "النوم على وسادة قطنية خشنة، منشفة تُفرك بقوة، وتمشيط من الجذور إلى الأطراف: تفاصيل تصنع فرقاً كبيراً.",
  },
];

const MILESTONES = [
  {
    num: "٠١",
    title: "بعد أول جلسة",
    body: "ملمس أنعم ولمعان واضح تحت الضوء، وتمشيط أسهل بشدٍّ أقل.",
    icon: Icon.Sparkles,
  },
  {
    num: "٠٢",
    title: "خلال أسابيع البروتوكول",
    body: "تقصف أقل على الفرشاة، هيشان يتراجع، وأطراف تحافظ على تماسكها.",
    icon: Icon.TrendingUp,
  },
  {
    num: "٠٣",
    title: "مع اكتمال الخطة",
    body: "شعرة أقوى وأكثر مرونة تنثني ولا تنكسر، وعادات عناية ترافقك مدى الحياة.",
    icon: Icon.Crown,
  },
];

const WHY_US = [
  {
    icon: Icon.HeartHandshake,
    title: "تقييم صادق",
    body: "لا نقترح عليكِ إلا ما يحتاجه شعرك فعلاً، وقد نكتفي بخطة منزلية.",
  },
  {
    icon: Icon.BadgeCheck,
    title: "مواد أصلية معتمدة",
    body: "بروتينات ومغذيات من شركات عالمية موثقة، تُفتح أمامك في الجلسة.",
  },
  {
    icon: Icon.Users,
    title: "طاقم نسائي بالكامل",
    body: "خصوصية تامة من الاستقبال حتى غرفة الجلسة وملفك الطبي.",
  },
  {
    icon: Icon.CalendarCheck,
    title: "متابعة حتى النتيجة",
    body: "مراجعات دورية مجدولة نطمئن فيها على تعافي شعرك حتى اكتماله.",
  },
];

const FAQ = [
  {
    q: "ما الفرق بين تساقط الشعر وتكسره؟",
    a: "التساقط يسقط فيه الشعر من الجذر وتجدين بصيلة بيضاء صغيرة في نهايته، أما التكسر فتنقطع الشعرة في منتصفها أو عند أطرافها وتبقى الجذور سليمة. لكلٍّ منهما برنامج علاجي مختلف في عياداتنا، والتقييم الأول يحدد حالتك بدقة.",
  },
  {
    q: "كم عدد الجلسات التي أحتاجها؟",
    a: "يختلف حسب درجة التلف وسببه؛ كثير من الحالات تلاحظ الفرق من الجلسة الأولى، بينما يُبنى بروتوكول الترميم الكامل عادة على عدة جلسات متباعدة تحدد الطبيبة عددها بعد التشخيص الرقمي.",
  },
  {
    q: "هل يناسب العلاج الشعر المصبوغ أو المعالج بالكيراتين؟",
    a: "نعم، بل هو مصمم له؛ الشعر المصبوغ والمفرود كيميائياً أكثر عرضة للتكسر. نختار تركيبات ترميم تناسب حالة شعرك الحالية دون التعارض مع لونه أو معالجاته السابقة.",
  },
  {
    q: "هل جلسات البروتين لدينا تفرد الشعر؟",
    a: "هدفنا علاجي وليس تغيير شكل الشعر: نعيد بناء الشعرة المتضررة ونغذيها. قد تلاحظين نعومة ولمعاناً أعلى، لكن الكيرلي يبقى كيرلي، ولا نستخدم تركيبات فرد قاسية.",
  },
  {
    q: "متى ألاحظ اختفاء التقصف فعلياً؟",
    a: "اللمعان والنعومة يظهران مبكراً، أما توقف التكسر فيُقاس مع الأسابيع: شعر أقل على الفرشاة والمخدة، وأطراف تحافظ على كثافتها. النتائج تختلف من حالة إلى أخرى بحسب الالتزام بالخطة المنزلية.",
  },
  {
    q: "هل يمكنني تقسيط تكلفة الجلسات؟",
    a: "نعم، تتوفر خيارات الدفع الآجل عبر تابي وتمارا داخل العيادة، ويشرح لك فريق الاستقبال التفاصيل عند تأكيد الحجز.",
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
      <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-hab-gold)]">
        {eyebrow}
      </span>
      <h2 className="m-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
        {title} {highlight && <span className="hab-gold-text">{highlight}</span>}
      </h2>
      {sub && (
        <p className="m-0 max-w-[54ch] font-light text-[var(--color-hab-muted)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export default function HairBreakagePage() {
  return (
    <main>
      <ScrollProgress />
      <Header />
      <Hero videoSrc="/hair-breakage/hero-loop.mp4" />
      <MarqueeStrip />

      {/* ——— تساقط أم تكسر؟ ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] pt-[110px] pb-[90px]">
        <SectionHead
          eyebrow="٠١ ، افهمي شعرك"
          title="هل هو تساقط…"
          highlight="أم تكسر؟"
          sub="أكثر ما يؤخر العلاج هو الخلط بينهما. التكسر يقصف الشعرة في منتصفها ويترك الجذور سليمة، وعلاجه يختلف تماماً عن علاج التساقط."
        />
        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* علامات التكسر */}
          <Reveal>
            <div className="rounded-[26px] border border-[var(--color-hab-line)] bg-[var(--color-hab-card)] p-8">
              <h3 className="mt-0 mb-5 text-[1.25rem] font-extrabold">
                علامات تدل أن شعرك <span className="hab-gold-text">يتكسر</span>
              </h3>
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                {SIGNS.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.12)]">
                      <Icon.Check
                        className="size-3 text-[var(--color-hab-champagne)]"
                        strokeWidth={3}
                      />
                    </span>
                    <span className="text-[0.96rem] font-light text-[rgba(245,239,224,0.78)]">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* مقارنة سريعة */}
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-[26px] border border-[var(--color-hab-line)]">
              <div className="grid grid-cols-2 gap-px bg-[var(--color-hab-line)]">
                <div className="bg-[var(--color-hab-band)] p-6">
                  <span className="mb-3 inline-flex items-center gap-2 text-[0.8rem] font-extrabold text-[var(--color-hab-champagne)]">
                    <Icon.Scissors className="size-4" />
                    التكسر
                  </span>
                  <p className="m-0 text-[0.9rem] font-light text-[rgba(245,239,224,0.75)]">
                    الشعرة تنقطع في منتصفها أو عند الأطراف، بلا بصيلة في
                    نهايتها. السبب في جذع الشعرة نفسه: حرارة، صبغات، أو نقص
                    بروتين.
                  </p>
                </div>
                <div className="bg-[var(--color-hab-band)] p-6">
                  <span className="mb-3 inline-flex items-center gap-2 text-[0.8rem] font-extrabold text-[rgba(245,239,224,0.55)]">
                    <Icon.ArrowDown className="size-4" />
                    التساقط
                  </span>
                  <p className="m-0 text-[0.9rem] font-light text-[rgba(245,239,224,0.6)]">
                    الشعرة تسقط كاملة من الجذر مع بصيلتها البيضاء. السبب في
                    الجذر والفروة، وعلاجه برنامج مختلف تماماً.
                  </p>
                </div>
              </div>
              <div className="border-t border-[var(--color-hab-line)] bg-[var(--color-hab-card)] px-6 py-5">
                <p className="m-0 text-[0.88rem] font-light text-[var(--color-hab-muted)]">
                  <b className="font-extrabold text-[var(--color-hab-champagne)]">
                    هذه الصفحة مخصصة للتكسر والتقصف.
                  </b>{" "}
                  وإن أظهر التقييم أن حالتك تساقط من الجذور، نوجهك مباشرة إلى
                  برنامجنا العلاجي المستقل لتساقط الشعر.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— الأسباب ——— */}
      <section className="relative border-y border-[rgba(212,175,55,0.14)] bg-[var(--color-hab-band)] px-[22px] py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow="٠٢ ، الأسباب"
            title="ستة أسباب تكسر شعرك"
            highlight="كل يوم"
            sub="حددي أسبابك أثناء التصفح؛ غالباً يجتمع أكثر من سبب واحد، ولهذا يبدأ علاجنا دائماً بالتشخيص لا بالمستحضرات."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAUSES.map((c, i) => (
              <SpotlightCard
                key={c.title}
                delay={(i % 3) * 80}
                className="rounded-[22px] px-[26px] py-[30px]"
              >
                <div
                  className="mb-4 flex size-[46px] items-center justify-center rounded-[14px] border border-[rgba(212,175,55,0.3)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,.18), rgba(138,100,48,.08))",
                  }}
                >
                  <c.icon
                    className="size-[22px] text-[var(--color-hab-champagne)]"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="mb-2 text-[1.1rem] font-extrabold">{c.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[var(--color-hab-muted)]">
                  {c.body}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ——— البروتوكول (مثبّت ومقاد بالتمرير على الشاشات الكبيرة) ——— */}
      <section className="relative py-[110px] lg:py-0">
        <div className="px-[22px] pt-0 lg:pt-[110px]">
          <SectionHead
            eyebrow="٠٣ ، البروتوكول"
            title="من التقصف إلى اللمعان…"
            highlight="بأربع خطوات"
            sub="تابعي الرحلة خطوة بخطوة: تشخيص يحدد السبب، ترميم يعيد البناء، تغذية من الجذور، وخطة تحافظ على النتيجة."
          />
        </div>
        <Protocol />
      </section>

      {/* ——— النتائج ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(212,175,55,0.14)] bg-[var(--color-hab-bg-deep)] px-[22px] py-[100px]">
        {/* liquid gold strands backdrop */}
        <Parallax
          from={-40}
          to={40}
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
        >
          <Image
            src="/hair-breakage/strands.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </Parallax>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, rgba(6,6,7,.9))",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow="٠٤ ، النتائج"
            title="نتيجة تلمع"
            highlight="تحت الضوء"
            sub="لا وعود مبالغاً بها: هذا ما تتوقعينه فعلياً في كل مرحلة من مراحل البروتوكول."
          />
          <div className="grid gap-[22px] md:grid-cols-3">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.num} delay={i * 120}>
                <div className="relative h-full overflow-hidden rounded-[22px] border border-[var(--color-hab-line)] bg-[rgba(16,16,20,0.82)] px-7 py-[34px] backdrop-blur-md">
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{
                      background:
                        "linear-gradient(90deg, #8A6430, #F0D48A, transparent)",
                    }}
                    aria-hidden
                  />
                  <span className="text-[2.4rem] leading-none font-extrabold text-[rgba(212,175,55,0.22)]">
                    {m.num}
                  </span>
                  <m.icon
                    className="mt-3 size-6 text-[var(--color-hab-champagne)]"
                    strokeWidth={1.8}
                  />
                  <h3 className="mt-3 mb-2.5 text-[1.15rem] font-extrabold">
                    {m.title}
                  </h3>
                  <p className="m-0 text-[0.94rem] font-light text-[var(--color-hab-muted)]">
                    {m.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* proof counters */}
          <Reveal delay={140} className="mt-12">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-hab-line)] bg-[var(--color-hab-line)] sm:grid-cols-3">
              <div className="flex flex-col items-center gap-1 bg-[rgba(16,16,20,0.85)] px-6 py-8">
                <Counter
                  value={1270}
                  prefix="+"
                  className="text-[2rem] font-extrabold text-[var(--color-hab-champagne)]"
                />
                <span className="text-[0.82rem] font-bold text-[rgba(245,239,224,0.55)]">
                  تقييم موثق على Google بمتوسط ٤٫٨ من ٥
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-[rgba(16,16,20,0.85)] px-6 py-8">
                <Counter
                  value={13}
                  prefix="+"
                  suffix=" عاماً"
                  className="text-[2rem] font-extrabold text-[var(--color-hab-champagne)]"
                />
                <span className="text-[0.82rem] font-bold text-[rgba(245,239,224,0.55)]">
                  من الخبرة في الجلدية والتجميل اللاجراحي
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-[rgba(16,16,20,0.85)] px-6 py-8">
                <Counter
                  value={100}
                  suffix="٪"
                  className="text-[2rem] font-extrabold text-[var(--color-hab-champagne)]"
                />
                <span className="text-[0.82rem] font-bold text-[rgba(245,239,224,0.55)]">
                  طاقم نسائي وخصوصية تامة داخل العيادة
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-[18px] mb-0 text-center text-[0.78rem] text-[rgba(245,239,224,0.4)]">
              تختلف النتائج من حالة إلى أخرى بحسب درجة التلف والالتزام بالخطة،
              ويحدد التقييم الطبي ما يناسبك.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— الطبيبة ——— */}
      <section className="relative overflow-hidden px-[22px] py-[110px]">
        <div
          className="pointer-events-none absolute -top-[120px] -left-[140px] size-[420px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,.18), transparent 65%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1080px]">
          <SectionHead
            eyebrow="٠٥ ، بإشراف"
            title="طبيبة تفهم"
            highlight="لغة شعرك"
            sub="فلسفتنا في علاج التكسر تقوم على التشخيص قبل العلاج: نحدد السبب بدقة، ثم نختار أقل الجلسات عدداً وأكثرها أثراً."
          />
          <Doctor />

          {/* لماذا عيادة مها دحلان */}
          <Reveal delay={120} className="mt-14">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-hab-line)] bg-[var(--color-hab-line)] sm:grid-cols-2 lg:grid-cols-4">
              {WHY_US.map((u) => (
                <div
                  key={u.title}
                  className="flex flex-col gap-2 bg-[var(--color-hab-card)] px-6 py-7"
                >
                  <u.icon
                    className="size-6 text-[var(--color-hab-champagne)]"
                    strokeWidth={1.8}
                  />
                  <b className="text-[1rem] font-extrabold">{u.title}</b>
                  <p className="m-0 text-[0.86rem] font-light text-[var(--color-hab-muted)]">
                    {u.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— قالوا عنا ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(212,175,55,0.14)] bg-[var(--color-hab-band)] py-[100px]">
        <div className="px-[22px]">
          <SectionHead
            eyebrow="٠٦ ، قالوا عنا"
            title="ثقةٌ تتحدث"
            highlight="عن نفسها"
            sub="من تقييمات Google الحقيقية لعيادات مها دحلان: ٤٫٨ من ٥ عبر أكثر من ١٢٧٠ تقييم."
          />
        </div>
        <Testimonials />
      </section>

      {/* ——— الأسئلة الشائعة ——— */}
      <section className="relative mx-auto max-w-[780px] px-[22px] pt-[110px] pb-[110px]">
        <SectionHead
          eyebrow="٠٧ ، الأسئلة الشائعة"
          title="كل ما يهمّك"
          highlight="معرفته"
        />
        <div className="flex flex-col gap-3.5">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="overflow-hidden rounded-[18px] border border-[rgba(212,175,55,0.2)] bg-[var(--color-hab-card)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-extrabold">
                  {f.q}
                  <span className="hab-pm inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] text-[1.2rem] font-normal text-[var(--color-hab-champagne)]">
                    +
                  </span>
                </summary>
                <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[rgba(245,239,224,0.65)]">
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
          <div className="relative overflow-hidden rounded-[32px] border border-[rgba(212,175,55,0.25)] bg-[var(--color-hab-bg-deep)] p-[clamp(36px,6vw,70px)]">
            <div
              className="pointer-events-none absolute -top-[180px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 blur-[30px]"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(240,212,138,.2), transparent 70%)",
                animation: "hab-breathe 7s ease-in-out infinite",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(240,212,138,.1) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center justify-center gap-[46px]">
              <div className="min-w-[290px] max-w-[520px] flex-1 text-[var(--color-hab-ink)]">
                <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-hab-champagne)]">
                  ٠٨ ، الحجز
                </span>
                <h2 className="mt-3 mb-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
                  تقييم شعرك{" "}
                  <span className="hab-gold-text">يبدأ من هنا</span>
                </h2>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(240,212,138,0.35)] bg-[rgba(240,212,138,0.08)] px-4 py-1.5 text-[0.78rem] font-extrabold text-[var(--color-hab-champagne)]">
                  <Icon.Sparkles className="size-3.5" />
                  مقاعد التقييم محدودة أسبوعياً
                </span>
                <p className="mt-3.5 mb-0 font-light text-[rgba(245,239,224,0.7)]">
                  اتركي بياناتك وسيتواصل معك فريقنا في نفس اليوم لتنسيق موعدك
                  وتقدير خطتك وتكلفتها بشفافية كاملة.
                </p>
                <div className="mt-[26px] flex flex-col gap-3.5">
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(245,239,224,0.75)]">
                    <Icon.Lock className="size-4 shrink-0 text-[var(--color-hab-champagne)]" />
                    خصوصية تامة وملف طبي سرّي
                  </span>
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(245,239,224,0.75)]">
                    <Icon.CircleCheck className="size-4 shrink-0 text-[var(--color-hab-champagne)]" />
                    تقييم صادق دون أي التزام
                  </span>
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(245,239,224,0.75)]">
                    <Icon.Clock className="size-4 shrink-0 text-[var(--color-hab-champagne)]" />
                    ردٌّ سريع خلال ساعات العمل
                  </span>
                </div>

                {/* الدفع الآجل */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="text-[0.82rem] font-bold text-[rgba(245,239,224,0.6)]">
                    قسّطي جلساتك مع
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F5EFE0] px-3.5 py-1.5">
                    <Image
                      src="/tabby.png"
                      alt="تابي"
                      width={52}
                      height={20}
                      className="h-5 w-auto object-contain"
                    />
                  </span>
                  <span className="inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#F5EFE0] px-3.5 py-1.5">
                    <Image
                      src="/tamara.jpeg"
                      alt="تمارا"
                      width={52}
                      height={20}
                      className="h-5 w-auto object-contain"
                    />
                  </span>
                </div>

                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(37,211,102,0.5)] px-[26px] py-[13px] text-[0.95rem] font-extrabold text-[#25D366] transition-colors duration-300 hover:bg-[rgba(37,211,102,0.1)]"
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
      <footer className="border-t border-[var(--color-hab-line)] px-[22px] pt-11 pb-[120px] text-center md:pb-11">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/hair-breakage/logo.webp"
            alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
            width={110}
            height={110}
            className="size-[110px] object-contain brightness-0 invert opacity-90"
          />
        </div>
        <div className="flex justify-center gap-5 text-[0.86rem]">
          <a
            dir="ltr"
            href={TEL_LINK}
            className="text-[var(--color-hab-gold-soft)] hover:text-[var(--color-hab-champagne)]"
          >
            {PHONE_DISPLAY}
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-hab-gold-soft)] hover:text-[var(--color-hab-champagne)]"
          >
            واتساب العيادة
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href="#booking"
            className="text-[var(--color-hab-gold-soft)] hover:text-[var(--color-hab-champagne)]"
          >
            حجز استشارة
          </a>
        </div>
        <p className="mt-4 mb-0 text-[0.74rem] text-[rgba(245,239,224,0.35)]">
          جميع العلاجات تُجرى بعد تقييم طبي متخصص. النتائج تختلف من حالة إلى
          أخرى.
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="hab"
        whatsappNumber={WHATSAPP_NUMBER}
        topicMessage={WA_TOPIC_MESSAGE}
      />
      <StickyBar />
    </main>
  );
}
