import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import { Reveal, SpotlightCard } from "./_components/Reveal";
import { Doctors } from "./_components/Doctors";
import { BeforeAfter } from "./_components/BeforeAfter";
import { Journey } from "./_components/Journey";
import { Testimonials } from "./_components/Testimonials";
import { Booking } from "./_components/Booking";
import { StickyBar } from "./_components/StickyBar";
import {
  GOLD_GRADIENT,
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
  WA_TOPIC_MESSAGE,
  WHATSAPP_NUMBER,
} from "./_components/config";

const CARD_GRADIENT = "linear-gradient(160deg, #2E0D18, #1D060D)";
const SURFACE_GRADIENT = "linear-gradient(160deg, #35101C, #22070F)";
const SECTION_WASH = "linear-gradient(180deg, #150409, #22070F 45%, #150409)";

const PROBLEM_CARDS = [
  {
    icon: Icon.Droplet,
    title: "فقدان الامتلاء",
    body: "غور الخدود والصدغين وبروز عظام الوجه، فتفقد الملامح نعومتها الأنثوية.",
  },
  {
    icon: Icon.Waves,
    title: "ترهل الجلد",
    body: "نقص مرونة البشرة وتراخيها حول الفك والرقبة لأنها لم تلحق بسرعة نزول الوزن.",
  },
  {
    icon: Icon.Frown,
    title: "ملامح متعبة",
    body: "تجاعيد أوضح ونظرة مرهقة لا تعكس حيويتك ولا فرحتك بإنجازك.",
  },
];

const AFFECTED_AREAS = ["الخدود", "الصدغان", "خط الفك", "محيط العينين", "الرقبة"];

const SOLUTIONS = [
  {
    num: "٠١",
    icon: Icon.Droplet,
    title: "فيلر الوجه",
    body: "تعويض فوري ومدروس للحجم المفقود في الخدود والصدغين وخط الفك، بمواد آمنة وقابلة للذوبان.",
  },
  {
    num: "٠٢",
    icon: Icon.RefreshCw,
    title: "حقن الدهون الذاتية",
    body: "نقل دهون من جسمك أنتِ لإعادة بناء وسائد الوجه — الخيار الأقرب للطبيعة وأطولها دواماً.",
  },
  {
    num: "٠٣",
    icon: Icon.Sparkles,
    title: "سكين بوستر ومحفزات الكولاجين",
    body: "إعادة النضارة والمرونة والترطيب العميق للبشرة المتعبة، وتحفيز إنتاج الكولاجين الطبيعي.",
  },
  {
    num: "٠٤",
    icon: Icon.Spline,
    title: "شد الوجه بالخيوط",
    body: "رفع الترهلات الخفيفة وإعادة تحديد خط الفك دون جراحة، بجلسة واحدة وتعافٍ سريع.",
  },
  {
    num: "٠٥",
    icon: Icon.AudioWaveform,
    title: "تقنيات شد البشرة",
    body: "الهايفو والترددات الحرارية لشد عميق غير جراحي وتحفيز طويل الأمد لتماسك الجلد.",
  },
];

const FAQ = [
  {
    q: "هل نتائج العلاج فورية؟",
    a: "بعض العلاجات كالفيلر تُظهر تحسناً فورياً، بينما تحتاج محفزات الكولاجين والسكين بوستر أسابيع لاكتمال نتيجتها. توضح لكِ الطبيبة الجدول الزمني المتوقع لخطتك في الاستشارة.",
  },
  {
    q: "هل الإجراءات مؤلمة؟",
    a: "نستخدم كريمات تخدير موضعي وتقنيات حقن لطيفة، ومعظم السيدات يصفن الإحساس بانزعاج بسيط لا أكثر. راحتك خلال الجلسة أولوية ثابتة عندنا.",
  },
  {
    q: "هل يمكن البدء وأنا ما زلت أستخدم إبر التنحيف؟",
    a: "يعتمد ذلك على استقرار وزنك ومرحلتك من العلاج. تُقيّم الطبيبة حالتك وتحدد التوقيت الأنسب — فبعض الخطوات يمكن البدء بها مبكراً، وبعضها يُفضَّل تأجيله حتى يثبت الوزن.",
  },
  {
    q: "هل ستبدو النتائج طبيعية؟",
    a: "فلسفتنا إعادة التوازن لملامحك أنتِ، لا تغييرها. نعمل بتدرّج وقياسات دقيقة، ونفضّل دائماً «أقل مما يلزم» على أي مبالغة.",
  },
  {
    q: "كم تدوم النتائج؟",
    a: "تختلف المدة حسب نوع العلاج واستجابة جسمك؛ من عدة أشهر للفيلر إلى نتائج أطول أمداً للدهون الذاتية ومحفزات الكولاجين. ستحصلين على خطة صيانة واضحة بعد اكتمال العلاج.",
  },
];

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal className="mx-auto mb-13 max-w-[700px] text-center">
      <span className="text-[0.76rem] font-extrabold tracking-[0.24em] text-[var(--color-faa-gold)]">
        {eyebrow}
      </span>
      <h2 className="mt-3.5 mb-3 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
        {title}
      </h2>
      {sub && (
        <p className="m-0 text-[1.02rem] font-light text-[rgba(243,233,220,0.65)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export default function FacialAtrophyPage() {
  return (
    <main>
      <Header />
      <Hero />
      <MarqueeStrip />

      {/* ——— المشكلة ——— */}
      <section id="problem" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow="المشكلة"
            title="ما هو ضمور الوجه بعد إبر التنحيف؟"
            sub="ما يُعرف اليوم بـ«وجه الأوزمبك» — حين ينعكس نزول الوزن السريع على ملامح وجهك قبل أي مكان آخر."
          />

          <SpotlightCard
            hoverLift={false}
            className="mb-[22px] rounded-3xl p-[clamp(26px,4vw,44px)]"
          >
            <div
              className="absolute inset-0 -z-10"
              style={{ background: SURFACE_GRADIENT }}
              aria-hidden
            />
            <div className="flex flex-wrap items-center gap-[34px]">
              <div className="min-w-[280px] flex-[2]">
                <h3 className="mb-3 text-[1.35rem] font-extrabold text-[var(--color-faa-gold-pale)]">
                  لماذا يحدث؟
                </h3>
                <p className="m-0 text-base font-light text-[rgba(243,233,220,0.72)]">
                  تعمل إبر التنحيف على إذابة الدهون في الجسم كله — ومنها الدهون
                  الداعمة لملامح الوجه. وحين يكون النزول سريعاً، تختفي هذه
                  الوسائد الدهنية قبل أن يتمكن الجلد من التكيّف والانكماش، فتظهر
                  الملامح أنحف وأكبر سناً مما ينبغي.
                </p>
              </div>
              <div className="min-w-[220px] flex-1">
                <span className="mb-3 block text-[0.78rem] font-extrabold tracking-[0.12em] text-[var(--color-faa-gold)]">
                  المناطق الأكثر تأثراً
                </span>
                <div className="flex flex-wrap gap-[9px]">
                  {AFFECTED_AREAS.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-[rgba(217,179,108,0.3)] px-[15px] py-[7px] text-[0.82rem] font-bold text-[var(--color-faa-ink-soft)]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>

          <div className="grid gap-[22px] md:grid-cols-3">
            {PROBLEM_CARDS.map((c, i) => (
              <SpotlightCard
                key={c.title}
                delay={80 + i * 80}
                className="rounded-[20px] px-[26px] py-[30px]"
              >
                <div
                  className="absolute inset-0 -z-10"
                  style={{ background: CARD_GRADIENT }}
                  aria-hidden
                />
                <div className="mb-4 flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(217,179,108,0.3)] bg-[rgba(217,179,108,0.1)] text-[var(--color-faa-gold-bright)]">
                  <c.icon className="size-[23px]" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2 text-[1.15rem] font-extrabold">{c.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[rgba(243,233,220,0.65)]">
                  {c.body}
                </p>
              </SpotlightCard>
            ))}
          </div>

          <Reveal className="mt-11 text-center">
            <p className="faa-serif m-0 text-[1.35rem] text-[var(--color-faa-ink-soft)]">
              الخبر الجيد؟{" "}
              <span className="text-[var(--color-faa-gold-bright)]">
                كل ذلك قابل للعلاج
              </span>{" "}
              — بتدرّج وذوق طبي رفيع.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— الحلول ——— */}
      <section
        id="solutions"
        className="relative px-[22px] py-[clamp(80px,10vw,120px)]"
        style={{ background: SECTION_WASH }}
      >
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow="الحلول"
            title="خيارات علاجية متكاملة تحت سقف واحد"
            sub="لا نبيع إجراءً جاهزاً — بعد الكشف والتقييم، تُبنى خطتك من هذه التقنيات بما يناسب وجهك أنتِ."
          />

          <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s, i) => (
              <SpotlightCard
                key={s.num}
                delay={(i % 3) * 70}
                className="rounded-[20px] px-7 py-[30px]"
              >
                <div
                  className="absolute inset-0 -z-10"
                  style={{ background: SURFACE_GRADIENT }}
                  aria-hidden
                />
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(217,179,108,0.3)] bg-[rgba(217,179,108,0.1)] text-[var(--color-faa-gold-bright)]">
                    <s.icon className="size-[22px]" strokeWidth={1.8} />
                  </div>
                  <span className="faa-serif text-[1.6rem] text-[rgba(217,179,108,0.35)]">
                    {s.num}
                  </span>
                </div>
                <h3 className="mb-2 text-[1.18rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[rgba(243,233,220,0.65)]">
                  {s.body}
                </p>
              </SpotlightCard>
            ))}

            {/* CTA card */}
            <Reveal
              delay={140}
              className="flex flex-col justify-between rounded-[20px] px-7 py-[30px] text-[var(--color-faa-cta-ink)] transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div
                className="absolute inset-0 -z-10 rounded-[20px]"
                style={{ background: GOLD_GRADIENT }}
                aria-hidden
              />
              <div>
                <span className="text-[0.74rem] font-extrabold tracking-[0.18em] opacity-75">
                  الخطوة الأولى
                </span>
                <h3 className="mt-2.5 mb-2 text-[1.35rem] leading-[1.45] font-extrabold">
                  خطتكِ تُحدَّد بعد الكشف
                </h3>
                <p className="m-0 text-[0.93rem] font-bold opacity-85">
                  تُقيّم الطبيبة درجة الضمور ونوعية بشرتك، ثم تضع البروتوكول
                  الأنسب — تقنية واحدة أو مزيج مدروس.
                </p>
              </div>
              <a
                href="#booking"
                className="mt-[22px] inline-flex w-fit items-center gap-[9px] rounded-full bg-[var(--color-faa-cta-ink)] px-6 py-[13px] text-[0.92rem] font-extrabold text-[var(--color-faa-gold-bright)] transition-transform duration-300 hover:-translate-x-1"
              >
                ابدئي بالتقييم
                <Icon.ArrowLeft className="size-[15px]" strokeWidth={2.4} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— الأخصائيات ——— */}
      <section id="doctors" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow="لماذا عيادة مها دحلان"
            title="خبرة تجمع بين علم التشريح وحسّ الجمال"
            sub="فريق نسائي متخصص في ترميم ملامح الوجه بعد نزول الوزن — فلا يلاحظ من حولك إلا أنكِ أكثر راحة وإشراقاً."
          />

          <Reveal className="mx-auto mb-12 max-w-[640px]">
            <div className="rounded-l-2xl rounded-r border-r-[3px] border-[var(--color-faa-gold)] px-[22px] py-[18px]"
              style={{ background: SURFACE_GRADIENT }}
            >
              <p className="faa-serif m-0 text-center text-[1.2rem] text-[var(--color-faa-ink-soft)]">
                «هدفنا أن تعود ملامحكِ كما كانت في أجمل أيامها — لا أن تتغيّري.»
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Doctors />
          </Reveal>
        </div>
      </section>

      {/* ——— قبل وبعد ——— */}
      <section
        id="results"
        className="relative px-[22px] py-[clamp(80px,10vw,120px)]"
        style={{ background: SECTION_WASH }}
      >
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow="النتائج"
            title="قبل وبعد — اسحبي وشاهدي الفرق"
            sub="محاكاة توضيحية لأثر استعادة امتلاء الوجه بعد نزول الوزن."
          />
          <Reveal>
            <BeforeAfter />
          </Reveal>
          <Reveal className="mx-auto mt-[18px] max-w-[560px] text-center">
            <p className="m-0 text-[0.8rem] text-[rgba(243,233,220,0.45)]">
              صورة توضيحية وليست حالة فعلية — النتائج تختلف من حالة إلى أخرى
              بحسب درجة الضمور ونوعية البشرة والخطة المتبعة.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— رحلة العلاج ——— */}
      <section id="journey" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[1160px]">
          <SectionHead eyebrow="رحلة العلاج" title="أربع خطوات… تفصلك عن ملامحك" />
          <Journey />
        </div>
      </section>

      {/* ——— آراء المريضات ——— */}
      <section
        id="voices"
        className="relative overflow-hidden py-[clamp(80px,10vw,120px)]"
        style={{ background: SECTION_WASH }}
      >
        <div className="mx-auto mb-12 max-w-[700px] px-[22px] text-center">
          <SectionHead
            eyebrow="آراء المراجعات"
            title="قالوا عن تجربتهم"
            sub="من تقييمات Google الحقيقية لعيادات مها دحلان — ٤٫٨ من ٥ عبر أكثر من ١٢٧٠ تقييم."
          />
        </div>
        <Testimonials />
      </section>

      {/* ——— الأسئلة الشائعة ——— */}
      <section id="faq" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[780px]">
          <SectionHead eyebrow="الأسئلة الشائعة" title="كل ما يدور في ذهنك" />
          <div className="grid gap-[13px]">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details
                  className="overflow-hidden rounded-2xl border border-[var(--color-faa-line)]"
                  style={{ background: SURFACE_GRADIENT }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[1.02rem] font-extrabold text-[var(--color-faa-ink)]">
                    {f.q}
                    <span className="faa-pm flex size-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--color-faa-line-strong)] bg-[rgba(217,179,108,0.12)] font-bold text-[var(--color-faa-gold-bright)]">
                      +
                    </span>
                  </summary>
                  <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[rgba(243,233,220,0.68)]">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— الحجز ——— */}
      <section
        id="booking"
        className="relative overflow-hidden px-[22px] py-[clamp(80px,10vw,120px)]"
      >
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 blur-[30px]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(240,212,138,.12), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="mx-auto grid max-w-[1080px] items-center gap-[clamp(34px,5vw,60px)] md:grid-cols-2">
          <Reveal>
            <span className="text-[0.76rem] font-extrabold tracking-[0.24em] text-[var(--color-faa-gold)]">
              احجزي الآن
            </span>
            <h2 className="mt-3.5 mb-3.5 text-[clamp(1.9rem,3.8vw,2.8rem)] leading-[1.35] font-extrabold">
              استشارتك الخاصة…
              <br />
              <span className="faa-serif faa-gold-text font-bold">
                تبدأ برسالة واحدة
              </span>
            </h2>
            <p className="mb-[26px] max-w-[46ch] text-[1.02rem] font-light text-[rgba(243,233,220,0.68)]">
              اتركي بياناتك وسيتواصل معك فريقنا النسائي لتنسيق موعدك، أو راسلينا
              مباشرة عبر واتساب.
            </p>

            <div className="grid max-w-[380px] gap-[15px]">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[13px] rounded-2xl border border-[rgba(217,179,108,0.2)] px-[18px] py-[15px] text-[var(--color-faa-ink)] transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(37,211,102,0.55)]"
                style={{ background: SURFACE_GRADIENT }}
              >
                <span
                  className="flex size-[42px] items-center justify-center rounded-xl bg-[rgba(37,211,102,0.14)]"
                  style={{ animation: "faa-pulse 2.6s infinite" }}
                >
                  <Icon.MessageCircle className="size-[21px] text-[#25D366]" />
                </span>
                <span>
                  <b className="block text-[0.94rem]">واتساب العيادة</b>
                  <small dir="ltr" className="text-[0.78rem] text-[rgba(243,233,220,0.55)]">
                    +{WHATSAPP_NUMBER}
                  </small>
                </span>
              </a>
              <a
                href={TEL_LINK}
                className="flex items-center gap-[13px] rounded-2xl border border-[rgba(217,179,108,0.2)] px-[18px] py-[15px] text-[var(--color-faa-ink)] transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(240,212,138,0.5)]"
                style={{ background: SURFACE_GRADIENT }}
              >
                <span className="flex size-[42px] items-center justify-center rounded-xl bg-[rgba(217,179,108,0.12)]">
                  <Icon.Phone className="size-5 text-[var(--color-faa-gold-bright)]" />
                </span>
                <span>
                  <b className="block text-[0.94rem]">اتصال مباشر</b>
                  <small className="text-[0.78rem] text-[rgba(243,233,220,0.55)]">
                    {PHONE_DISPLAY} — خلال ساعات العمل
                  </small>
                </span>
              </a>
              <span className="inline-flex items-center gap-[9px] text-[0.8rem] text-[rgba(243,233,220,0.5)]">
                <Icon.Lock className="size-[15px] shrink-0 text-[var(--color-faa-gold)]" />
                بياناتك سرية ولا تُستخدم إلا للتواصل بشأن موعدك.
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Booking />
          </Reveal>
        </div>
      </section>

      {/* ——— الفوتر ——— */}
      <footer className="border-t border-[rgba(217,179,108,0.14)] px-[22px] pt-11 pb-10 text-center">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/facial-atrophy/logo.png"
            alt="MD Clinics — مجمع عيادات د. مها دحلان الطبي"
            width={110}
            height={110}
            className="size-[110px] object-contain"
          />
        </div>
        <div className="mb-5 flex flex-wrap justify-center gap-x-7 gap-y-2.5 text-[0.88rem]">
          <a
            dir="ltr"
            href={TEL_LINK}
            className="text-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
          >
            واتساب
          </a>
          <a
            href="#booking"
            className="text-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
          >
            حجز استشارة
          </a>
        </div>
        <p className="mx-auto mb-2 max-w-[620px] text-[0.74rem] font-light text-[rgba(243,233,220,0.4)]">
          المحتوى المعروض في هذه الصفحة لأغراض تعريفية ولا يغني عن الاستشارة
          الطبية. النتائج تختلف من حالة إلى أخرى.
        </p>
        <p className="m-0 text-[0.74rem] text-[rgba(243,233,220,0.35)]">
          © ٢٠٢٦ عيادة مها دحلان — جميع الحقوق محفوظة
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="faa"
        whatsappNumber={WHATSAPP_NUMBER}
        topicMessage={WA_TOPIC_MESSAGE}
      />
      <StickyBar />
    </main>
  );
}
