import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT, SPECIALTIES } from "@/app/_home/config";
import { getActiveServicesGrouped } from "@/lib/content";
import { PageHero } from "../_components/PageHero";
import { CtaBand } from "../_components/CtaBand";
import { ServicesGrid } from "./_components/ServicesGrid";
import { OtherServices, type OtherServiceGroup } from "./_components/OtherServices";

export const revalidate = 300;

const DESCRIPTION =
  "كل خدمات عيادات د. مها دحلان في جدة: الجلدية والتجميل والليزر، البوتوكس والفيلر، نضارة البشرة، علاج التصبغات وحب الشباب، تساقط الشعر ونحت الجسم. طاقم نسائي بالكامل بخبرة تتجاوز 13 عاماً.";

export const metadata: Metadata = {
  title: "الخدمات",
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "الخدمات | عيادات د. مها دحلان",
    description: DESCRIPTION,
    url: "/services",
  },
};

const PROOF = [
  { icon: Icon.Star, text: "4.8 من 5 على Google" },
  { icon: Icon.MessageCircle, text: "أكثر من 1270 تقييماً" },
  { icon: Icon.Award, text: "خبرة تتجاوز 13 عاماً" },
  { icon: Icon.Users, text: "طاقم نسائي بالكامل" },
];

const HOW_WE_CHOOSE = [
  {
    num: "01",
    icon: Icon.Stethoscope,
    title: "تقييم صادق مع الطبيبة",
    body: "تبدأ كل زيارة بفحص وتشخيص دقيق لحالتكِ، ونخبركِ بصراحة إن كان العلاج مناسباً لكِ أو أن هناك خياراً أفضل.",
  },
  {
    num: "02",
    icon: Icon.ClipboardList,
    title: "خطة مخصصة وتكلفة واضحة",
    body: "نرسم لكِ بروتوكولاً يناسب بشرتكِ وأهدافكِ، وتعرفين التكلفة المتوقعة قبل أن تبدئي أي جلسة.",
  },
  {
    num: "03",
    icon: Icon.RefreshCw,
    title: "متابعة حتى النتيجة",
    body: "مواعيد مراجعة مجدولة بين الجلسات نطمئن فيها على تطور نتيجتكِ ونعدّل الخطة إن لزم.",
  },
];

/** Booking services not already covered by a treatment page above. */
async function loadOtherServices(): Promise<OtherServiceGroup[]> {
  const shown = new Set(SPECIALTIES.map((s) => s.slug));
  try {
    const grouped = await getActiveServicesGrouped();
    return grouped
      .map((g) => ({
        group: g.group,
        items: g.items
          .filter((s) => !(s.landingSlug && shown.has(s.landingSlug)))
          .map((s) => ({ slug: s.slug, name: s.name })),
      }))
      .filter((g) => g.items.length > 0);
  } catch {
    // The index is useful without the DB; degrade to the static grid only.
    return [];
  }
}

export default async function ServicesPage() {
  const otherGroups = await loadOtherServices();

  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "الخدمات" }]}
        eyebrow="خدماتنا"
        title="عناية متكاملة،"
        gold="بخبرات متخصصة"
        lede="اكتشفي مجموعة متكاملة من خدمات الجلدية والتجميل والليزر، صُممت لتلبي احتياجاتكِ المختلفة ضمن تجربة طبية راقية ومخصصة لكِ."
        actions={
          <ul className="flex flex-wrap justify-center gap-2.5">
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
      />

      {/* treatments grid (sticky filter lives inside) */}
      <section className="relative bg-[var(--color-md-band)] pb-[78px] sm:pb-[96px]">
        <ServicesGrid />
      </section>

      {/* booking-only services */}
      <OtherServices groups={otherGroups} />

      {/* how we choose */}
      <Section className="relative bg-[var(--color-md-band)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[520px]" />
        <SectionHead
          eyebrow="كيف نختار لكِ العلاج المناسب"
          title="ثلاث خطوات"
          gold="قبل أي جلسة"
          body="لا نبدأ بالعلاج قبل أن نفهم حالتكِ. تقييم صادق، خطة مخصصة، ومتابعة حتى تري النتيجة."
        />
        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />
        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {HOW_WE_CHOOSE.map((step) => (
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

      <CtaBand
        eyebrow="المواعيد محدودة أسبوعياً"
        title="لم تجدي ما تبحثين عنه؟"
        gold="احجزي استشارة"
        body="أخبرينا بما يشغلكِ، ونقترح عليكِ العلاج الأنسب لحالتكِ مع التكلفة المتوقعة قبل أن تخطي خطوة نحو العيادة."
        points={["تقييم مبدئي قبل الحجز", "تكلفة واضحة مسبقاً", "طاقم نسائي بالكامل"]}
      />
    </>
  );
}
