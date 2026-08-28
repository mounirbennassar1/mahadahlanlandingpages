import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { Payments } from "@/app/_home/Payments";
import { GOLD_GRADIENT } from "@/app/_home/config";
import {
  getActiveDoctors,
  getActiveServicesGrouped,
  getOfferBySlug,
} from "@/lib/content";
import { PageHero } from "../_components/PageHero";
import { BookingForm } from "./_components/BookingForm";
import { ContactCards } from "./_components/ContactCards";
import { HoursAndMap } from "./_components/HoursAndMap";
import { Faq, type FaqItem } from "./_components/Faq";

export const revalidate = 300;

const DESCRIPTION =
  "احجزي موعدك في عيادات د. مها دحلان بجدة: استشارة صادقة، تكلفة واضحة قبل الجلسة، طاقم نسائي بالكامل، وتقسيط عبر تابي وتمارا. نرد عليك خلال ساعات العمل.";

export const metadata: Metadata = {
  title: "احجزي موعدك",
  description: DESCRIPTION,
  alternates: { canonical: "/book-now" },
  openGraph: {
    title: "احجزي موعدك | عيادات د. مها دحلان",
    description: DESCRIPTION,
    url: "/book-now",
  },
};

const PROOF = [
  { icon: Icon.Star, text: "4.8 من 5 على Google" },
  { icon: Icon.MessageCircle, text: "أكثر من 1270 تقييماً" },
  { icon: Icon.Award, text: "خبرة تتجاوز 13 عاماً" },
  { icon: Icon.Users, text: "طاقم نسائي بالكامل" },
];

const AFTER_BOOKING = [
  {
    num: "01",
    icon: Icon.Phone,
    title: "نتصل بك لتأكيد الموعد",
    body: "خلال ساعات العمل يتواصل معك فريق الاستقبال لتثبيت اليوم والوقت الأنسب لك.",
  },
  {
    num: "02",
    icon: Icon.ClipboardList,
    title: "نشرح لك الخطة والتكلفة",
    body: "تعرفين ما الذي ستشمله الزيارة الأولى وتكلفتها المتوقعة قبل أن تصلي إلى العيادة.",
  },
  {
    num: "03",
    icon: Icon.HeartHandshake,
    title: "نستقبلك في غرفة خاصة",
    body: "طاقم نسائي بالكامل من الاستقبال حتى غرفة الجلسة، وخصوصية تامة لملفك الطبي.",
  },
];

const FAQ: FaqItem[] = [
  {
    q: "هل أحتاج إلى استشارة قبل الجلسة؟",
    a: "نعم في أغلب الحالات. تبدأ الزيارة الأولى بتقييم مع الطبيبة لتحديد ما تحتاجينه فعلاً، وقد تُجرى بعض الجلسات في اليوم نفسه إذا كانت حالتك مناسبة. تخبرك موظفة الاستقبال بقيمة الكشفية عند تأكيد الموعد، فلا مفاجآت في التكلفة.",
  },
  {
    q: "هل يمكنني تقسيط قيمة الجلسة؟",
    a: "نعم. نوفر التقسيط عبر تابي وتمارا داخل العيادة على 4 دفعات متساوية بدون فوائد، بموافقة فورية عند الاستقبال وبدون بطاقة ائتمانية. كما نقبل الدفع نقداً وبالبطاقات ومدى.",
  },
  {
    q: "هل الطاقم نسائي بالكامل؟ وماذا عن خصوصيتي؟",
    a: "الطاقم نسائي بالكامل من الاستقبال حتى غرفة الجلسة. ملفك الطبي وصورك سرّية ولا تُستخدم لأي غرض دون إذن كتابي منك، والجلسات تتم في غرف خاصة.",
  },
  {
    q: "كيف أغيّر موعدي أو ألغيه؟",
    a: "اتصلي بنا أو أرسلي رسالة عبر واتساب ونعيد جدولة موعدك بلا رسوم. نقدّر إخبارنا قبل 24 ساعة على الأقل ليستفيد غيرك من الموعد.",
  },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() || null;
}

export default async function BookNowPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const serviceSlug = first(sp.service);
  const doctorSlug = first(sp.doctor);
  const offerSlug = first(sp.offer);

  const [grouped, doctors, offer] = await Promise.all([
    getActiveServicesGrouped(),
    doctorSlug ? getActiveDoctors() : Promise.resolve([]),
    offerSlug ? getOfferBySlug(offerSlug) : Promise.resolve(null),
  ]);

  const doctor = doctors.find((d) => d.slug === doctorSlug) ?? null;
  const groups = grouped.map((g) => ({
    group: g.group,
    items: g.items.map((s) => ({ slug: s.slug, name: s.name })),
  }));

  return (
    <>
      <PageHero
        crumbs={[{ label: "احجزي موعدك" }]}
        eyebrow="احجزي الآن"
        title="الجمال يبدأ من هنا،"
        gold="بموعدٍ يناسبك"
        lede="أخبرينا بما تحتاجين، ونعاود الاتصال بك خلال ساعات العمل لتأكيد الموعد وشرح التكلفة قبل أي جلسة. طاقم نسائي بالكامل، وخصوصية تامة من الاستقبال حتى غرفة الجلسة."
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
        aside={
          <BookingForm
            groups={groups}
            initialService={serviceSlug}
            doctor={doctor ? { slug: doctor.slug, name: doctor.name } : null}
            offer={offer ? { slug: offer.slug, title: offer.title } : null}
          />
        }
      />

      {/* contact */}
      <Section className="bg-[var(--color-md-band)]">
        <SectionHead
          eyebrow="تواصلي معنا"
          title="الطريقة الأسهل"
          gold="للوصول إلينا"
          body="اتصال، واتساب، بريد، أو زيارة مباشرة. اختاري ما يريحك، وسنكمل معك من هناك."
        />
        <div className="mt-12">
          <ContactCards />
        </div>
      </Section>

      {/* hours + map */}
      <Section id="visit" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow="زورينا في جدة"
          title="موقعنا"
          gold="وساعات العمل"
          body="نستقبلك في أجواء هادئة تحفظ خصوصيتك. اطمئني على وقت الدوام، واتركي للخريطة أن تدلّك علينا."
        />
        <Reveal className="mt-12">
          <HoursAndMap />
        </Reveal>
      </Section>

      {/* after booking */}
      <Section className="bg-[var(--color-md-band)]">
        <SectionHead
          eyebrow="ماذا يحدث بعد الحجز"
          title="ثلاث خطوات"
          gold="حتى موعدك"
        />
        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />
        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {AFTER_BOOKING.map((step) => (
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

      {/* faq */}
      <Section className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-10 left-1/4 h-[300px] w-[520px]" />
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHead
            align="start"
            eyebrow="أسئلة شائعة"
            title="قبل أن تحجزي،"
            gold="أجوبة واضحة"
            body="ما تسألنا عنه الزائرات عادةً قبل الموعد الأول. وإن بقي سؤال، فواتساب العيادة مفتوح خلال ساعات العمل."
          />
          <Reveal>
            <Faq items={FAQ} />
          </Reveal>
        </div>
      </Section>

      {/* split payments */}
      <Section id="installments" className="relative bg-[var(--color-md-band)]">
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
    </>
  );
}
