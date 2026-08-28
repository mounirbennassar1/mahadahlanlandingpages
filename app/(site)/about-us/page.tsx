import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Counter, Parallax, Reveal, RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getActiveDoctors } from "@/lib/content";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import { CAROUSEL, CAROUSEL_ITEM, GoldLink, OutlineLink } from "@/app/(site)/_components/SiteButtons";
import { DoctorCard } from "@/app/(site)/doctors/_components/DoctorCard";
import { SpecialtiesStrip } from "./_components/SpecialtiesStrip";
import { VisitBlock } from "./_components/VisitBlock";

export const revalidate = 300;

const DESCRIPTION =
  "تعرّفي على مجمع عيادات د. مها دحلان الطبي في جدة: قصتنا ورؤيتنا ورسالتنا وقيمنا، وفريق نسائي بخبرة تتجاوز 13 عاماً في طب الجلدية والتجميل والليزر.";

export const metadata: Metadata = {
  title: "من نحن",
  description: DESCRIPTION,
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "من نحن | عيادات د. مها دحلان",
    description: DESCRIPTION,
    images: [{ url: "/site/about/clinic.png", width: 736, height: 1004, alt: "جلسة عناية بالبشرة في عيادات د. مها دحلان" }],
  },
};

const STORY = [
  "تأسس مجمع عيادات د. مها دحلان ليكون منارةً مضيئةً في عالم الطب الجلدي والتجميل، تنير درب الراغبين في العناية المتقنة، وتعكس شغفًا عميقًا بالعلم والجمال. انطلقت من خبرة طويلة اكتسبتها الدكتورة مها في أعرق المراكز الطبية والمستشفيات الحكومية، لتجسيد حلمٍ طال انتظاره، تُقدّم فيه الرعاية بكل احتراف وأمانة، ويكون فيه المريض أولًا، وعنايته غاية قبل أن تكون وسيلة.",
  "ومنذ بدايتها، أثبتت العيادة مكانتها بين النخبة، إذ أصبحت مقصدًا موثوقًا للمرضى، ومرجعًا يُوصى به الأطباء من مختلف التخصصات، لما لمسوه من جودة في الخدمة، وصدق في التعامل، ونتائج تُلهم الثقة والرضا.",
  "لسنا مجرد عيادة، بل وعدٌ بالالتزام، وعناية تنطلق من العلم وتمتد إلى راحة المريض ورضاه.",
];

const STATS: Array<
  | { kind: "count"; value: number; suffix?: string; label: string; note: string }
  | { kind: "static"; value: string; label: string; note: string }
> = [
  { kind: "count", value: 13, suffix: "+", label: "عاماً من الخبرة", note: "في أعرق المراكز والمستشفيات" },
  { kind: "static", value: "4.8", label: "من 5 على Google", note: "متوسط تقييم الزائرات" },
  { kind: "count", value: 1270, suffix: "+", label: "تقييماً موثّقاً", note: "على خرائط Google" },
  { kind: "count", value: 14, label: "برنامجاً علاجياً", note: "تحت سقفٍ واحد" },
];

const PILLARS = [
  {
    icon: Icon.Eye,
    title: "رؤيتنا",
    body: "أن نكون وجهةً رائدةً في طب الجلدية والتجميل، تجمع بين الخبرة والابتكار، وتُعنى بجودة الخدمات وتميّز النتائج.",
  },
  {
    icon: Icon.Target,
    title: "رسالتنا",
    body: "تقديم رعاية متخصصة وآمنة في مجال الجلدية والتجميل، ترتكز على العلم والصدق، وتلبي تطلعات المرضى بجودة عالية وثقة.",
  },
  {
    icon: Icon.Gem,
    title: "قيمنا",
    body: "ستة مبادئ تحكم كل قرار نتخذه، من أول استشارة حتى آخر مراجعة، وتجدينها في تفاصيل كل زيارة.",
  },
];

const VALUES = [
  { icon: Icon.ShieldCheck, title: "الأمانة الطبية", body: "لا نقترح إلا ما تحتاجينه فعلاً." },
  { icon: Icon.Gem, title: "الجودة والإتقان", body: "مواد أصلية وبروتوكولات معتمدة." },
  { icon: Icon.HeartHandshake, title: "التقدير الإنساني", body: "كل مريضة فردٌ من العائلة." },
  { icon: Icon.TrendingUp, title: "التطوير المستمر", body: "تدريب دائم وأحدث التقنيات." },
  { icon: Icon.Lock, title: "الخصوصية والثقة", body: "ملفك وجلستك في سرّية تامة." },
  { icon: Icon.Users, title: "العمل بروح الفريق", body: "طاقم نسائي بإشراف استشارية." },
];

const BEAUTY = [
  "في عيادات MD، لا نرى العناية بالبشرة مجرّد إجراء تجميلي، بل نراها لغةً تعبّر عن الذات، ووسيلةً لاستعادة الثقة، وتجلّيًا لصورة داخلية منسجمة مع الخارج.",
  "من رؤية الطبيبة الاستشارية د. مها دحلان، وبدافع شغفها العميق بطب الجلد وعلوم الجمال، وُلد هذا المكان ليكون مساحة يتقاطع فيها العلم مع الإحساس، ويُمنَح فيها الجمال ما يستحقه من فهمٍ ورعاية.",
  "ونعامل كل مريضة كأنها فردٌ من العائلة، تستحق لحظة صادقة من الاهتمام، ونتيجة تُشبهها، وتُشبه ما تطمح إليه.",
];

export default async function AboutPage() {
  const doctors = await getActiveDoctors();
  const team = doctors.slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[{ label: "من نحن" }]}
        eyebrow="من نحن"
        title="عن مجمع عيادات"
        gold="د. مها دحلان الطبي"
        lede="منارةٌ في عالم الطب الجلدي والتجميل بجدة، انطلقت من خبرة طويلة في أعرق المراكز الطبية، لتقدّم رعاية تضع المريضة أولاً وتُبنى على العلم والصدق. طاقم نسائي بالكامل، وأربعة عشر برنامجاً علاجياً تحت سقفٍ واحد."
        image="/site/about/clinic.png"
        imageAlt="طبيبة تضع قناعاً علاجياً على بشرة مريضة في عيادات د. مها دحلان"
        actions={
          <>
            <GoldLink href="/book-now">
              <Icon.CalendarCheck className="size-[18px]" />
              احجزي استشارتك
            </GoldLink>
            <OutlineLink href="/doctors">
              <Icon.Users className="size-[18px]" />
              تعرّفي على الفريق
            </OutlineLink>
          </>
        }
      />

      {/* ——— story + numbers ——— */}
      <Section id="story" className="bg-[var(--color-md-band)]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHead
              align="start"
              eyebrow="قصتنا"
              title="حلمٌ طال انتظاره،"
              gold="صار عيادةً تُوصى بها"
            />
            <Reveal delay={100} className="mt-8 flex flex-col gap-5">
              {STORY.map((p, i) => (
                <p
                  key={i}
                  className={`leading-[2] ${
                    i === STORY.length - 1
                      ? "border-r-2 border-[var(--color-md-gold)] pr-5 text-[1.05rem] font-bold text-[var(--color-md-champagne)]"
                      : "text-[1rem] font-light text-[rgba(246,238,223,0.7)]"
                  }`}
                >
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          <Reveal from="left" delay={160} className="lg:sticky lg:top-[140px]">
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[#120D07] p-7 sm:p-9">
              <div
                className="pointer-events-none absolute -top-28 left-1/2 h-[300px] w-[420px] -translate-x-1/2 blur-[40px]"
                style={{ background: "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.3), transparent 70%)" }}
                aria-hidden
              />
              <div className="relative">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.3)] px-[16px] py-1.5 text-[0.76rem] font-bold text-[#F0D48A]">
                  <span
                    className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                    style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
                  />
                  بالأرقام
                </span>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7">
                  {STATS.map((s) => (
                    <div key={s.label} className="border-t border-[var(--color-md-line)] pt-4">
                      <p className="md-gold-glow text-[clamp(2rem,4.6vw,2.7rem)] leading-none font-extrabold">
                        <span className="md-gold-text">
                          {s.kind === "count" ? <Counter value={s.value} suffix={s.suffix ?? ""} /> : s.value}
                        </span>
                      </p>
                      <p className="mt-2.5 text-[0.95rem] font-extrabold text-[var(--color-md-text)]">{s.label}</p>
                      <p className="mt-0.5 text-[0.78rem] font-bold text-[rgba(246,238,223,0.45)]">{s.note}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-7 flex items-center gap-2 border-t border-[var(--color-md-line)] pt-5 text-[0.84rem] font-bold text-[rgba(246,238,223,0.6)]">
                  <Icon.Users className="size-4 text-[var(--color-md-champagne)]" />
                  طاقم نسائي بالكامل، بإشراف استشارية جلدية وتجميل وليزر
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ——— vision / mission / values ——— */}
      <Section id="values" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow="ما نؤمن به"
          title="رؤيتنا ورسالتنا"
          gold="وقيمنا"
          body="ثلاثة أسس نضعها أمامنا في كل قرار طبي، وتجدينها حاضرة من الاستقبال حتى غرفة الجلسة."
        />

        <RevealGroup className="mt-12 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {PILLARS.map((card) => (
            <div
              key={card.title}
              className="group rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]"
            >
              <span
                className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-[var(--color-md-ink)] shadow-[0_0_22px_-6px_rgba(232,195,106,0.55)] transition-transform duration-400 group-hover:scale-110"
                style={{ background: GOLD_GRADIENT }}
                aria-hidden
              >
                <card.icon className="size-[22px]" strokeWidth={2} />
              </span>
              <h3 className="text-[1.2rem] font-extrabold text-[var(--color-md-text)]">{card.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-[1.9] font-light text-[rgba(246,238,223,0.62)]">{card.body}</p>
            </div>
          ))}
        </RevealGroup>

        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />

        <RevealGroup className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" stagger={0.06}>
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center rounded-[20px] border border-[var(--color-md-line)] bg-[rgba(22,16,10,0.6)] px-3 py-5 text-center transition-colors duration-300 hover:border-[rgba(232,195,106,0.45)]"
            >
              <span
                className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]"
                aria-hidden
              >
                <v.icon className="size-[18px]" strokeWidth={1.9} />
              </span>
              <h4 className="mt-3 text-[0.9rem] font-extrabold text-[var(--color-md-text)]">{v.title}</h4>
              <p className="mt-1 text-[0.74rem] leading-[1.7] font-bold text-[rgba(246,238,223,0.5)]">{v.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* ——— redefining beauty ——— */}
      <Section id="beauty" className="relative overflow-hidden bg-[var(--color-md-band)]">
        <Glow className="-bottom-24 left-1/4 h-[320px] w-[560px]" />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHead
              align="start"
              eyebrow="إعادة تعريف الجمال"
              title="علاجٌ واحدٌ..."
              gold="يُحدِث الفرق كلّ مرة"
            />
            <Reveal delay={100} className="mt-8 flex flex-col gap-5">
              {BEAUTY.slice(0, 2).map((p, i) => (
                <p key={i} className="text-[1rem] leading-[2] font-light text-[rgba(246,238,223,0.7)]">
                  {p}
                </p>
              ))}
              <blockquote className="relative mt-2 rounded-[22px] border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] p-6 pr-14">
                <Icon.Quote
                  className="absolute top-5 right-5 size-6 fill-[rgba(201,156,78,0.5)] text-[rgba(201,156,78,0.5)]"
                  aria-hidden
                />
                <p className="text-[1.08rem] leading-[1.9] font-extrabold text-[var(--color-md-champagne)]">
                  هنا، لا نُجمّل الملامح فحسب، بل نُكرّم الحكايات التي تحملها.
                </p>
                <footer className="mt-3 text-[0.8rem] font-bold text-[rgba(246,238,223,0.5)]">
                  د. مها دحلان، استشارية الجلدية والتجميل والليزر ومؤسسة العيادة
                </footer>
              </blockquote>
              <p className="text-[1rem] leading-[2] font-light text-[rgba(246,238,223,0.7)]">{BEAUTY[2]}</p>
            </Reveal>
          </div>

          <Reveal from="left" className="relative mx-auto w-full max-w-[480px] lg:mx-0 lg:justify-self-start">
            <Parallax from={24} to={-24}>
              <div
                className="pointer-events-none absolute -inset-3 rounded-[32px] border border-[rgba(201,156,78,0.3)]"
                aria-hidden
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] shadow-[0_40px_90px_-40px_rgba(232,195,106,0.35)]">
                <Image
                  src="/site/about/beauty.png"
                  alt="أخصائية تطبّق قناعاً مرطّباً على بشرة مريضة"
                  fill
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-cover object-top"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{ background: "linear-gradient(to top, rgba(11,8,5,.7), transparent)" }}
                  aria-hidden
                />
                <span className="absolute right-5 bottom-5 inline-flex items-center gap-2 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(11,8,5,0.8)] px-4 py-2 text-[0.78rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
                  <Icon.Sparkles className="size-3.5" />
                  العلم يلتقي بالإحساس
                </span>
              </div>
            </Parallax>
          </Reveal>
        </div>
      </Section>

      {/* ——— team teaser ——— */}
      {team.length ? (
        <Section id="team" className="relative bg-[var(--color-md-bg)]">
          <Glow className="-top-10 left-1/3 h-[300px] w-[560px]" />
          <SectionHead
            eyebrow="من يقف خلف نتيجتك"
            title="فريقٌ نسائي"
            gold="بقيادة استشارية"
            body="نخبة من طبيبات الجلدية والتجميل بقيادة د. مها دحلان، وكل خطة علاجية تمرّ على عينها قبل أن تبدأ."
          />
          <RevealGroup className={`${CAROUSEL} mt-10 md:grid-cols-2 lg:grid-cols-3`}>
            {team.map((d) => (
              <DoctorCard key={d.slug} doctor={d} className={CAROUSEL_ITEM} />
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex justify-center">
            <OutlineLink href="/doctors">
              كل الطبيبات والأخصائيات
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </OutlineLink>
          </Reveal>
        </Section>
      ) : null}

      {/* ——— specialties strip ——— */}
      <section id="specialties" className="overflow-hidden bg-[var(--color-md-band)] py-[78px] sm:py-[96px]">
        <div className="mx-auto max-w-[1180px] px-[22px]">
          <SectionHead
            eyebrow="تخصصاتنا"
            title="أربعة عشر برنامجاً"
            gold="تحت سقفٍ واحد"
            body="من البوتوكس والفيلر إلى نحت الجسم وعلاج تساقط الشعر. كل بطاقة تفتح صفحة كاملة بالتفاصيل وطريقة الحجز."
          />
        </div>
        <Reveal className="mt-10">
          <SpecialtiesStrip />
        </Reveal>
        <Reveal className="mt-8 flex justify-center px-[22px]">
          <Link
            href="/#specialties"
            className="inline-flex items-center gap-2 text-[0.9rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:text-[var(--color-md-neon)]"
          >
            استعرضي كل التخصصات
            <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
          </Link>
        </Reveal>
      </section>

      {/* ——— visit ——— */}
      <Section id="visit" className="bg-[var(--color-md-bg)]">
        <SectionHead
          eyebrow="زورينا في جدة"
          title="موقعنا"
          gold="وساعات العمل"
          body="نستقبلك في أجواء هادئة تحفظ خصوصيتك، في قلب حي الروضة على شارع التحلية."
        />
        <Reveal className="mt-12">
          <VisitBlock />
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
