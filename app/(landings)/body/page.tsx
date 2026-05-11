import Image from "next/image";
import Link from "next/link";
import BeforeAfter from "./_components/BeforeAfter";
import HeroCanvas from "./_components/HeroCanvas";
import LeadForm from "./_components/LeadForm";
import Reveals from "./_components/Reveals";

const benefits = [
  {
    title: "حرق دهون موضعي",
    body: "تستهدف موجات HIFEM الطبقة الدهنية بأمان لتقليل محيط الخصر والأرداف دون جراحة.",
    number: "01",
  },
  {
    title: "تكبير وشدّ العضلات",
    body: "الجلسة الواحدة تعادل ٢٠٬٠٠٠ انقباضة عضلية — نتائج رياضي محترف خلال أسابيع.",
    number: "02",
  },
  {
    title: "دون ألم ولا تعافٍ",
    body: "بدون إبر ولا تخدير ولا فترة نقاهة — عودي إلى يومك مباشرة بعد الجلسة.",
    number: "03",
  },
  {
    title: "تقنية معتمدة طبيًا",
    body: "أجهزة مرخّصة من FDA وهيئات التجميل الطبية في الخليج، تحت إشراف أطباء متخصصين.",
    number: "04",
  },
];

const treatments = [
  {
    area: "البطن والخصر",
    desc: "نحت الخصر وتفعيل عضلات البطن السفلية للحصول على قوام ساعة رملية.",
    duration: "٣٠ دقيقة",
    sessions: "٤–٦ جلسات",
  },
  {
    area: "الأرداف والمؤخرة",
    desc: "رفع طبيعي للمؤخرة وتكبيرها بزاوية عضلية متناسقة دون حقن.",
    duration: "٣٠ دقيقة",
    sessions: "٤–٦ جلسات",
  },
  {
    area: "الذراعين والكتفين",
    desc: "شد الترهلات وتنسيق العضلة الثلاثية لإطلالة أنيقة في الفساتين المفتوحة.",
    duration: "٢٠ دقيقة",
    sessions: "٤ جلسات",
  },
  {
    area: "الفخذين الداخلية",
    desc: "تنحيف الفخذين الداخلية وإزالة الاحتكاك مع الحفاظ على الليونة الحركية.",
    duration: "٣٠ دقيقة",
    sessions: "٦ جلسات",
  },
];

const steps = [
  {
    step: "١",
    title: "استشارة أولى",
    body: "نحلل قياسات الجسم، التركيب العضلي، ونضع خطة مخصصة لأهدافك.",
  },
  {
    step: "٢",
    title: "بروتوكول الجلسات",
    body: "تجربة هادئة في غرفة خاصة، تحت إشراف فني معتمد ومتابعة طبية.",
  },
  {
    step: "٣",
    title: "متابعة ونتائج",
    body: "قياسات أسبوعية وتقارير مصورة حتى الوصول إلى القوام المثالي.",
  },
];

const testimonials = [
  {
    name: "نورة المطيري",
    city: "الرياض",
    quote:
      "بعد أربع جلسات فقط لاحظت فرق واضح في شدّ البطن وتناسق الخصر — الجلسة مريحة وممتعة.",
  },
  {
    name: "ريم الحربي",
    city: "جدة",
    quote:
      "التجربة راقية من لحظة الدخول، والنتائج ظهرت قبل رحلة الصيف بأسبوعين فقط.",
  },
  {
    name: "سارة العتيبي",
    city: "الخبر",
    quote:
      "أخيرًا حل بدون جراحة يعطيني شكل رياضي طبيعي — موصى به لكل من يبحث عن الأناقة.",
  },
];

const faqs = [
  {
    q: "هل الجلسة مؤلمة؟",
    a: "أبدًا. ستشعرين بانقباضات عضلية قوية تشبه التمرين المركّز، لكنها مريحة ومُتحكَّم بها. معظم عميلاتنا يستمتعن بالجلسة من أول مرة.",
  },
  {
    q: "متى تظهر النتائج؟",
    a: "تظهر بوادر الشد بعد الجلسة الثانية، وتكتمل النتائج بعد الجلسة الرابعة إلى السادسة بحسب البروتوكول والأهداف.",
  },
  {
    q: "هل التقنية آمنة؟",
    a: "نعم. تعتمد التقنية على موجات مغناطيسية كهربائية غير ضارة ومعتمدة من FDA، ولا تتطلب تخديرًا ولا فترة نقاهة.",
  },
  {
    q: "هل تصلح بعد الولادة؟",
    a: "نعم بعد انقضاء فترة النفاس (٦–٨ أسابيع) وموافقة الطبيب، وتعد من أفضل الحلول لاستعادة شدّ عضلات البطن بعد الولادة.",
  },
];

const marqueeWords = [
  "نحت الجسم",
  "•",
  "تحفيز عضلي",
  "•",
  "بدون جراحة",
  "•",
  "تقنية مرخّصة",
  "•",
  "نتائج مرئية",
  "•",
  "تجربة فاخرة",
  "•",
];

export default function BodyLanding() {
  return (
    <>
      <Reveals />

      {/* NAV */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2 sm:px-10 sm:py-3">
          <Link
            href="/body"
            className="flex items-center shrink-0"
            aria-label="MD Clinics"
          >
            <Image
              src="/body/logo.png"
              alt="MD Clinics — مجمع عيادات د. مها دحلان الطبي"
              width={300}
              height={300}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-body-muted">
            <a href="#benefits" className="hover:text-body-fg transition">
              المميزات
            </a>
            <a href="#treatments" className="hover:text-body-fg transition">
              مناطق العلاج
            </a>
            <a href="#process" className="hover:text-body-fg transition">
              الرحلة
            </a>
            <a href="#results" className="hover:text-body-fg transition">
              قبل وبعد
            </a>
            <a href="#stories" className="hover:text-body-fg transition">
              قصص النجاح
            </a>
            <a href="#faq" className="hover:text-body-fg transition">
              الأسئلة
            </a>
          </nav>
          <a
            href="#reserve"
            className="btn-primary-body shrink-0 text-sm !px-4 !py-2"
          >
            احجزي
            <span className="hidden sm:inline">&nbsp;استشارتك</span>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(193,95,60,0.14),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(176,140,74,0.14),transparent_55%)]" />
        </div>
        <div className="absolute inset-0 z-0 opacity-95">
          <HeroCanvas />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-20 pt-4 sm:gap-12 sm:px-10 sm:pb-28 sm:pt-6 lg:grid-cols-12 lg:pb-36 lg:pt-8">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-body-line bg-white/50 px-4 py-1.5 text-xs backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-body-accent" />
              <span className="text-body-muted">جيل جديد من نحت الجسم غير الجراحي</span>
            </div>

            <h1
              data-split
              className="hero-headline font-display-body mt-6 text-4xl leading-[1.2] sm:mt-8 sm:text-5xl sm:leading-[1.15] md:text-6xl lg:text-7xl text-body-fg"
            >
              نحت جسمك يبدأ بنبضة واحدة.
            </h1>

            <p
              data-split
              className="hero-sub mt-5 max-w-xl text-base leading-8 text-body-muted sm:mt-6 sm:text-lg sm:leading-9"
            >
              نجمع بين التحفيز الكهرومغناطيسي عالي الكثافة والعلم الرياضي
              لنمنحك قوامًا متناسقًا، عضلات مشدودة، وثقة تُرى قبل أن تُقال.
            </p>

            <div className="hero-cta mt-10 flex flex-wrap items-center gap-4 opacity-0 translate-y-4">
              <a href="#reserve" className="btn-primary-body">
                احجزي جلستك الأولى
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 5l-7 7 7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="#benefits" className="btn-ghost-body">
                تعرّفي على التجربة
              </a>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 sm:mt-16 sm:gap-6">
              <div>
                <dt className="text-[11px] text-body-muted sm:text-xs">انقباضة/جلسة</dt>
                <dd className="mt-2 font-display-body text-2xl sm:text-3xl text-body-fg">
                  <span data-count="20000">0</span>
                  <span className="text-body-accent">+</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-body-muted sm:text-xs">فرع بالمملكة</dt>
                <dd className="mt-2 font-display-body text-2xl sm:text-3xl text-body-fg">
                  <span data-count="7">0</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-body-muted sm:text-xs">سيدة بثقة</dt>
                <dd className="mt-2 font-display-body text-2xl sm:text-3xl text-body-fg">
                  <span data-count="3400">0</span>
                  <span className="text-body-accent">+</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5 flex items-center">
            <div className="card-body relative w-full overflow-hidden lg:mt-16">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src="/body/hero-hifem.png"
                  alt="جلسة نحت الجسم بتقنية التحفيز العضلي الكهرومغناطيسي"
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-body-bg/75 via-body-bg/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-5 sm:px-8">
                  <span className="eyebrow-body">تقنية HIFEM®</span>
                  <span className="h-8 w-8 rounded-full border border-body-fg/25 bg-body-bg/70 backdrop-blur flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-body-accent animate-pulse" />
                  </span>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <h3 className="font-display-body text-3xl leading-snug text-body-fg">
                  موجات مغناطيسية تُشغّل ١٠٠٪ من ألياف العضلة.
                </h3>
                <p className="mt-4 text-sm leading-7 text-body-muted">
                  التدريب التقليدي يُشغّل ٣٠–٤٠٪ فقط من ألياف العضلة. تقنيتنا
                  تصل إلى العمق العضلي وتُحدث تفعيلًا كاملاً يُحرّر بروتينات
                  البناء ويحرق الدهون موضعيًا.
                </p>

                <div className="hairline my-6" />

                <ul className="grid gap-3 text-sm text-body-fg">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-5 bg-body-accent" />
                    <span>إشراف طبي معتمد من هيئة التخصصات الصحية.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-5 bg-body-accent" />
                    <span>غرف خاصة بأجواء سبا فاخر لراحتك الكاملة.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-5 bg-body-accent" />
                    <span>خطة غذائية ومتابعة شخصية بعد كل جلسة.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative overflow-hidden border-y border-body-line bg-body-surface/60 py-6">
        <div className="marquee-track gap-10 whitespace-nowrap font-display-body text-3xl text-body-fg/80 sm:text-4xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pe-10">
              {marqueeWords.map((w, j) => (
                <span key={`${i}-${j}`} className="opacity-80">
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="eyebrow-body reveal">لماذا عيادة د. مها دحلان</span>
              <h2
                data-split-scroll
                className="font-display-body mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl text-body-fg"
              >
                علم دقيق. تجربة راقية. نتائج ترونها.
              </h2>
              <p className="mt-6 leading-8 text-body-muted reveal">
                كل جلسة مصمّمة بعناية لتحاكي أفضل ما يقدّمه علم الرياضة، في
                بيئة تحتفي بخصوصيتك وراحتك. خبرة مركز طبي متكاملة تشبه زيارة
                مقصد سبا فاخر.
              </p>
            </div>
            <ul className="lg:col-span-8 grid gap-px sm:grid-cols-2 bg-body-line overflow-hidden rounded-2xl">
              {benefits.map((b) => (
                <li
                  key={b.number}
                  className="reveal group bg-body-bg p-6 sm:p-10 hover:bg-body-surface transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display-body text-4xl text-body-accent">
                      {b.number}
                    </span>
                    <span className="h-px w-14 bg-body-fg/20 group-hover:w-24 group-hover:bg-body-accent transition-all" />
                  </div>
                  <h3 className="mt-8 font-display-body text-2xl text-body-fg">
                    {b.title}
                  </h3>
                  <p className="mt-3 leading-7 text-body-muted">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TREATMENTS */}
      <section
        id="treatments"
        className="relative overflow-hidden bg-body-surface py-16 sm:py-24 lg:py-32"
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="h-full w-[90rem] bg-[radial-gradient(ellipse_at_center,rgba(193,95,60,0.12),transparent_60%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow-body reveal">مناطق العلاج</span>
              <h2
                data-split-scroll
                className="font-display-body mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl text-body-fg"
              >
                بروتوكولات مصمّمة لكل منطقة.
              </h2>
            </div>
            <p className="max-w-md leading-8 text-body-muted reveal">
              نقدّم بروتوكولات متخصصة لكل منطقة من الجسم، بجرعات ومدد مختلفة،
              لضمان نتائج مرئية وطبيعية تناسب تفاصيل قوامك.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-body-line rounded-3xl overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {treatments.map((t, i) => (
              <article
                key={t.area}
                className="reveal bg-body-bg p-8 hover:bg-body-accent-soft/20 transition duration-500"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display-body text-2xl text-body-fg">
                    0{i + 1}
                    <span className="text-body-accent">.</span>
                  </span>
                  <span className="h-px flex-1 mx-4 bg-body-fg/10" />
                  <span className="text-xs text-body-muted">{t.duration}</span>
                </div>
                <h3 className="mt-8 font-display-body text-2xl text-body-fg">
                  {t.area}
                </h3>
                <p className="mt-3 leading-7 text-body-muted text-sm">
                  {t.desc}
                </p>
                <div className="hairline my-6" />
                <div className="flex items-center justify-between text-xs text-body-muted">
                  <span>بروتوكول مُوصى به</span>
                  <span className="text-body-fg">{t.sessions}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="max-w-2xl">
            <span className="eyebrow-body reveal">الرحلة</span>
            <h2
              data-split-scroll
              className="font-display-body mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl text-body-fg"
            >
              ثلاث خطوات نحو القوام الذي تريدينه.
            </h2>
          </div>

          <ol className="relative mt-16 grid gap-10 sm:grid-cols-3">
            <div
              aria-hidden
              className="absolute top-6 right-6 left-6 hidden sm:block"
            >
              <div className="h-px w-full bg-body-line" />
            </div>
            {steps.map((s) => (
              <li key={s.step} className="reveal relative">
                <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-body-fg/30 bg-body-bg font-display-body text-xl text-body-fg">
                  {s.step}
                </div>
                <h3 className="mt-6 font-display-body text-2xl text-body-fg">
                  {s.title}
                </h3>
                <p className="mt-3 leading-7 text-body-muted text-sm">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section
        id="results"
        className="relative overflow-hidden bg-body-surface py-16 sm:py-24 lg:py-32"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[28rem] w-[56rem] bg-[radial-gradient(ellipse_at_center,rgba(193,95,60,0.12),transparent_60%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow-body reveal">نتائج حقيقية</span>
              <h2
                data-split-scroll
                className="font-display-body mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl text-body-fg"
              >
                قبل وبعد — الفرق الذي ترينه.
              </h2>
            </div>
            <p className="reveal max-w-md leading-8 text-body-muted">
              اسحبي العصا يمينًا ويسارًا لرؤية التحوّل بعد بروتوكول الجلسات
              المخصص، بنفس الإضاءة ونفس الزاوية.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { area: "البطن والخصر", note: "٦ جلسات — بروتوكول النحت" },
              { area: "الأرداف والمؤخرة", note: "٥ جلسات — بروتوكول الرفع" },
              { area: "الذراعين", note: "٤ جلسات — بروتوكول الشدّ" },
            ].map((item, i) => (
              <figure key={item.area} className="reveal grid gap-4">
                <BeforeAfter
                  beforeSrc="/body/afterbefore/before.png"
                  afterSrc="/body/afterbefore/after.png"
                  beforeAlt={`صورة قبل الجلسات — ${item.area}`}
                  afterAlt={`صورة بعد الجلسات — ${item.area}`}
                  delay={i * 0.25}
                  aspectClass="aspect-[16/10]"
                />
                <figcaption className="flex items-baseline justify-between gap-4">
                  <span className="font-display-body text-xl text-body-fg">
                    {item.area}
                  </span>
                  <span className="text-xs text-body-muted">{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section
        id="stories"
        className="relative overflow-hidden bg-body-fg text-body-bg py-16 sm:py-24 lg:py-32"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(193,95,60,0.6),transparent_60%)] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(176,140,74,0.5),transparent_60%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <span className="eyebrow-body reveal text-body-accent-soft">
                قصص نجاح
              </span>
              <h2
                data-split-scroll
                className="font-display-body mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl max-w-xl"
              >
                سيدات اخترن الأناقة بدلًا من الجراحة.
              </h2>
            </div>
            <div className="reveal flex items-center gap-3 text-sm text-body-bg/70">
              <span className="h-1.5 w-1.5 rounded-full bg-body-accent" />
              <span>أكثر من ٣٤٠٠ تجربة ناجحة منذ ٢٠٢٢</span>
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="reveal rounded-3xl border border-body-bg/10 bg-body-bg/5 p-8 backdrop-blur"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-body-accent"
                >
                  <path
                    d="M10 11V7a4 4 0 00-4 4v6h4v-6zM20 11V7a4 4 0 00-4 4v6h4v-6z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
                <blockquote className="mt-5 font-display-body text-xl leading-relaxed">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 text-sm">
                  <span className="inline-block h-8 w-8 rounded-full bg-gradient-to-br from-body-accent to-body-gold" />
                  <span>
                    <span className="block">{t.name}</span>
                    <span className="block text-body-bg/60 text-xs">
                      {t.city}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="text-center">
            <span className="eyebrow-body reveal">الأسئلة الشائعة</span>
            <h2
              data-split-scroll
              className="font-display-body mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl text-body-fg"
            >
              كل ما تريدين معرفته قبل جلستك الأولى.
            </h2>
          </div>

          <div className="mt-14 divide-y divide-body-line rounded-2xl border border-body-line">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                className="reveal group px-6 py-5 sm:px-8"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display-body text-lg text-body-fg">
                  <span>{f.q}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-body-fg/25 transition group-open:rotate-45">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 leading-8 text-body-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + FORM */}
      <section
        id="reserve"
        className="relative overflow-hidden bg-body-surface py-16 sm:py-24 lg:py-32"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(193,95,60,0.18),transparent_60%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow-body reveal">احجزي الآن</span>
            <h2
              data-split-scroll
              className="font-display-body mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl text-body-fg"
            >
              الجلسة الأولى عليها مكالمة استشارة مجانية.
            </h2>
            <p className="reveal mt-6 leading-8 text-body-muted max-w-lg">
              اتركي بياناتك وسنعاود التواصل معك خلال ساعة عمل لتحديد موعد
              زيارة الفرع الأقرب لك، مع هدية ترحيبية وتحليل قوام مجاني.
            </p>

            <ul className="mt-10 grid gap-4 text-sm text-body-fg/90">
              {[
                "اتصال خلال ساعة عمل واحدة",
                "تحليل قوام وخطة مخصصة مجانًا",
                "هدية ترحيبية في أول زيارة",
                "٧ فروع في أهم مدن المملكة",
              ].map((line) => (
                <li key={line} className="reveal flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-body-fg text-body-bg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l4 4L19 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-2xl border border-body-line bg-body-bg/70 p-6">
              <div className="flex items-center gap-3 text-sm text-body-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-body-accent animate-pulse" />
                <span>المقاعد محدودة لهذا الأسبوع</span>
              </div>
              <p className="mt-3 font-display-body text-xl leading-relaxed text-body-fg">
                يتم استقبال ٤٠ سيدة فقط أسبوعيًا لضمان تجربة خاصة وراقية.
              </p>
            </div>
          </div>

          <div className="reveal">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-body-fg text-body-bg/80">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-14">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-body-bg/95 p-2">
                  <Image
                    src="/body/logo.png"
                    alt="عيادة د. مها دحلان"
                    width={300}
                    height={300}
                    className="h-12 w-12"
                  />
                </div>
                <div className="leading-tight">
                  <div className="font-display-body text-lg text-body-bg">
                    عيادة د. مها دحلان
                  </div>
                  <div className="text-xs text-body-bg/60">
                    نحت الجسم الطبي
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 max-w-sm">
                وجهتك الأنيقة لنحت الجسم بتقنية التحفيز العضلي الكهرومغناطيسي.
                تجربة طبية فاخرة مصمّمة لها.
              </p>
            </div>
            <div>
              <span className="eyebrow-body text-body-bg/60">تواصل معنا</span>
              <ul className="mt-4 grid gap-3 text-sm leading-7">
                <li>
                  جدة، حي الروضة، شارع الأمير محمد بن عبدالعزيز (التحلية)،
                  مركز بن حمران – الدور الثالث
                </li>
                <li>
                  <a
                    href="mailto:info@mahadahlan.com"
                    dir="ltr"
                    className="hover:text-body-accent transition"
                  >
                    info@mahadahlan.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+966920007515"
                    dir="ltr"
                    className="hover:text-body-accent transition"
                  >
                    +966 920007515
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+966503377702"
                    dir="ltr"
                    className="hover:text-body-accent transition"
                  >
                    +966 503377702
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <span className="eyebrow-body text-body-bg/60">ساعات العمل</span>
              <ul className="mt-4 grid gap-3 text-sm leading-7">
                <li>
                  <div className="text-body-bg">السبت – الخميس</div>
                  <div className="text-body-bg/70">١٢:٠٠ ظ – ٨:٠٠ م</div>
                </li>
                <li>
                  <div className="text-body-bg">الجمعة</div>
                  <div className="text-body-bg/70">مغلق</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-body-bg/15 pt-6 text-xs text-body-bg/50 sm:flex-row sm:items-center sm:justify-between">
            <span>© ٢٠٢٦ عيادة د. مها دحلان. جميع الحقوق محفوظة.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
