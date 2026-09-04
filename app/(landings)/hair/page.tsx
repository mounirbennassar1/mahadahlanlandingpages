import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { HAIR } from "./content";
import { Landing } from "./_components/Landing";

export const revalidate = 300;

/** The Twitter card keeps its own wording; everything else comes from content. */
const TWITTER_DESCRIPTION =
  "حلول طبية متكاملة لعلاج تساقط الشعر وزراعته بأحدث التقنيات في جدة.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(HAIR);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      siteName: "عيادات د. مها دحلان",
      images: [
        {
          url: "/hair/logo.avif",
          width: 1200,
          height: 630,
          alt: "عيادة د. مها دحلان — معالجة تساقط الشعر",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: TWITTER_DESCRIPTION,
      images: ["/hair/logo.avif"],
    },
  };
}

export default async function HairPage() {
  const content = await getPageContent(HAIR);
  return <Landing content={content} />;
}
