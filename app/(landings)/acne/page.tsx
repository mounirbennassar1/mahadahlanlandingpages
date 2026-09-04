import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { ACNE } from "./content";
import { Landing } from "./_components/Landing";

/** Shortened headline + blurb for the Twitter card. */
const TWITTER_TITLE = "عيادات د. مها دحلان | علاج حب الشباب في جدة";
const TWITTER_DESCRIPTION =
  "استعد ثقتك ببشرتك الصافية مع أحدث التقنيات الطبية العالمية في عيادات د. مها دحلان بجدة.";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(ACNE);
  return {
    title: {
      default: seo.title,
      template: "%s | عيادات د. مها دحلان",
    },
    description: seo.description,
    keywords: [
      "علاج حب الشباب جدة",
      "إزالة آثار حب الشباب",
      "د. مها دحلان",
      "عيادات جلدية جدة",
      "أفضل دكتورة جلدية جدة",
      "علاج حبوب الوجه",
      "ليزر حب الشباب",
      "جلدية وتجميل وليزر جدة",
      "بشرة صافية",
      "مجمع عيادات د. مها دحلان الطبي",
    ],
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      siteName: "عيادات د. مها دحلان",
      url: "https://acne.mahadahlan.com",
      images: [
        {
          url: "/acne/logo.avif",
          width: 1200,
          height: 630,
          alt: "عيادات د. مها دحلان — علاج حب الشباب",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TWITTER_TITLE,
      description: TWITTER_DESCRIPTION,
      images: ["/acne/logo.avif"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://acne.mahadahlan.com",
    },
  };
}

export default async function AcnePage() {
  const content = await getPageContent(ACNE);
  return <Landing content={content} />;
}
