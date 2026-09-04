import { definePage, items, seoSection, t, ta } from "@/lib/pages/define";
import { SPECIALTIES } from "./config";
import { SPECIALTIES_EN } from "./i18n/dictionary";

/**
 * The treatment cards, which are one shared list rather than one page's copy:
 * they appear on the home marquee, the footer columns, the about-us strip and
 * the services grid. Editing them here changes all four at once.
 *
 * Images, icons, categories and the landing each card links to stay in
 * `config.ts` and are paired with these rows by slug order.
 */
const itemFields = {
  title: t("الاسم", ""),
  description: ta("الوصف", "", { rows: 2 }),
  tag: t("الوسم", ""),
} as const;

export const SPECIALTIES_PAGE = definePage({
  slug: "specialties",
  title: "بطاقات العلاجات",
  path: "/services",
  kind: "site",
  locale: "ar",
  leadSource: null,
  extraPaths: ["/", "/en", "/about-us"],
  sections: {
    seo: seoSection(
      "بطاقات العلاجات",
      "أسماء العلاجات وأوصافها كما تظهر في الصفحة الرئيسية والخدمات وصفحة من نحن.",
    ),
    ar: {
      title: "العربية",
      hint: "تظهر في الرئيسية وصفحة الخدمات وصفحة من نحن والتذييل.",
      fields: {
        cards: items(
          "البطاقات",
          itemFields,
          SPECIALTIES.map((s) => ({
            title: s.title,
            description: s.description,
            tag: s.tag,
          })),
          { fixed: true, hint: "لكل بطاقة صورة وأيقونة ثابتة في التصميم." },
        ),
      },
    },
    en: {
      title: "English",
      hint: "Shown on the English home page.",
      fields: {
        cards: items(
          "Cards",
          itemFields,
          SPECIALTIES.map((s) => {
            const en = SPECIALTIES_EN[s.slug];
            return {
              title: en?.title ?? s.title,
              description: en?.description ?? s.description,
              tag: en?.tag ?? s.tag,
            };
          }),
          { fixed: true, hint: "Each card keeps its image and icon." },
        ),
      },
    },
  },
});
