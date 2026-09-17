import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { getSellableItems } from "@/lib/orders";
import { CheckoutProvider } from "@/components/checkout";
import { KOREAN_SPICULES } from "./content";
import { Landing } from "./_components/Landing";

export const revalidate = 300;

/** The share card keeps its own headline; only the descriptions are editable. */
const OG_TITLE = "السبيكولز الكورية — ميكرونيدلينغ طبيعي بدون جهاز";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(KOREAN_SPICULES);
  return {
    // Both mahadahlan.com and the ads host serve this page; the canonical
    // keeps the main domain as the one Google indexes.
    alternates: { canonical: "/korean-spicules" },
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: OG_TITLE,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      images: [{ url: "/korean-spicules/hero.webp", width: 1152, height: 1536 }],
    },
  };
}

export default async function KoreanSpiculesPage() {
  const [content, items] = await Promise.all([
    getPageContent(KOREAN_SPICULES),
    getSellableItems(KOREAN_SPICULES.slug),
  ]);
  return (
    <CheckoutProvider
      items={items}
      page={{ slug: KOREAN_SPICULES.slug, title: KOREAN_SPICULES.title, path: KOREAN_SPICULES.path }}
      whatsappTopic="عندي استفسار بخصوص جلسة السبيكولز الكورية"
    >
      <Landing content={content} />
    </CheckoutProvider>
  );
}
