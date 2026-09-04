import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { DARK_CIRCLES } from "./content";
import { Landing } from "./_components/Landing";

/** Shortened blurb for the Twitter card; the editable copy drives the rest. */
const TWITTER_DESCRIPTION =
  "برنامج طبي متخصص في علاج الهالات والتصبّغات بأحدث التقنيات في جدة.";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(DARK_CIRCLES);
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
          url: "/dark-circles/hero.webp",
          width: 1200,
          height: 630,
          alt: "عيادات د. مها دحلان — علاج الهالات والتصبّغات",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: TWITTER_DESCRIPTION,
      images: ["/dark-circles/hero.webp"],
    },
  };
}

export default async function DarkCirclesPage() {
  const content = await getPageContent(DARK_CIRCLES);
  return <Landing content={content} />;
}
