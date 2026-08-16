import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import { Parallax, Reveal, ScrollProgress, SpotlightCard } from "./_components/Gsap";
import { Stages } from "./_components/Stages";
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

const CAUSES = [
  {
    icon: Icon.Droplet,
    title: "جفاف الجلد المزمن",
    body: "جلد الكعب سميك وقليل الغدد الدهنية، فيفقد رطوبته أسرع من باقي الجسم ويتيبس مع الوقت.",
  },
  {
    icon: Icon.Clock,
    title: "الوقوف الطويل",
    body: "ساعات الوقوف اليومية تضغط على وسادة الكعب فتتمدد جوانبها، وأي جفاف يتحول إلى شقوق.",
  },
  {
    icon: Icon.Footprints,
    title: "الأحذية المفتوحة والاحتكاك",
    body: "الصنادل والأحذية الخلفية المفتوحة تترك الكعب بلا دعم، فيحتك ويتصلب جلده تدريجياً.",
  },
  {
    icon: Icon.ShowerHead,
    title: "الماء الساخن والصابون القاسي",
    body: "الاستحمام الطويل بماء ساخن والصوابين القلوية يجردان الجلد من زيوته الواقية.",
  },
  {
    icon: Icon.Scale,
    title: "زيادة الوزن والحمل",
    body: "الوزن الزائد يضاعف الضغط على الكعبين، لذلك تشيع التشققات في الحمل ومع تغيرات الوزن.",
  },
  {
    icon: Icon.Stethoscope,
    title: "أسباب صحية خفية",
    body: "السكري والأكزيما والفطريات وقصور الغدة الدرقية قد تقف خلف التشقق، لذلك نفحص قبل أن نعالج.",
  },
];

const PROTOCOL = [
  {
    num: "٠١",
    icon: Icon.ClipboardCheck,
    title: "التقييم والفحص الطبي",
    tag: "الخطوة الأساس قبل أي علاج",
    body: "نفحص الكعبين والجلد ونستبعد الأسباب الصحية كالفطريات والأكزيما والسكري، ثم نحدد مرحلة التشقق بدقة.",
  },
  {
    num: "٠٢",
    icon: Icon.ShieldCheck,
    title: "الباديكير الطبي المعقم",
    tag: "جلسة مريحة غير مؤلمة",
    body: "إزالة الجلد المتصلب والميت بلطف وبأدوات طبية معقمة، فيتنفس الجلد الجديد وتلتئم الشقوق أسرع.",
  },
  {
    num: "٠٣",
    icon: Icon.Layers,
    title: "التقشير العلاجي",
    tag: "ملمس أنعم من أولى الجلسات",
    body: "مقشرات طبية مدروسة التركيز تجدد سطح الجلد وتمنع تراكم الطبقات المتصلبة من جديد.",
  },
  {
    num: "٠٤",
    icon: Icon.Droplets,
    title: "الترطيب العميق المكثف",
    tag: "نعومة تدوم لا تزول",
    body: "أقنعة ترطيب مكثف وكريمات طبية ترمم حاجز الجلد وتحبس الرطوبة في عمق وسادة الكعب.",
  },
  {
    num: "٠٥",
    icon: Icon.Sparkles,
    title: "توحيد اللون وعلاج التصبغات",
    tag: "بعد التئام التشققات",
    body: "متى التأم الجلد نقيّم التصبغات الداكنة، وقد نقترح تقشيراً طبياً أو جلسات ليزر إذا كانت حالتك مناسبة طبياً.",
  },
  {
    num: "٠٦",
    icon: Icon.CalendarCheck,
    title: "الخطة المنزلية والمتابعة",
    tag: "متابعة حتى النتيجة",
    body: "روتين منزلي بسيط مصمم لك، ومواعيد مراجعة دورية نطمئن فيها على ثبات النعومة واكتمال النتيجة.",
  },
];

const WHY_US = [
  {
    icon: Icon.HeartHandshake,
    title: "تقييم صادق",
    body: "لا نقترح عليكِ إلا ما تحتاجينه فعلاً، وقد تكفي جلسات قليلة.",
  },
  {
    icon: Icon.BadgeCheck,
    title: "بروتوكول معقم بالكامل",
    body: "أدوات تفتح أمامك في الجلسة ومعايير تعقيم طبية صارمة.",
  },
  {
    icon: Icon.Users,
    title: "طاقم نسائي بالكامل",
    body: "خصوصية تامة من الاستقبال حتى غرفة الجلسة وملفك الطبي.",
  },
  {
    icon: Icon.CalendarCheck,
    title: "متابعة حتى النتيجة",
    body: "مراجعات مجدولة نطمئن فيها على تطور نتيجتك حتى اكتمالها.",
  },
];

const RESULTS = [
  "كعبان ناعمان بلا خشونة ولا جلد متصلب",
  "اختفاء تدريجي للشقوق ولألم المشي",
  "لون موحد ومظهر مشرق لمحيط الكعب",
  "ثقة كاملة بالصنادل والأحذية المفتوحة",
];

const FAQ = [
  {
    q: "كم جلسة أحتاج حتى تختفي التشققات؟",
    a: "بحسب المرحلة؛ الجفاف والخشونة غالباً من جلسة إلى ثلاث جلسات، بينما تحتاج التشققات العميقة خطة من عدة جلسات مع روتين منزلي مساند. نحدد العدد بدقة وشفافية في جلسة التقييم.",
  },
  {
    q: "هل جلسة الباديكير الطبي مؤلمة؟",
    a: "لا؛ تُجرى الجلسة بلطف وبأدوات طبية معقمة، ويصفها معظم مراجعاتنا بأنها مريحة أشبه بجلسة عناية واسترخاء.",
  },
  {
    q: "هل العلاج آمن لمريضات السكري؟",
    a: "نعم، بل هو مهم بشكل خاص لهن؛ العناية بالقدم لمريضة السكري تتم عندنا بعد تقييم دقيق وببروتوكول معقم شديد الحذر، مع تنسيق الخطة مع حالتك الصحية.",
  },
  {
    q: "متى ألاحظ النتيجة؟",
    a: "نعومة ملحوظة غالباً من الجلسة الأولى، بينما تتحسن التشققات العميقة والتصبغات تدريجياً خلال أسابيع مع الالتزام بالخطة المنزلية والمتابعة.",
  },
  {
    q: "هل تُعالج التصبغات الداكنة حول الكعب؟",
    a: "نعم؛ بعد التئام التشققات نقيّم درجة التصبغ، وقد نقترح تقشيراً طبياً أو جلسات ليزر لتوحيد اللون إذا كانت حالتك مناسبة طبياً.",
  },
  {
    q: "كيف أحافظ على النتيجة بعد انتهاء الجلسات؟",
    a: "بروتين منزلي بسيط نصممه لك: ترطيب يومي، تقشير لطيف دوري، وأحذية مناسبة، مع مراجعات دورية عند الحاجة لتبقى النعومة ثابتة.",
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
      <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-crh-gold)]">
        {eyebrow}
      </span>
      <h2 className="m-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
        {title}{" "}
        {highlight && <span className="crh-gold-text">{highlight}</span>}
      </h2>
      {sub && (
        <p className="m-0 max-w-[54ch] font-light text-[var(--color-crh-muted)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export default function CrackedHeelsPage() {
  return (
    <main>
      <ScrollProgress />
      <Header />
      <Hero />
      <MarqueeStrip />

      {/* ——— الأسباب ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] pt-[110px] pb-[90px]">
        <SectionHead
          eyebrow="٠١ ، الأسباب"
          title="لماذا تتشقق"
          highlight="الكعبان؟"
          sub="جلد الكعب يحمل وزنك في كل خطوة، وأسباب كثيرة تتكاتف عليه بصمت. حددي أسبابك من الست الأكثر شيوعاً، وكلها قابلة للعلاج."
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
                    "linear-gradient(135deg, rgba(228,200,126,.18), rgba(140,106,63,.08))",
                }}
              >
                <c.icon className="size-[22px] text-[var(--color-crh-gold-soft)]" strokeWidth={1.8} />
              </div>
              <h3 className="mb-2 text-[1.1rem] font-extrabold">{c.title}</h3>
              <p className="m-0 text-[0.92rem] font-light text-[var(--color-crh-muted)]">
                {c.body}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ——— المراحل (مثبتة ومتدرجة مع التمرير) ——— */}
      <Stages />

      {/* ——— البروتوكول ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow="٠٣ ، البروتوكول"
          title="بروتوكول العناية الطبية"
          highlight="بالقدم"
          sub="لا توجد وصفة واحدة تناسب الجميع؛ بعد التقييم نبني خطتك من هذه الخطوات، بأقل تدخل ممكن وأثر يدوم."
        />
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {PROTOCOL.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 90}>
              <div className="relative overflow-hidden rounded-3xl border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] px-7 py-[34px] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(228,200,126,0.5)] hover:shadow-[0_28px_58px_-26px_rgba(212,175,55,0.4)]">
                <span className="absolute top-3.5 left-5 text-[3.2rem] leading-none font-extrabold text-[rgba(212,175,55,0.1)]">
                  {s.num}
                </span>
                <div
                  className="mb-[18px] flex size-[52px] items-center justify-center rounded-full shadow-[0_10px_24px_-10px_rgba(212,175,55,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #8C6A3F, #E4C87E)",
                  }}
                >
                  <s.icon className="size-6 text-[#1C120C]" strokeWidth={1.8} />
                </div>
                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(176,141,87,0.3)] bg-[rgba(212,175,55,0.1)] px-3 py-1 text-[0.72rem] font-extrabold text-[var(--color-crh-gold-soft)]">
                  <Icon.Check className="size-3" strokeWidth={3} />
                  {s.tag}
                </span>
                <h3 className="mb-2.5 text-[1.2rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.94rem] font-light text-[var(--color-crh-muted)]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* لماذا عيادة مها دحلان */}
        <Reveal delay={120} className="mt-14">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-crh-line)] bg-[var(--color-crh-line)] sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((u) => (
              <div
                key={u.title}
                className="flex flex-col gap-2 bg-[var(--color-crh-card)] px-6 py-7"
              >
                <u.icon className="size-6 text-[var(--color-crh-gold-soft)]" strokeWidth={1.8} />
                <b className="text-[1rem] font-extrabold">{u.title}</b>
                <p className="m-0 text-[0.86rem] font-light text-[var(--color-crh-muted)]">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ——— النتائج ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(176,141,87,0.15)] bg-[var(--color-crh-band)] px-[22px] py-[100px]">
        <div
          className="pointer-events-none absolute -top-[120px] -left-[140px] size-[420px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(228,200,126,.18), transparent 65%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow="٠٤ ، النتائج"
            title="نتائج تلمسينها…"
            highlight="لا تُقال فقط"
            sub="جلسة داخل غرفنا تشبه جلسة سبا فاخرة، لكن خلفها بروتوكول طبي دقيق يترك أثراً يدوم."
          />
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Parallax from={26} to={-26}>
              <Reveal>
                <div className="relative overflow-hidden rounded-[30px] border border-[var(--color-crh-line-strong)] shadow-[0_44px_90px_-40px_rgba(0,0,0,0.9)]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/cracked-heels/pedicure.jpg"
                      alt="جلسة عناية طبية بالكعب داخل العيادة"
                      fill
                      sizes="(max-width: 1024px) 92vw, 560px"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-crh-line-strong)] bg-[rgba(20,13,8,0.85)] px-4 py-2 text-[0.76rem] font-extrabold text-[var(--color-crh-gold-soft)] backdrop-blur-lg">
                    <Icon.ShieldCheck className="size-3.5" />
                    جلسة عناية طبية داخل العيادة
                  </span>
                </div>
              </Reveal>
            </Parallax>

            <div className="flex flex-col gap-6">
              {RESULTS.map((r, i) => (
                <Reveal key={r} delay={i * 100}>
                  <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] px-5 py-4">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #8C6A3F, #E4C87E)",
                      }}
                    >
                      <Icon.Check className="size-[18px] text-[#1C120C]" strokeWidth={2.6} />
                    </span>
                    <b className="text-[1rem] font-extrabold">{r}</b>
                  </div>
                </Reveal>
              ))}

              {/* الدفع الآجل */}
              <Reveal delay={420}>
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.06)] px-5 py-4">
                  <span className="text-[0.9rem] font-bold text-[var(--color-crh-cream-soft)]">
                    قسّمي مدفوعاتك على دفعات ميسرة عبر
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-9 items-center rounded-lg bg-white px-3">
                      <Image
                        src="/tabby.png"
                        alt="تابي"
                        width={52}
                        height={22}
                        className="h-[22px] w-auto object-contain"
                      />
                    </span>
                    <span className="flex h-9 items-center rounded-lg bg-white px-3">
                      <Image
                        src="/tamara.jpeg"
                        alt="تمارا"
                        width={52}
                        height={22}
                        className="h-[22px] w-auto object-contain"
                      />
                    </span>
                  </span>
                </div>
              </Reveal>
              <Reveal delay={500}>
                <p className="m-0 text-[0.78rem] text-[var(--color-crh-faint)]">
                  النتائج تختلف من حالة إلى أخرى بحسب مرحلة التشقق والالتزام
                  بالخطة المنزلية.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ——— بإشراف طبي ——— */}
      <section className="relative mx-auto max-w-[1080px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow="٠٥ ، بإشراف"
          title="عناية بإشراف"
          highlight="طبي متخصص"
          sub="ضمن منظومة عيادات د. مها دحلان، استشارية الأمراض الجلدية في جدة، حيث تبدأ كل خطة بفحص طبي صادق."
        />
        <Reveal delay={120}>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {/* arched portrait */}
            <div className="relative w-[clamp(240px,32vw,320px)] shrink-0">
              <div
                className="pointer-events-none absolute -inset-3.5 -rotate-2 rounded-t-full rounded-b-[28px] border border-[rgba(212,175,55,0.3)]"
                aria-hidden
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl border-2 border-[rgba(228,200,126,0.45)] bg-[var(--color-crh-card)] shadow-[0_36px_80px_-32px_rgba(0,0,0,0.9)]">
                <Image
                  src="/team/dr-dina.avif"
                  alt="د. دينا، طبيبة الجلدية بعيادات د. مها دحلان"
                  fill
                  sizes="(max-width: 768px) 80vw, 320px"
                  className="object-cover object-top"
                />
              </div>
              <span
                className="absolute -right-4 bottom-6 inline-flex items-center gap-[7px] rounded-full border border-[var(--color-crh-line-strong)] bg-[rgba(20,13,8,0.9)] px-4 py-2 text-[0.74rem] font-extrabold whitespace-nowrap text-[var(--color-crh-gold-soft)] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.8)] backdrop-blur-lg"
                style={{ animation: "crh-floaty 7s ease-in-out infinite alternate" }}
              >
                تقييم صادق… دائماً
              </span>
            </div>

            {/* bio */}
            <div className="min-w-[300px] flex-1 text-center md:max-w-[520px] md:text-right">
              <h3 className="m-0 text-3xl font-extrabold sm:text-4xl">د. دينا</h3>
              <p className="mt-1.5 font-bold text-[var(--color-crh-gold-soft)]">
                طبيبة الجلدية والعناية الطبية بالبشرة والقدم
              </p>
              <p className="mt-4 mb-0 font-light text-[var(--color-crh-muted)]">
                تشرف على بروتوكول العناية بالقدم في العيادة: من الفحص الأول
                واستبعاد الأسباب الصحية، إلى اختيار خطوات العلاج المناسبة
                لمرحلة التشقق، وحتى مراجعات ما بعد الجلسات.
              </p>
              <ul className="mt-6 grid list-none gap-2.5 p-0 sm:grid-cols-2">
                {[
                  "فحص طبي قبل أي جلسة",
                  "بروتوكولات معقمة بالكامل",
                  "خطة مخصصة لكل حالة",
                  "متابعة حتى اكتمال النتيجة",
                ].map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] px-4 py-2.5 text-xs leading-5 font-bold text-[var(--color-crh-cream-soft)]"
                  >
                    <Icon.BadgeCheck className="size-4 shrink-0 text-[var(--color-crh-gold)]" />
                    {c}
                  </li>
                ))}
              </ul>
              <div
                className="mt-6 rounded-l-[14px] rounded-r border-r-[3px] border-[var(--color-crh-gold-soft)] px-[22px] py-[18px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(212,175,55,.1), transparent 70%)",
                }}
              >
                <p className="m-0 text-[1.05rem] font-bold text-[var(--color-crh-cream)]">
                  &#8220;القدم المهملة تُتعب صاحبتها بصمت؛ عنايةٌ بسيطة منتظمة
                  تعيد لكل خطوة راحتها.&#8221;
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— قالوا عنا ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(176,141,87,0.15)] bg-[var(--color-crh-band)] py-[100px]">
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
      <section className="relative mx-auto max-w-[780px] px-[22px] pt-[100px] pb-[110px]">
        <SectionHead
          eyebrow="٠٧ ، الأسئلة الشائعة"
          title="كل ما يهمّك"
          highlight="معرفته"
        />
        <div className="flex flex-col gap-3.5">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="overflow-hidden rounded-[18px] border border-[var(--color-crh-line)] bg-[var(--color-crh-card)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-extrabold">
                  {f.q}
                  <span className="crh-pm inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] text-[1.2rem] font-normal text-[var(--color-crh-gold-soft)]">
                    +
                  </span>
                </summary>
                <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[var(--color-crh-muted)]">
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
          <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-crh-line)] bg-[var(--color-crh-bg-deep)] p-[clamp(36px,6vw,70px)]">
            <div
              className="pointer-events-none absolute -top-[180px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 blur-[30px]"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(228,200,126,.2), transparent 70%)",
                animation: "crh-breathe 7s ease-in-out infinite",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(228,200,126,.1) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center justify-center gap-[46px]">
              <div className="min-w-[290px] max-w-[520px] flex-1 text-[var(--color-crh-cream)]">
                <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-crh-gold-soft)]">
                  ٠٨ ، الحجز
                </span>
                <h2 className="mt-3 mb-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
                  خطوتك الأولى نحو{" "}
                  <span className="crh-gold-text">كعبين ناعمين</span>
                </h2>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(228,200,126,0.35)] bg-[rgba(228,200,126,0.08)] px-4 py-1.5 text-[0.78rem] font-extrabold text-[var(--color-crh-gold-soft)]">
                  <Icon.Sparkles className="size-3.5" />
                  مقاعد التقييم محدودة أسبوعياً
                </span>
                <p className="mt-3.5 mb-0 font-light text-[rgba(244,233,216,0.7)]">
                  اتركي بياناتك وسيتواصل معك فريقنا في نفس اليوم لتنسيق موعدك
                  وتقدير خطتك وتكلفتها بشفافية كاملة.
                </p>
                <div className="mt-[26px] flex flex-col gap-3.5">
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(244,233,216,0.75)]">
                    <Icon.Lock className="size-4 shrink-0 text-[var(--color-crh-gold-soft)]" />
                    خصوصية تامة وملف طبي سرّي
                  </span>
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(244,233,216,0.75)]">
                    <Icon.CircleCheck className="size-4 shrink-0 text-[var(--color-crh-gold-soft)]" />
                    تقييم صادق دون أي التزام
                  </span>
                  <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(244,233,216,0.75)]">
                    <Icon.Clock className="size-4 shrink-0 text-[var(--color-crh-gold-soft)]" />
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
      <footer className="border-t border-[var(--color-crh-line)] px-[22px] pt-11 pb-[120px] text-center md:pb-11">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/cracked-heels/logo.png"
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
            className="text-[var(--color-crh-gold-soft)] hover:text-[var(--color-crh-gold)]"
          >
            {PHONE_DISPLAY}
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-crh-gold-soft)] hover:text-[var(--color-crh-gold)]"
          >
            واتساب العيادة
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href="#booking"
            className="text-[var(--color-crh-gold-soft)] hover:text-[var(--color-crh-gold)]"
          >
            حجز جلسة تقييم
          </a>
        </div>
        <p className="mt-4 mb-0 text-[0.74rem] text-[var(--color-crh-faint)]">
          جميع العلاجات تُجرى بعد تقييم طبي متخصص. النتائج تختلف من حالة إلى
          أخرى.
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="crh"
        whatsappNumber={WHATSAPP_NUMBER}
        topicMessage={WA_TOPIC_MESSAGE}
      />
      <StickyBar />
    </main>
  );
}
