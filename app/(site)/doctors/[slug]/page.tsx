import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup } from "@/app/_home/Motion";
import { formatArabicDate, getActiveDoctors, getDoctorBySlug } from "@/lib/content";
import { getPageContent } from "@/lib/pages/get";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import { Monogram } from "@/app/(site)/_components/Monogram";
import {
  CAROUSEL,
  CAROUSEL_ITEM,
  CHIP,
  GoldLink,
  OutlineLink,
  WhatsAppLink,
} from "@/app/(site)/_components/SiteButtons";
import { firstSentence, initialOf, paragraphsOf, safeImageSrc, truncate } from "@/app/(site)/_components/media";
import { DoctorCard } from "../_components/DoctorCard";
import { DOCTORS } from "../content";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

/** Deduped between generateMetadata and the page within one request. */
const loadDoctor = cache((slug: string) => getDoctorBySlug(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await loadDoctor(slug);
  if (!doctor) return { title: "الطبيبة غير موجودة" };

  const description = truncate(
    doctor.bio ?? `${doctor.name}، ${doctor.title} في عيادات د. مها دحلان بجدة. احجزي موعدك اليوم.`,
    160,
  );
  const image = safeImageSrc(doctor.image);

  return {
    title: `${doctor.name}، ${doctor.title}`,
    description,
    alternates: { canonical: `/doctors/${doctor.slug}` },
    openGraph: {
      title: `${doctor.name} | عيادات د. مها دحلان`,
      description,
      type: "profile",
      images: image ? [{ url: image, alt: doctor.imageAlt ?? doctor.name }] : undefined,
    },
  };
}


export default async function DoctorPage({ params }: Props) {
  const { slug } = await params;
  const [{ hero, profile, cta }, doctor, all] = await Promise.all([
    getPageContent(DOCTORS),
    loadDoctor(slug),
    getActiveDoctors(),
  ]);
  if (!doctor) notFound();

  const others = all.filter((d) => d.slug !== doctor.slug).slice(0, 3);
  const image = safeImageSrc(doctor.image);
  const bookHref = `/book-now?doctor=${encodeURIComponent(doctor.slug)}`;
  const bio = paragraphsOf(doctor.bio);
  const lede = firstSentence(doctor.bio) || `${doctor.title} ${profile.ledeFallback}`;

  return (
    <>
      <PageHero
        crumbs={[{ href: "/doctors", label: hero.crumb }, { label: doctor.name }]}
        eyebrow={doctor.title}
        title={doctor.name}
        lede={lede}
        image={image ?? undefined}
        imageAlt={doctor.imageAlt ?? doctor.name}
        aside={
          image ? undefined : (
            <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:justify-self-start">
              <div
                className="pointer-events-none absolute -inset-x-3.5 -top-3.5 bottom-6 rounded-t-full border border-[rgba(201,156,78,0.4)]"
                aria-hidden
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
                <Monogram text={initialOf(doctor.name)} size="clamp(4rem, 14vw, 7rem)" />
              </div>
            </div>
          )
        }
        actions={
          <>
            <GoldLink href={bookHref}>
              <Icon.CalendarCheck className="size-[18px]" />
              {profile.bookHero} {doctor.name}
            </GoldLink>
            <WhatsAppLink />
          </>
        }
      />

      {/* ——— bio + credentials ——— */}
      <Section id="bio" className="bg-[var(--color-md-band)]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHead
              align="start"
              eyebrow={profile.bioEyebrow}
              title={profile.bioTitle}
              gold={doctor.name}
            />

            {bio.length ? (
              <Reveal delay={100} className="mt-8 flex flex-col gap-5">
                {bio.map((p, i) => (
                  <p key={i} className="text-[1.02rem] leading-[2] font-light text-[rgba(246,238,223,0.72)]">
                    {p}
                  </p>
                ))}
              </Reveal>
            ) : (
              <Reveal delay={100} className="mt-8">
                <p className="text-[1.02rem] leading-[2] font-light text-[rgba(246,238,223,0.72)]">
                  {doctor.title} {profile.bioFallback}
                </p>
              </Reveal>
            )}

            {doctor.specialties.length ? (
              <Reveal delay={160} className="mt-9">
                <h3 className="inline-flex items-center gap-2.5 text-[1.05rem] font-extrabold text-[var(--color-md-text)]">
                  <Icon.Sparkles className="size-5 text-[var(--color-md-champagne)]" />
                  {profile.specialtiesTitle}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {doctor.specialties.map((s) => (
                    <li key={s} className={`${CHIP} px-4 py-1.5 text-[0.84rem]`}>
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          <Reveal from="left" delay={140} className="lg:sticky lg:top-[140px]">
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[#120D07] p-7 sm:p-8">
              <div
                className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full blur-[40px]"
                style={{ background: "radial-gradient(circle, rgba(232,195,106,.18), transparent 70%)" }}
                aria-hidden
              />
              <h3 className="relative inline-flex items-center gap-2.5 text-[1.15rem] font-extrabold text-[var(--color-md-text)]">
                <Icon.GraduationCap className="size-5 text-[var(--color-md-champagne)]" />
                {profile.credentialsTitle}
              </h3>
              {doctor.credentials.length ? (
                <ul className="relative mt-5 list-none p-0">
                  {doctor.credentials.map((c) => (
                    <li key={c} className="flex items-start gap-3.5 border-t border-[var(--color-md-line)] py-3">
                      <Icon.BadgeCheck className="mt-1 size-[18px] shrink-0 text-[var(--color-md-gold)]" />
                      <span className="text-[0.9rem] leading-7 font-bold text-[rgba(246,238,223,0.78)]">{c}</span>
                    </li>
                  ))}
                  <li className="h-px bg-[var(--color-md-line)]" aria-hidden />
                </ul>
              ) : (
                <p className="relative mt-4 text-[0.92rem] font-light text-[rgba(246,238,223,0.6)]">
                  {profile.credentialsFallback}
                </p>
              )}
              <GoldLink href={bookHref} className="relative mt-6 w-full !py-3.5 text-[0.95rem]">
                <Icon.CalendarCheck className="size-[17px]" />
                {profile.bookAside}
              </GoldLink>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ——— articles by the doctor ——— */}
      {doctor.articles.length ? (
        <Section id="articles" className="relative bg-[var(--color-md-bg)]">
          <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
          <SectionHead
            eyebrow={profile.articlesEyebrow}
            title={profile.articlesTitle}
            gold={profile.articlesGold}
          />
          <RevealGroup className={`${CAROUSEL} mt-10 md:grid-cols-2 lg:grid-cols-3`}>
            {doctor.articles.map((a) => {
              const cover = safeImageSrc(a.coverImage);
              return (
                <Link
                  key={a.slug}
                  href={`/news-articles/${a.slug}`}
                  className={`group flex flex-col overflow-hidden rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)] ${CAROUSEL_ITEM}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0E0906]">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={a.coverAlt ?? a.title}
                        fill
                        sizes="(max-width: 768px) 80vw, 380px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse 60% 60% at 50% 60%, rgba(232,195,106,.22), transparent 70%)",
                        }}
                        aria-hidden
                      />
                    )}
                    {a.category ? (
                      <span className="absolute top-3 right-3 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(11,8,5,0.8)] px-3 py-1 text-[0.72rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
                        {a.category.name}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[1.02rem] leading-[1.6] font-extrabold text-[var(--color-md-text)] transition-colors group-hover:text-[var(--color-md-champagne)]">
                      {a.title}
                    </h3>
                    {a.excerpt ? (
                      <p className="mt-2 line-clamp-3 text-[0.86rem] leading-[1.8] font-light text-[rgba(246,238,223,0.6)]">
                        {a.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between pt-4 text-[0.78rem] font-bold text-[rgba(246,238,223,0.5)]">
                      <span>{formatArabicDate(a.publishedAt ?? a.createdAt)}</span>
                      <span className="inline-flex items-center gap-1.5 text-[var(--color-md-champagne)]">
                        {profile.readArticle}
                        <Icon.ArrowLeft className="size-3.5" strokeWidth={2.4} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </RevealGroup>
        </Section>
      ) : null}

      {/* ——— other doctors ——— */}
      {others.length ? (
        <Section id="others" className={doctor.articles.length ? "bg-[var(--color-md-band)]" : "bg-[var(--color-md-bg)]"}>
          <SectionHead
            eyebrow={profile.othersEyebrow}
            title={profile.othersTitle}
            gold={profile.othersGold}
            body={profile.othersBody}
          />
          <RevealGroup className={`${CAROUSEL} mt-10 md:grid-cols-3`}>
            {others.map((d) => (
              <DoctorCard key={d.slug} doctor={d} variant="compact" className={CAROUSEL_ITEM} />
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex justify-center">
            <OutlineLink href="/doctors">
              {profile.allDoctors}
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </OutlineLink>
          </Reveal>
        </Section>
      ) : null}

      <CtaBand
        {...cta}
        bookHref={bookHref}
        bookLabel={`${profile.ctaBook} ${doctor.name}`}
      />
    </>
  );
}
