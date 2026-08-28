import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { Payments } from "@/app/_home/Payments";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { formatSar, getActiveOffers } from "@/lib/content";
import { PageHero } from "../_components/PageHero";
import { CtaBand } from "../_components/CtaBand";
import { OfferGrid } from "./_components/OfferGrid";
import type { OfferItem } from "./_components/types";

export const revalidate = 300;

const DESCRIPTION =
  "كل عروض عيادات د. مها دحلان في جدة: الكشفيات، تنظيف البشرة، الهايدرافيشل، الجلاس سكين الكوري وجلسات الليزر بأسعار واضحة، مع التقسيط عبر تابي وتمارا.";

export const metadata: Metadata = {
  title: "العروض",
  description: DESCRIPTION,
  alternates: { canonical: "/offers" },
  openGraph: {
    title: "كل العروض | عيادات د. مها دحلان",
    description: DESCRIPTION,
    url: "/offers",
  },
};

const PROOF = [
  { icon: Icon.Star, text: "٤٫٨ من ٥ على Google" },
  { icon: Icon.MessageCircle, text: "أكثر من ١٢٧٠ تقييماً" },
  { icon: Icon.Award, text: "خبرة تتجاوز ١٣ عاماً" },
  { icon: Icon.Users, text: "طاقم نسائي بالكامل" },
];

const STEPS = [
  {
    num: "٠١",
    icon: Icon.Gift,
    title: "اختاري عرضك",
    body: "تصفّحي العروض حسب الفئة، واضغطي «احجزي العرض» على ما يناسبك. السعر المعلن هو ما ستدفعينه.",
  },
  {
    num: "٠٢",
    icon: Icon.ClipboardCheck,
    title: "أدخلي بياناتك",
    body: "اسمك وجوالك وطريقة الدفع المفضلة، في أقل من دقيقة. لا يُطلب أي دفع عبر الموقع.",
  },
  {
    num: "٠٣",
    icon: Icon.CalendarCheck,
    title: "نؤكد لك الموعد",
    body: "يتصل بك فريق الاستقبال خلال ساعات العمل لتثبيت الموعد، والدفع يتم داخل العيادة.",
  },
];

export default async function OffersPage() {
  const offers = await getActiveOffers();

  const items: OfferItem[] = offers.map((o) => ({
    id: o.id,
    slug: o.slug,
    title: o.title,
    description: o.description,
    price: o.price,
    priceLabel: formatSar(o.price),
    oldPriceLabel: o.oldPrice ? formatSar(o.oldPrice) : null,
    savePercent:
      o.oldPrice && o.oldPrice > o.price
        ? Math.round((1 - o.price / o.oldPrice) * 100)
        : null,
    badge: o.badge,
    category: o.category,
    image: o.image,
    imageAlt: o.imageAlt,
  }));

  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "العروض" }]}
        eyebrow="عروض العيادة"
        title="كل العروض،"
        gold="جمالك أقرب وأوفر"
        lede="أسعار معلنة بلا مفاجآت، تقسيط عبر تابي وتمارا داخل العيادة، وطاقم نسائي بالكامل. اختاري عرضك واحجزيه في أقل من دقيقة، ونؤكد لك الموعد خلال ساعات العمل."
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

      {/* offers grid (sticky filter lives inside) */}
      <section className="relative bg-[var(--color-md-band)] pb-[78px] sm:pb-[96px]">
        <OfferGrid offers={items} />
      </section>

      {/* how booking works */}
      <Section className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[520px]" />
        <SectionHead
          eyebrow="كيف يتم الحجز"
          title="ثلاث خطوات"
          gold="وموعدك مؤكد"
          body="لا دفع إلكتروني ولا تعقيد. تختارين العرض، نتصل بك، وتدفعين في العيادة بالطريقة التي تناسبك."
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

      {/* split payments */}
      <Section id="installments" className="relative bg-[var(--color-md-band)]">
        <Glow className="-top-14 left-1/3 h-[300px] w-[560px]" />
        <SectionHead
          eyebrow="الدفع على راحتك"
          title="عرضك اليوم،"
          gold="والدفع على دفعات"
          body="اختاري تابي أو تمارا عند الحجز، وتُقسَّم قيمة العرض على ٤ دفعات متساوية بدون فوائد، بموافقة فورية عند الاستقبال."
        />
        <Reveal className="mt-12">
          <Payments />
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="المواعيد محدودة أسبوعياً"
        title="لم تجدي عرضك؟"
        gold="احجزي استشارة"
        body="أخبرينا بما تحتاجين، ونقترح عليك العرض الأنسب لحالتك مع التكلفة المتوقعة قبل أن تخطي خطوة نحو العيادة."
      />
    </>
  );
}
