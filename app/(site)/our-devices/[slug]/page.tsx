import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup } from "@/app/_home/Motion";
import { GOLD_GRADIENT, toArabicDigits } from "@/app/_home/config";
import { getActiveDevices, getDeviceBySlug } from "@/lib/content";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import {
  CAROUSEL,
  CAROUSEL_ITEM,
  GoldLink,
  OutlineLink,
  WhatsAppLink,
} from "@/app/(site)/_components/SiteButtons";
import { safeImageSrc, truncate } from "@/app/(site)/_components/media";
import { DeviceCard } from "../_components/DeviceCard";
import { DeviceFigure } from "../_components/DeviceFigure";
import { relatedSpecialties } from "../_components/related";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

const loadDevice = cache((slug: string) => getDeviceBySlug(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const device = await loadDevice(slug);
  if (!device) return { title: "الجهاز غير موجود" };

  const description = truncate(
    device.description ?? device.tagline ?? `جهاز ${toArabicDigits(device.name)} في عيادات د. مها دحلان بجدة.`,
    160,
  );
  const image = safeImageSrc(device.image);
  const name = toArabicDigits(device.name);
  const title = device.nameEn ? `${name} (${device.nameEn})` : name;

  return {
    title,
    description,
    alternates: { canonical: `/our-devices/${device.slug}` },
    openGraph: {
      title: `${title} | عيادات د. مها دحلان`,
      description,
      images: image ? [{ url: image, alt: device.imageAlt ?? name }] : undefined,
    },
  };
}

const SESSION = [
  {
    num: "٠١",
    icon: Icon.ScanFace,
    title: "تقييم",
    body: "تفحص الطبيبة بشرتك وتؤكد أن هذا الجهاز هو الخيار الأنسب لحالتك، أو تقترح بديلاً أدق.",
  },
  {
    num: "٠٢",
    icon: Icon.Zap,
    title: "الجلسة",
    body: "تُضبط الإعدادات لدرجة بشرتك، وتُفتح المستهلكات الأصلية أمامك، مع راحة وتبريد طوال الجلسة.",
  },
  {
    num: "٠٣",
    icon: Icon.CalendarCheck,
    title: "المتابعة",
    body: "تعليمات واضحة لما بعد الجلسة، وموعد مراجعة نطمئن فيه على تطور النتيجة ونحدد الجلسة التالية.",
  },
];

export default async function DevicePage({ params }: Props) {
  const { slug } = await params;
  const [device, all] = await Promise.all([loadDevice(slug), getActiveDevices()]);
  if (!device) notFound();

  const others = all.filter((d) => d.slug !== device.slug).slice(0, 4);
  const related = relatedSpecialties(device);
  const bookHref = `/book-now?service=${encodeURIComponent(device.slug)}`;
  const name = toArabicDigits(device.name);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/our-devices", label: "الأجهزة" }, { label: name }]}
        eyebrow={device.nameEn ?? "جهاز طبي معتمد"}
        title={name}
        gold={device.tagline ?? undefined}
        lede={device.description ?? undefined}
        aside={
          <div className="relative mx-auto w-full max-w-[460px] lg:mx-0 lg:justify-self-start">
            <div
              className="pointer-events-none absolute -inset-3 rounded-[34px] border border-[rgba(201,156,78,0.3)]"
              aria-hidden
            />
            <DeviceFigure
              device={device}
              variant="hero"
              priority
              sizes="(max-width: 1024px) 90vw, 460px"
              className="shadow-[0_40px_90px_-40px_rgba(232,195,106,0.35)]"
            />
            {device.nameEn ? (
              <span
                dir="ltr"
                className="absolute top-5 left-5 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(11,8,5,0.8)] px-4 py-1.5 text-[0.74rem] font-extrabold tracking-[0.14em] text-[var(--color-md-champagne)] uppercase backdrop-blur-md"
              >
                {device.nameEn}
              </span>
            ) : null}
          </div>
        }
        actions={
          <>
            <GoldLink href={bookHref}>
              <Icon.CalendarCheck className="size-[18px]" />
              احجزي جلستك
            </GoldLink>
            <WhatsAppLink label="اسألي عن الجهاز" />
          </>
        }
      />

      {/* ——— what it treats + the session ——— */}
      <Section id="uses" className="bg-[var(--color-md-band)]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHead align="start" eyebrow="ما الذي يعالجه" title="متى نلجأ إلى" gold={name} />
            {device.usedFor.length ? (
              <RevealGroup className="mt-8 flex flex-col gap-3" stagger={0.07}>
                {device.usedFor.map((u) => (
                  <div
                    key={u}
                    className="flex items-center gap-3.5 rounded-[18px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] px-5 py-4 transition-colors duration-300 hover:border-[rgba(232,195,106,0.45)]"
                  >
                    <span
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--color-md-ink)]"
                      style={{ background: GOLD_GRADIENT }}
                      aria-hidden
                    >
                      <Icon.Check className="size-4" strokeWidth={3} />
                    </span>
                    <span className="text-[0.98rem] font-extrabold text-[var(--color-md-text)]">{u}</span>
                  </div>
                ))}
              </RevealGroup>
            ) : (
              <Reveal className="mt-8">
                <p className="text-[1rem] leading-[1.9] font-light text-[rgba(246,238,223,0.65)]">
                  تحدد الطبيبة في الاستشارة إن كان هذا الجهاز مناسباً لحالتك.
                </p>
              </Reveal>
            )}
            <Reveal delay={120} className="mt-7 flex items-start gap-3 rounded-[18px] border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.6)] p-4 text-[0.86rem] leading-[1.8] font-bold text-[rgba(246,238,223,0.65)]">
              <Icon.ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--color-md-champagne)]" />
              <span>
                لا يُشغَّل أي جهاز قبل تقييم الطبيبة. قد نكتفي بتقنية واحدة بدل باقة كاملة إن كانت تكفي لحالتك.
              </span>
            </Reveal>
          </div>

          <div>
            <SectionHead align="start" eyebrow="ماذا تتوقعين في الجلسة" title="ثلاث خطوات" gold="من الاستشارة إلى المتابعة" />
            <RevealGroup className="mt-8 flex flex-col gap-4">
              {SESSION.map((step) => (
                <div
                  key={step.num}
                  className="relative flex gap-5 rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-6 transition-colors duration-400 hover:border-[rgba(232,195,106,0.45)]"
                >
                  <span
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]"
                    aria-hidden
                  >
                    <step.icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[0.74rem] font-extrabold text-[var(--color-md-gold)]">{step.num}</span>
                      <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">{step.title}</h3>
                    </div>
                    <p className="mt-1.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.6)]">{step.body}</p>
                  </div>
                </div>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ——— related treatment pages ——— */}
      {related.length ? (
        <Section id="related" className="relative bg-[var(--color-md-bg)]">
          <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
          <SectionHead
            eyebrow="برامج تعتمد على هذا الجهاز"
            title="اكتشفي البرامج"
            gold="المرتبطة به"
            body="كل صفحة تشرح البرنامج كاملاً: لمن يناسب، وكيف تسير الجلسات، وكيف تحجزين."
          />
          <RevealGroup className={`${CAROUSEL} mt-10 md:grid-cols-3`}>
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className={`group relative block overflow-hidden rounded-[22px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] transition-all duration-400 hover:-translate-y-1 hover:border-[rgba(232,195,106,0.55)] hover:shadow-[0_0_36px_-8px_rgba(232,195,106,0.45)] ${CAROUSEL_ITEM}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 380px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    style={{ objectPosition: item.focus ?? "center" }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(8,6,4,.94), rgba(8,6,4,.3) 55%, transparent 80%)",
                    }}
                    aria-hidden
                  />
                  <span className="absolute top-3 right-3 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(11,8,5,0.8)] px-3 py-1 text-[0.72rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
                    {item.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                    <span className="text-[1rem] leading-[1.5] font-extrabold text-[#F7F0E2]">{item.title}</span>
                    <span
                      className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(240,212,138,0.4)] text-[var(--color-md-champagne)] transition-all duration-300 group-hover:bg-[var(--color-md-champagne)] group-hover:text-[var(--color-md-ink)]"
                      aria-hidden
                    >
                      <Icon.ArrowLeft className="size-3.5" strokeWidth={2.4} />
                    </span>
                  </div>
                </div>
                <p className="p-4 pt-3 text-[0.86rem] leading-[1.8] font-light text-[rgba(246,238,223,0.6)]">
                  {item.description}
                </p>
              </Link>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {/* ——— other devices ——— */}
      {others.length ? (
        <Section id="others" className="bg-[var(--color-md-band)]">
          <SectionHead eyebrow="الأجهزة" title="أجهزة" gold="أخرى في العيادة" />
          <RevealGroup className={`${CAROUSEL} mt-10 md:grid-cols-2 lg:grid-cols-4`}>
            {others.map((d) => (
              <DeviceCard key={d.slug} device={d} className={CAROUSEL_ITEM} />
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex justify-center">
            <OutlineLink href="/our-devices">
              كل الأجهزة
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </OutlineLink>
          </Reveal>
        </Section>
      ) : null}

      <CtaBand
        bookHref={bookHref}
        bookLabel={`احجزي جلسة ${name}`}
        body="أخبرينا بما يشغلك، ونؤكد لكِ إن كان هذا الجهاز هو الأنسب لحالتك، مع التكلفة المتوقعة قبل أن تخطي خطوة واحدة نحو العيادة."
      />
    </>
  );
}
