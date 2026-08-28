import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getActiveDoctors } from "@/lib/content";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import { GoldLink, WhatsAppLink } from "@/app/(site)/_components/SiteButtons";
import { DoctorCard } from "./_components/DoctorCard";
import { TeamCollage } from "./_components/TeamCollage";

export const revalidate = 300;

const INTRO =
  "يضم مجمع عيادات د. مها دحلان الطبي فريقًا طبيًا متمرسًا يتمتع بخبرة واسعة ويقدم رعاية دقيقة وشخصية لكل مراجعة يوميًا، ونحرص على تقديم رعاية صحية عالية الجودة تعتمد على المعرفة المتخصصة والاهتمام الفردي لضمان أفضل النتائج.";

export const metadata: Metadata = {
  title: "الأطباء",
  description:
    "طبيبات وأخصائيات عيادات د. مها دحلان في جدة: فريق نسائي بالكامل بقيادة استشارية الجلدية والتجميل والليزر، بخبرة تتجاوز 13 عاماً ورعاية شخصية لكل مراجعة.",
  alternates: { canonical: "/doctors" },
};

const PROOF = [
  { icon: Icon.Users, label: "طاقم نسائي بالكامل" },
  { icon: Icon.Award, label: "خبرة تتجاوز 13 عاماً" },
  { icon: Icon.Star, label: "4.8 من 5 على Google" },
  { icon: Icon.MessageCircle, label: "أكثر من 1270 تقييماً" },
];

const WHY_TEAM = [
  {
    icon: Icon.Users,
    title: "طاقم نسائي بالكامل",
    body: "من الاستقبال حتى غرفة الجلسة، تتعاملين مع طبيبات وأخصائيات فقط، بخصوصية تامة لملفك وصورك.",
  },
  {
    icon: Icon.Stethoscope,
    title: "إشراف استشارية على كل خطة",
    body: "كل بروتوكول علاجي يمرّ على عين د. مها دحلان قبل أن يبدأ، مهما كانت الطبيبة التي تتابع حالتك.",
  },
  {
    icon: Icon.CalendarCheck,
    title: "متابعة حتى النتيجة",
    body: "مواعيد مراجعة مجدولة بين الجلسات نطمئن فيها على تطور نتيجتك ونعدّل الخطة إن لزم.",
  },
];

export default async function DoctorsPage() {
  const doctors = await getActiveDoctors();

  return (
    <>
      <PageHero
        crumbs={[{ label: "الأطباء" }]}
        eyebrow="فريقنا الطبي"
        title="طبيبات وأخصائيات"
        gold="بخبرةٍ تُرى في النتيجة"
        lede={INTRO}
        compact={!doctors.length}
        aside={doctors.length ? <TeamCollage doctors={doctors} /> : undefined}
        actions={
          <>
            <GoldLink href="/book-now">
              <Icon.CalendarCheck className="size-[18px]" />
              احجزي موعدك
            </GoldLink>
            <WhatsAppLink />
          </>
        }
      />

      {/* ——— team grid ——— */}
      <Section id="team" className="bg-[var(--color-md-band)]">
        <RevealGroup className="flex flex-wrap justify-center gap-2.5 sm:gap-3" stagger={0.06}>
          {PROOF.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-4 py-2 text-[0.8rem] font-bold text-[var(--color-md-champagne)]"
            >
              <p.icon className="size-4" strokeWidth={2} />
              {p.label}
            </span>
          ))}
        </RevealGroup>

        <div className="mt-12">
          <SectionHead
            eyebrow="الفريق"
            title="تعرّفي على"
            gold="من سيرافقك في رحلتك"
            body="اختاري الطبيبة الأقرب إلى حالتك، واطّلعي على شهاداتها وتخصصاتها قبل أن تحجزي."
          />
        </div>

        {doctors.length ? (
          <RevealGroup className="mt-12 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d.slug} doctor={d} />
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="mt-12 rounded-[24px] border border-dashed border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] p-10 text-center">
            <Icon.Users className="mx-auto size-10 text-[var(--color-md-gold)]" strokeWidth={1.6} />
            <h3 className="mt-4 text-[1.1rem] font-extrabold text-[var(--color-md-text)]">نُحدّث صفحة الفريق حالياً</h3>
            <p className="mt-2 text-[0.92rem] font-light text-[rgba(246,238,223,0.6)]">
              تواصلي معنا عبر واتساب ونرشّح لكِ الطبيبة الأنسب لحالتك.
            </p>
          </Reveal>
        )}
      </Section>

      {/* ——— why our team ——— */}
      <Section id="why-team" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow="لماذا فريقنا"
          title="ما يميّز التجربة"
          gold="ليس الجهاز وحده"
          body="بل القرار الذي يسبقه، والأيدي التي تنفّذه، والمتابعة التي تأتي بعده."
        />
        <RevealGroup className="mt-12 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {WHY_TEAM.map((card) => (
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
              <h3 className="text-[1.1rem] font-extrabold text-[var(--color-md-text)]">{card.title}</h3>
              <p className="mt-2.5 text-[0.92rem] leading-[1.85] font-light text-[rgba(246,238,223,0.6)]">{card.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand />
    </>
  );
}
