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
import { getPageContent } from "@/lib/pages/get";
import { PageHero } from "../_components/PageHero";
import { BookingForm } from "./_components/BookingForm";
import { ContactCards } from "./_components/ContactCards";
import { HoursAndMap } from "./_components/HoursAndMap";
import { Faq } from "./_components/Faq";
import { BOOK_NOW } from "./content";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(BOOK_NOW);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/book-now" },
    openGraph: {
      title: "احجزي موعدك | عيادات د. مها دحلان",
      description: seo.ogDescription,
      url: "/book-now",
    },
  };
}

/** Icons for the hero proof pills, in content order. */
const PROOF_ICONS = [Icon.Star, Icon.MessageCircle, Icon.Award, Icon.Users] as const;

/** Icons for the "after booking" steps, in content order. */
const AFTER_BOOKING_ICONS = [Icon.Phone, Icon.ClipboardList, Icon.HeartHandshake] as const;

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

  const [grouped, doctors, offer, c] = await Promise.all([
    getActiveServicesGrouped(),
    doctorSlug ? getActiveDoctors() : Promise.resolve([]),
    offerSlug ? getOfferBySlug(offerSlug) : Promise.resolve(null),
    getPageContent(BOOK_NOW),
  ]);

  const doctor = doctors.find((d) => d.slug === doctorSlug) ?? null;
  const groups = grouped.map((g) => ({
    group: g.group,
    items: g.items.map((s) => ({ slug: s.slug, name: s.name })),
  }));
  const proof = c.proof.items.map((p, i) => ({ ...p, icon: PROOF_ICONS[i] }));
  const afterBooking = c.afterBooking.items.map((s, i) => ({ ...s, icon: AFTER_BOOKING_ICONS[i] }));

  return (
    <>
      <PageHero
        crumbs={[{ label: c.hero.crumb }]}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        gold={c.hero.gold}
        lede={c.hero.lede}
        actions={
          <ul className="flex flex-wrap gap-2.5">
            {proof.map((p) => (
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
            copy={c.form}
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
          eyebrow={c.contact.eyebrow}
          title={c.contact.title}
          gold={c.contact.gold}
          body={c.contact.body}
        />
        <div className="mt-12">
          <ContactCards copy={c.contact} />
        </div>
      </Section>

      {/* hours + map */}
      <Section id="visit" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow={c.visit.eyebrow}
          title={c.visit.title}
          gold={c.visit.gold}
          body={c.visit.body}
        />
        <Reveal className="mt-12">
          <HoursAndMap copy={c.visit} />
        </Reveal>
      </Section>

      {/* after booking */}
      <Section className="bg-[var(--color-md-band)]">
        <SectionHead
          eyebrow={c.afterBooking.eyebrow}
          title={c.afterBooking.title}
          gold={c.afterBooking.gold}
        />
        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />
        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {afterBooking.map((step) => (
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
            eyebrow={c.faq.eyebrow}
            title={c.faq.title}
            gold={c.faq.gold}
            body={c.faq.body}
          />
          <Reveal>
            <Faq items={c.faq.questions} />
          </Reveal>
        </div>
      </Section>

      {/* split payments */}
      <Section id="installments" className="relative bg-[var(--color-md-band)]">
        <SectionHead
          eyebrow={c.payments.eyebrow}
          title={c.payments.title}
          gold={c.payments.gold}
          body={c.payments.body}
        />
        <Reveal className="mt-12">
          <Payments />
        </Reveal>
      </Section>
    </>
  );
}
