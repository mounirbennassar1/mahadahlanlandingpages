import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { KOREAN_SPICULES } from "./content";
import { Landing } from "./_components/Landing";

export const revalidate = 300;

/** The share card keeps its own headline; only the descriptions are editable. */
const OG_TITLE = "السبيكولز الكورية — ميكرونيدلينغ طبيعي بدون جهاز";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(KOREAN_SPICULES);
  return {
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
  const content = await getPageContent(KOREAN_SPICULES);
  return <Landing content={content} />;
}
