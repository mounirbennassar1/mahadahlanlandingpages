import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { PageHero } from "../_components/PageHero";
import { CtaBand } from "../_components/CtaBand";
import { whatsappHref } from "../_booking/shared";
import { CareersForm } from "./_components/CareersForm";
import { CAREER_FIELDS } from "./_components/fields";

const DESCRIPTION =
  "انضمي إلى فريق عيادات د. مها دحلان في جدة: بيئة نسائية محترمة، تدريب مستمر على أجهزة عالمية، وفريق بقيادة استشارية جلدية وتجميل. نستقبل السير الذاتية باستمرار للطبيبات والأخصائيات والممرضات وموظفات الاستقبال والتسويق.";

export const metadata: Metadata = {
  title: "الوظائف",
  description: DESCRIPTION,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "الوظائف | عيادات د. مها دحلان",
    description: DESCRIPTION,
    url: "/careers",
  },
};

const PROOF = [
  { icon: Icon.Users, text: "طاقم نسائي بالكامل" },
  { icon: Icon.Award, text: "خبرة تتجاوز 13 عاماً" },
  { icon: Icon.Star, text: "4.8 من 5 على Google" },
  { icon: Icon.MessageCircle, text: "أكثر من 1270 تقييماً" },
];

const PERKS = [
  {
    icon: Icon.HeartHandshake,
    title: "بيئة نسائية محترمة",
    body: "فريق نسائي بالكامل من الاستقبال حتى غرفة الجلسة، وثقافة عمل تقوم على الاحترام والتقدير لكل زميلة.",
  },
  {
    icon: Icon.GraduationCap,
    title: "تدريب مستمر وأجهزة عالمية",
    body: "تدريب دوري على أحدث البروتوكولات والأجهزة الطبية المعتمدة، لتظل مهاراتكِ في المقدمة دائماً.",
  },
  {
    icon: Icon.Stethoscope,
    title: "فريق بقيادة استشارية",
    body: "تعملين تحت إشراف مباشر من استشارية جلدية وتجميل وليزر بخبرة تتجاوز 13 عاماً، وتتعلمين من كل حالة.",
  },
  {
    icon: Icon.TrendingUp,
    title: "نمو مهني حقيقي",
    body: "مسار واضح للتطور داخل العيادة، ومسؤوليات تكبر مع خبرتكِ، لا وظيفة تقفين عندها.",
  },
];

const FIELD_ICONS = [
  Icon.Stethoscope,
  Icon.Zap,
  Icon.Bandage,
  Icon.Sparkles,
  Icon.Smile,
  Icon.PenTool,
  Icon.Plus,
];

const STEPS = [
  {
    num: "01",
    icon: Icon.ClipboardCheck,
    title: "أرسلي طلبكِ",
    body: "عبّئي النموذج في أعلى الصفحة وأضيفي رابط سيرتكِ الذاتية إن وُجد. لا يستغرق الأمر أكثر من دقيقتين.",
  },
  {
    num: "02",
    icon: Icon.ScanSearch,
    title: "مراجعة خلال أيام عمل",
    body: "يطّلع فريق الموارد البشرية على طلبكِ بعناية، ويتواصل معكِ إن كان ملفكِ مناسباً لأحد المجالات.",
  },
  {
    num: "03",
    icon: Icon.MapPin,
    title: "مقابلة في العيادة",
    body: "نلتقي بكِ في العيادة بجدة للتعرف عليكِ عن قرب، وتعريفكِ بالفريق وبيئة العمل قبل أي قرار.",
  },
];

const WA_CAREERS = whatsappHref("مرحباً، أرغب بالاستفسار عن التقديم للعمل في عيادات د. مها دحلان");

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "الوظائف" }]}
        eyebrow="انضمي إلى فريقنا"
        title="مكانكِ بيننا،"
        gold="إن كنتِ تشاركيننا الشغف"
        lede="فريق نسائي بالكامل بقيادة استشارية جلدية وتجميل، تدريب مستمر على أحدث الأجهزة، وبيئة عمل تحترمكِ وتقدّر جهدكِ. نستقبل السير الذاتية باستمرار، وإن كان ملفكِ مناسباً نعود إليكِ خلال أيام العمل."
        actions={
          <ul className="flex flex-wrap gap-2.5">
            {PROOF.map((p) => (
              <li
                key={p.text}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-4 py-2 text-[0.8rem] font-bold text-[rgba(246,238,223,0.82)]"
              >
                <p.icon className="size-3.5 text-[var(--color-md-champagne)]" strokeWidth={2.2} />
                {p.text}
              </li>
            ))}
          </ul>
        }
        aside={<CareersForm />}
      />

      {/* why us */}
      <Section className="relative bg-[var(--color-md-band)]">
        <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow="لماذا عيادات د. مها دحلان"
          title="مكان عمل"
          gold="يشبه طموحكِ"
          body="نؤمن أن التجربة الراقية التي نقدمها لمراجعاتنا تبدأ من فريق يشعر بالتقدير، ويتعلم كل يوم، ويجد مساحة للنمو."
        />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="flex flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]"
            >
              <span
                className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-[var(--color-md-ink)] shadow-[0_0_28px_-8px_rgba(232,195,106,0.6)]"
                style={{ background: GOLD_GRADIENT }}
                aria-hidden
              >
                <perk.icon className="size-[22px]" strokeWidth={1.9} />
              </span>
              <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">{perk.title}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
                {perk.body}
              </p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* fields */}
      <Section id="fields" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-10 left-1/4 h-[300px] w-[520px]" />
        <SectionHead
          eyebrow="نستقبل السير الذاتية باستمرار"
          title="المجالات التي نستقبل فيها"
          gold="السير الذاتية"
          body="لا نعلن عن شواغر محددة، بل نحتفظ بالسير الذاتية المناسبة ونتواصل معكِ عند توفر فرصة في مجالكِ. اختاري مجالكِ وابدئي طلبكِ."
        />
        <RevealGroup className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-4" stagger={0.06}>
          {CAREER_FIELDS.map((label, i) => {
            const FieldIcon = FIELD_ICONS[i] ?? Icon.Plus;
            return (
              <a
                key={label}
                href="#careers-form"
                className="group inline-flex items-center gap-3 rounded-full border border-[var(--color-md-line)] bg-[var(--color-md-card)] py-2.5 pe-5 ps-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(232,195,106,0.55)] hover:shadow-[0_0_28px_-10px_rgba(232,195,106,0.5)]"
              >
                <span
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--color-md-ink)] transition-transform duration-300 group-hover:scale-110"
                  style={{ background: GOLD_GRADIENT }}
                  aria-hidden
                >
                  <FieldIcon className="size-4" strokeWidth={2.2} />
                </span>
                <span className="text-[0.9rem] font-extrabold text-[var(--color-md-text)]">{label}</span>
                <Icon.ArrowUp
                  className="size-3.5 shrink-0 text-[var(--color-md-champagne)] transition-transform duration-300 group-hover:-translate-y-0.5"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </a>
            );
          })}
        </RevealGroup>
      </Section>

      {/* process */}
      <Section className="relative bg-[var(--color-md-band)]">
        <SectionHead
          eyebrow="كيف تتم عملية التقديم"
          title="ثلاث خطوات"
          gold="حتى المقابلة"
          body="بسيطة وواضحة. نقرأ كل طلب، ونحترم وقتكِ بردٍّ خلال أيام العمل."
        />
        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />
        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative flex flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-colors duration-400 hover:border-[rgba(232,195,106,0.45)]"
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
              <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">{step.title}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
                {step.body}
              </p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand
        id="apply"
        eyebrow="نقرأ كل طلب"
        title="أرسلي طلبكِ اليوم،"
        gold="ونعود إليكِ قريباً"
        body="لا نعد بوظيفة فورية، لكننا نعد بقراءة طلبكِ بعناية والرد عليكِ خلال أيام العمل إن كان ملفكِ مناسباً لأحد مجالاتنا."
        bookHref="#careers-form"
        bookLabel="التقديم الآن"
        whatsappHref={WA_CAREERS}
        points={["سرية تامة للبيانات", "رد خلال أيام العمل", "بيئة عمل نسائية"]}
      />
    </>
  );
}
