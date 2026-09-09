import { CLINIC_ADDRESS, CLINIC_EMAIL } from "@/app/(site)/_booking/shared";
import { MAPS_LINK, PHONE_DISPLAY, WHATSAPP_NUMBER } from "@/app/_home/config";
import { SITE_URL } from "@/lib/site";

/**
 * Structured data for the clinic.
 *
 * `MedicalClinic` is what Google reads for the local pack and the knowledge
 * panel, so the facts here must match the Google Business Profile exactly:
 * same name, same address, same phone. Keep them in sync when either changes.
 */

const TELEPHONE = "+966920007515";

export function clinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic`,
    name: "عيادات د. مها دحلان",
    alternateName: "MD Clinics",
    url: SITE_URL,
    telephone: TELEPHONE,
    email: CLINIC_EMAIL,
    image: `${SITE_URL}/logo.webp`,
    logo: `${SITE_URL}/logo.webp`,
    priceRange: "$$",
    currenciesAccepted: "SAR",
    paymentAccepted: "Cash, Mada, Visa, Mastercard, Apple Pay, Tabby, Tamara",
    medicalSpecialty: ["Dermatology", "PlasticSurgery"],
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC_ADDRESS,
      addressLocality: "جدة",
      addressRegion: "منطقة مكة المكرمة",
      addressCountry: "SA",
    },
    hasMap: MAPS_LINK,
    // Saturday to Thursday, 12:00–20:00. Closed Friday.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "12:00",
        closes: "20:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: TELEPHONE,
        availableLanguage: ["ar", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "reservations",
        telephone: `+${WHATSAPP_NUMBER}`,
        availableLanguage: ["ar", "en"],
      },
    ],
    // Public Google rating at the time of writing; refresh when it moves.
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1270",
      bestRating: "5",
    },
  };
}

/** Breadcrumb trail for a site page. `items` runs from the home page down. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * FAQ rich result. Only emit this when the questions are genuinely visible on
 * the page: Google treats hidden FAQ markup as a violation.
 */
export function faqSchema(questions: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions
      .filter((item) => item.q.trim() && item.a.trim())
      .map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
  };
}

/** A doctor profile, tied to the clinic. */
export function physicianSchema(doctor: {
  name: string;
  title: string;
  slug: string;
  image?: string | null;
  specialties?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    jobTitle: doctor.title,
    url: `${SITE_URL}/doctors/${doctor.slug}`,
    ...(doctor.image ? { image: `${SITE_URL}${doctor.image}` } : {}),
    ...(doctor.specialties?.length ? { medicalSpecialty: doctor.specialties } : {}),
    worksFor: { "@id": `${SITE_URL}/#clinic` },
  };
}
