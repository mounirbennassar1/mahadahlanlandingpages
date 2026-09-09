import type { Metadata } from "next";
import { PageHero } from "../_components/PageHero";
import { getPageContent } from "@/lib/pages/get";
import { PHONE_DISPLAY, TEL_LINK } from "@/app/_home/config";
import { CLINIC_EMAIL } from "../_booking/shared";
import { PRIVACY_POLICY } from "./content";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(PRIVACY_POLICY);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/privacy-policy" },
  };
}

export default async function PrivacyPolicyPage() {
  const c = await getPageContent(PRIVACY_POLICY);

  return (
    <>
      <PageHero
        crumbs={[{ label: c.hero.crumb }]}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        gold={c.hero.gold}
        lede={c.hero.lede}
        compact
      />

      <section className="mx-auto max-w-[820px] px-[22px] pb-[110px]">
        <h2 className="mb-8 text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.5] font-extrabold text-[var(--color-md-text)]">
          {c.policy.heading}
        </h2>

        <div className="flex flex-col gap-5">
          {c.policy.paragraphs.filter(Boolean).map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="m-0 text-[1rem] leading-[2] font-light text-[var(--color-md-muted)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 rounded-[22px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] px-7 py-8">
          <h3 className="mb-2.5 text-[1.1rem] font-extrabold text-[var(--color-md-text)]">
            {c.policy.contactHeading}
          </h3>
          <p className="m-0 mb-4 text-[0.95rem] font-light text-[var(--color-md-muted)]">
            {c.policy.contactBody}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-bold">
            <a dir="ltr" href={TEL_LINK} className="text-[var(--color-md-gold)]">
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CLINIC_EMAIL}`} className="text-[var(--color-md-gold)]">
              {CLINIC_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
