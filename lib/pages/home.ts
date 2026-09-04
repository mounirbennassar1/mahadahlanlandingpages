import "server-only";
import { cache } from "react";
import { HOME_AR, HOME_EN } from "@/app/_home/content";
import { SPECIALTIES_PAGE } from "@/app/_home/specialties.content";
import { SPECIALTIES } from "@/app/_home/config";
import {
  DICT,
  type Dict,
  type Locale,
  type SpecialtyOverrides,
} from "@/app/_home/i18n/dictionary";
import { getPageContent } from "./get";

/**
 * Applies the saved home-page overrides onto the locale dictionary.
 *
 * The mapping is explicit rather than a deep merge so `Dict` keeps its exact
 * type and structural values the editor never exposes (hrefs, image paths,
 * aria labels, provider ids) can only ever come from code.
 */
export const getHomeDict = cache(async (locale: Locale = "ar"): Promise<Dict> => {
  const base = DICT[locale];
  const c = await getPageContent(locale === "ar" ? HOME_AR : HOME_EN);

  return {
    ...base,
    nav: {
      ...base.nav,
      book: c.nav.book,
      bookMobile: c.nav.bookMobile,
      items: base.nav.items.map((item, i) => ({
        ...item,
        label: c.nav.items[i]?.label ?? item.label,
      })),
    },
    topbar: {
      ...base.topbar,
      announcements: c.topbar.announcements.filter(Boolean),
      hoursShort: c.topbar.hoursShort,
    },
    hero: {
      ...base.hero,
      eyebrow: c.hero.eyebrow,
      line1: c.hero.line1,
      line2: c.hero.line2,
      body: c.hero.body,
      book: c.hero.book,
      whatsapp: c.hero.whatsapp,
      scrollCue: c.hero.scrollCue,
    },
    marquee: c.marquee.items.filter(Boolean),
    specialties: { ...base.specialties, ...c.specialties },
    why: {
      ...base.why,
      ...c.why,
      cards: base.why.cards.map((card, i) => ({ ...card, ...c.why.cards[i] })),
    },
    team: { ...base.team, ...c.team },
    reviews: { ...base.reviews, ...c.reviews },
    visit: { ...base.visit, ...c.visit },
    pay: { ...base.pay, ...c.pay },
    contact: {
      ...base.contact,
      badge: c.contact.badge,
      title: c.contact.title,
      gold: c.contact.gold,
      body: c.contact.body,
      whatsapp: c.contact.whatsapp,
      points: c.contact.points.filter(Boolean),
    },
    doctors: {
      ...base.doctors,
      caption: c.doctors.caption,
      items: base.doctors.items.map((doc, i) => {
        const edit = c.doctors.items[i];
        return edit
          ? {
              ...doc,
              label: edit.label,
              name: edit.name,
              title: edit.title,
              credentials: edit.credentials.filter(Boolean),
            }
          : doc;
      }),
    },
    testimonials: {
      rowA: c.testimonials.rowA.map((r, i) => ({ ...base.testimonials.rowA[i], ...r })),
      rowB: c.testimonials.rowB.map((r, i) => ({ ...base.testimonials.rowB[i], ...r })),
    },
    hours: {
      ...base.hours,
      title: c.hours.title,
      address: c.hours.address,
      rows: base.hours.rows.map((row, i) => ({
        ...row,
        label: c.hours.rows[i]?.label ?? row.label,
        time: c.hours.rows[i]?.time ?? row.time,
      })),
    },
    payments: {
      ...base.payments,
      providers: base.payments.providers.map((p, i) => ({ ...p, ...c.payments.providers[i] })),
      perks: c.payments.perks.filter(Boolean),
      methodsTitle: c.payments.methodsTitle,
      methodsBody: c.payments.methodsBody,
    },
    footer: {
      ...base.footer,
      blurb: c.footer.blurb,
      siteHeading: c.footer.siteHeading,
      copyrightPrefix: c.footer.copyrightPrefix,
      copyrightSuffix: c.footer.copyrightSuffix,
      disclaimer: c.footer.disclaimer,
    },
    sticky: { ...base.sticky, book: c.sticky.book },
  };
});

/** SEO copy for the home page of a locale. */
export const getHomeSeo = cache(async (locale: Locale = "ar") => {
  const c = await getPageContent(locale === "ar" ? HOME_AR : HOME_EN);
  return c.seo;
});

/**
 * Treatment-card copy for a locale, keyed by slug. The rows are paired with
 * `SPECIALTIES` by index, so the icons, images and categories stay in code.
 */
export const getSpecialtyCopy = cache(
  async (locale: Locale = "ar"): Promise<SpecialtyOverrides> => {
    const content = await getPageContent(SPECIALTIES_PAGE);
    const rows = locale === "ar" ? content.ar.cards : content.en.cards;
    const out: SpecialtyOverrides = {};
    SPECIALTIES.forEach((specialty, i) => {
      const row = rows[i];
      if (row) out[specialty.slug] = { title: row.title, description: row.description, tag: row.tag };
    });
    return out;
  },
);
