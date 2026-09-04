import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { STRETCHMARKS } from "./content";
import { Landing } from "./_components/Landing";

export const revalidate = 300;

/** Search keywords and the Twitter card stay in code; only the titles and
 *  descriptions below are editable. */
const KEYWORDS = [
  "علاج التشققات",
  "علامات التمدد",
  "د. مها دحلان",
  "عيادة جلدية جدة",
  "فيلر الكولاجين",
  "فيلر الكالسيوم",
  "تشققات الحمل",
  "علاج البشرة جدة",
];

const TWITTER_TITLE = "د. مها دحلان | علاج التشققات وعلامات التمدد";
const TWITTER_DESCRIPTION =
  "عيادة متخصصة في علاج تشققات الجلد وعلامات التمدد بأحدث التقنيات في جدة.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(STRETCHMARKS);
  return {
    title: seo.title,
    description: seo.description,
    keywords: KEYWORDS,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      siteName: "عيادات د. مها دحلان",
      images: [
        {
          url: "/stretchmarks/logo.webp",
          width: 1200,
          height: 630,
          alt: "عيادات د. مها دحلان — علاج التشققات وعلامات التمدد",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TWITTER_TITLE,
      images: ["/stretchmarks/logo.webp"],
      description: TWITTER_DESCRIPTION,
    },
  };
}

export default async function StretchmarksPage() {
  const content = await getPageContent(STRETCHMARKS);
  return <Landing content={content} />;
}
