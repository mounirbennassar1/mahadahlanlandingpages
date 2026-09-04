import {
  definePage,
  items,
  li,
  seoSection,
  t,
  ta,
  type Locale,
  type PageDef,
  type SectionDef,
} from "@/lib/pages/define";
import { DICT } from "./i18n/dictionary";

/**
 * Editable copy for the home page, in both locales.
 *
 * Defaults are read straight from the locale dictionary, so `dictionary.ts`
 * stays the single source of truth for the shipped copy and this file only
 * decides WHICH strings an admin may change. Structural values (hrefs, image
 * paths, aria labels, the payment provider ids) stay in code.
 */

const SEO: Record<Locale, { title: string; description: string }> = {
  ar: {
    title: "عيادات د. مها دحلان | تجربة طبية تجميلية فاخرة في جدة",
    description:
      "عيادات د. مها دحلان في جدة: البوتوكس والفيلر، شد الرقبة، الجلاس سكين الكوري، علاج التصبّغات وحب الشباب، نحت الجسم وعلاج تساقط الشعر. بإشراف نخبة الاستشاريين وطاقم نسائي بالكامل.",
  },
  en: {
    title: "Dr. Maha Dahlan Clinics | Dermatology, Aesthetics & Laser in Jeddah",
    description:
      "Dr. Maha Dahlan Clinics in Jeddah: Botox and fillers, neck lift, Korean glass skin, pigmentation and acne treatment, body sculpting and hair loss treatment. Led by consultant dermatologists, with an all-female team and 13+ years of experience.",
  },
};

function headSection(
  title: string,
  head: { eyebrow: string; title: string; gold: string; body: string },
) {
  return {
    title,
    fields: {
      eyebrow: t("Eyebrow", head.eyebrow),
      title: t("Title", head.title),
      gold: t("Title (gold part)", head.gold),
      body: ta("Body", head.body, { rows: 3 }),
    },
  } satisfies SectionDef;
}

function defineHomePage(locale: Locale) {
  const d = DICT[locale];
  const isAr = locale === "ar";

  return definePage({
    slug: isAr ? "home-ar" : "home-en",
    title: isAr ? "Home (Arabic)" : "Home (English)",
    path: isAr ? "/" : "/en",
    kind: "home",
    locale,
    leadSource: null,
    sections: {
      seo: seoSection(SEO[locale].title, SEO[locale].description),

      topbar: {
        title: "Top bar",
        hint: "The thin bar above the header. Announcements rotate.",
        fields: {
          announcements: li("Announcements", d.topbar.announcements, { maxItems: 8 }),
          hoursShort: t("Opening hours (short)", d.topbar.hoursShort),
        },
      },

      nav: {
        title: "Navigation",
        hint: "Link labels only. The pages they point to are fixed.",
        fields: {
          items: items(
            "Menu items",
            { label: t("Label", "") },
            d.nav.items.map((i) => ({ label: i.label })),
            { fixed: true },
          ),
          book: t("Book button (desktop)", d.nav.book),
          bookMobile: t("Book button (mobile menu)", d.nav.bookMobile),
        },
      },

      hero: {
        title: "Hero",
        fields: {
          eyebrow: t("Eyebrow", d.hero.eyebrow),
          line1: t("Headline line 1", d.hero.line1),
          line2: t("Headline line 2", d.hero.line2),
          body: ta("Body", d.hero.body, { rows: 3 }),
          book: t("Book button", d.hero.book),
          whatsapp: t("WhatsApp button", d.hero.whatsapp),
          scrollCue: t("Scroll cue", d.hero.scrollCue),
        },
      },

      marquee: {
        title: "Trust marquee",
        hint: "The scrolling strip under the hero.",
        fields: { items: li("Words", d.marquee, { maxItems: 24 }) },
      },

      specialties: headSection("Specialties heading", d.specialties),

      why: {
        title: "Why us",
        fields: {
          eyebrow: t("Eyebrow", d.why.eyebrow),
          title: t("Title", d.why.title),
          gold: t("Title (gold part)", d.why.gold),
          body: ta("Body", d.why.body, { rows: 3 }),
          cta: t("Button", d.why.cta),
          cards: items(
            "Cards",
            { title: t("Title", ""), body: ta("Body", "", { rows: 3 }) },
            d.why.cards,
            { fixed: true, hint: "Each card keeps its icon." },
          ),
        },
      },

      team: headSection("Team heading", d.team),
      reviews: headSection("Reviews heading", d.reviews),
      visit: headSection("Visit us heading", d.visit),
      pay: headSection("Payments heading", d.pay),

      doctors: {
        title: "Doctors",
        hint: "Photos stay in code. Credentials are one line each.",
        fields: {
          items: items(
            "Doctors",
            {
              label: t("Label", ""),
              name: t("Name", ""),
              title: t("Title", ""),
              credentials: li("Credentials", []),
            },
            d.doctors.items.map((doc) => ({
              label: doc.label,
              name: doc.name,
              title: doc.title,
              credentials: doc.credentials,
            })),
            { fixed: true },
          ),
          caption: t("Caption", d.doctors.caption),
        },
      },

      testimonials: {
        title: "Testimonials",
        hint: "Two rows scrolling in opposite directions.",
        fields: {
          rowA: items(
            "Row 1",
            {
              quote: ta("Quote", "", { rows: 3 }),
              name: t("Name", ""),
              caption: t("Caption", ""),
              initial: t("Initial", "", { maxLength: 4 }),
            },
            d.testimonials.rowA,
            { maxItems: 20 },
          ),
          rowB: items(
            "Row 2",
            {
              quote: ta("Quote", "", { rows: 3 }),
              name: t("Name", ""),
              caption: t("Caption", ""),
              initial: t("Initial", "", { maxLength: 4 }),
            },
            d.testimonials.rowB,
            { maxItems: 20 },
          ),
        },
      },

      hours: {
        title: "Hours and location",
        fields: {
          title: t("Title", d.hours.title),
          rows: items(
            "Opening hours",
            { label: t("Day", ""), time: t("Time", "") },
            d.hours.rows.map((r) => ({ label: r.label, time: r.time })),
            { fixed: true },
          ),
          address: t("Address", d.hours.address, { maxLength: 300 }),
        },
      },

      payments: {
        title: "Payments and instalments",
        fields: {
          providers: items(
            "Providers",
            { title: t("Title", ""), body: ta("Body", "", { rows: 2 }) },
            d.payments.providers.map((p) => ({ title: p.title, body: p.body })),
            { fixed: true },
          ),
          perks: li("Perks", d.payments.perks, { maxItems: 10 }),
          methodsTitle: t("Payment methods title", d.payments.methodsTitle),
          methodsBody: ta("Payment methods body", d.payments.methodsBody, { rows: 2 }),
        },
      },

      contact: {
        title: "Contact band",
        fields: {
          badge: t("Badge", d.contact.badge),
          title: t("Title", d.contact.title),
          gold: t("Title (gold part)", d.contact.gold),
          body: ta("Body", d.contact.body, { rows: 3 }),
          whatsapp: t("WhatsApp button", d.contact.whatsapp),
          points: li("Points", d.contact.points, { maxItems: 8 }),
        },
      },

      footer: {
        title: "Footer",
        fields: {
          blurb: ta("Blurb", d.footer.blurb, { rows: 3 }),
          siteHeading: t("Links column heading", d.footer.siteHeading),
          copyrightPrefix: t("Copyright prefix", d.footer.copyrightPrefix),
          copyrightSuffix: t("Copyright suffix", d.footer.copyrightSuffix),
          disclaimer: ta("Disclaimer", d.footer.disclaimer, { rows: 3 }),
        },
      },

      sticky: {
        title: "Mobile sticky bar",
        fields: { book: t("Book button", d.sticky.book) },
      },
    },
  });
}

export const HOME_AR = defineHomePage("ar");
export const HOME_EN = defineHomePage("en");

export const HOME_PAGES: PageDef[] = [HOME_AR, HOME_EN];

export type HomeContent = ReturnType<typeof defineHomePage>;
