import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getActiveDevices } from "@/lib/content";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import { GoldLink, WhatsAppLink } from "@/app/(site)/_components/SiteButtons";
import { DeviceCard } from "./_components/DeviceCard";

export const revalidate = 300;

const DESCRIPTION =
  "أجهزة عيادات د. مها دحلان في جدة: ليزر إزالة الشعر، مورفيوس 8، ألثيرابي، هايدرافيشل والمزيد. أجهزة أصلية معتمدة تُفتح مستهلكاتها أمامك، بأيدي طبيبات خبيرات.";

export const metadata: Metadata = {
  title: "أجهزتنا",
  description: DESCRIPTION,
  alternates: { canonical: "/our-devices" },
};

const STEPS = [
  {
    num: "01",
    icon: Icon.ScanFace,
    title: "نسمع هدفك ونفحص بشرتك",
    body: "قبل أي جهاز، تحدد الطبيبة نوع بشرتك ودرجتها وما تحتاجينه فعلاً، فلا تُقترح عليكِ تقنية لا تناسبك.",
  },
  {
    num: "02",
    icon: Icon.Target,
    title: "نطابق الحالة مع التقنية",
    body: "لكل جهاز موجته وعمقه واستخدامه الأمثل. نختار التقنية على مقاس حالتك، لا العكس، وقد نكتفي بجهاز واحد بدل باقة.",
  },
  {
    num: "03",
    icon: Icon.CalendarCheck,
    title: "نبدأ بخطة واضحة ونتابع",
    body: "عدد الجلسات والتكلفة المتوقعة واضحة من أول لقاء، مع مواعيد مراجعة نطمئن فيها على تطور النتيجة.",
  },
];

const ASSURANCE = [
  { icon: Icon.BadgeCheck, label: "أجهزة أصلية معتمدة" },
  { icon: Icon.ShieldCheck, label: "مستهلكات تُفتح أمامك" },
  { icon: Icon.Users, label: "طاقم نسائي بالكامل" },
  { icon: Icon.Stethoscope, label: "إشراف استشارية" },
];

export default async function DevicesPage() {
  const devices = await getActiveDevices();

  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "الأجهزة" }]}
        eyebrow="أجهزتنا"
        title="أجهزتنا،"
        gold="تقنيات عالمية بأيدٍ خبيرة"
        lede="أجهزة أصلية معتمدة من شركات عالمية موثّقة، تُفتح مستهلكاتها أمامك داخل الجلسة، وتديرها طبيبات يعرفن متى يُستخدم الجهاز ومتى يُستغنى عنه. لأن النتيجة تبدأ من القرار الصحيح، لا من الجهاز وحده."
        actions={
          <>
            <GoldLink href="/book-now">
              <Icon.CalendarCheck className="size-[18px]" />
              احجزي جلستك
            </GoldLink>
            <WhatsAppLink />
          </>
        }
      />

      {/* ——— devices grid ——— */}
      <Section id="devices" className="bg-[var(--color-md-band)]">
        <RevealGroup className="flex flex-wrap justify-center gap-2.5 sm:gap-3" stagger={0.06}>
          {ASSURANCE.map((p) => (
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
            eyebrow="التقنيات"
            title="الأجهزة التي"
            gold="نثق بها"
            body="كل جهاز له استخدامه الأمثل. اضغطي على أي بطاقة لتعرفي ما يعالجه، وماذا تتوقعين في الجلسة، وأي برامجنا يعتمد عليه."
          />
        </div>

        {devices.length ? (
          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {devices.map((d) => (
              <DeviceCard key={d.slug} device={d} />
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="mt-12 rounded-[24px] border border-dashed border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] p-10 text-center">
            <Icon.Zap className="mx-auto size-10 text-[var(--color-md-gold)]" strokeWidth={1.6} />
            <h3 className="mt-4 text-[1.1rem] font-extrabold text-[var(--color-md-text)]">نُحدّث قائمة الأجهزة حالياً</h3>
            <p className="mt-2 text-[0.92rem] font-light text-[rgba(246,238,223,0.6)]">
              تواصلي معنا عبر واتساب ونخبرك بالتقنية الأنسب لحالتك.
            </p>
          </Reveal>
        )}
      </Section>

      {/* ——— how we choose ——— */}
      <Section id="how" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow="كيف نختار الجهاز المناسب لك"
          title="الجهاز يخدم الخطة،"
          gold="لا العكس"
          body="ثلاث خطوات تسبق تشغيل أي جهاز في عياداتنا."
        />
        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />
        <RevealGroup className="md-carousel relative mt-8 -mx-[22px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[22px] pt-5 pb-2 scroll-px-[22px] md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pt-4 md:pb-0">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative flex w-[76vw] max-w-[330px] shrink-0 snap-center flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-colors duration-400 hover:border-[rgba(232,195,106,0.45)] md:w-auto md:max-w-none"
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
              <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">{step.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand />
    </>
  );
}
