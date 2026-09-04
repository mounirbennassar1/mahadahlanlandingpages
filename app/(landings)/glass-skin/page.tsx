import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { GLASS_SKIN } from "./content";
import { Landing } from "./_components/Landing";

/** Headline used on social cards; the editable copy drives the rest. */
const OG_TITLE = "الجلاس سكين الكوري، بشرة زجاجية تتوهّج من الداخل";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(GLASS_SKIN);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: OG_TITLE,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      images: [{ url: "/glass-skin/poster.webp", width: 1920, height: 1088 }],
    },
  };
}

export default async function GlassSkinPage() {
  const content = await getPageContent(GLASS_SKIN);
  return <Landing content={content} />;
}
