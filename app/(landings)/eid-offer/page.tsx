import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { EID_OFFER } from "./content";
import { Landing } from "./_components/Landing";

export const revalidate = 300;

/** The social cards keep their own headline; only the descriptions and the
 *  page title below are editable. */
const SHARE_TITLE = "عيادة مها دحلان | عرض عيد الأضحى";
const TWITTER_DESCRIPTION =
  "خصومات ذهبية بمناسبة عيد الأضحى المبارك على خدمات التجميل في عيادة مها دحلان.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(EID_OFFER);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: SHARE_TITLE,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      siteName: "عيادات د. مها دحلان",
      images: [
        {
          url: "/eid-offer/hero.webp",
          width: 1200,
          height: 800,
          alt: "عرض عيد الأضحى — عيادة مها دحلان",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SHARE_TITLE,
      description: TWITTER_DESCRIPTION,
      images: ["/eid-offer/hero.webp"],
    },
  };
}

export default async function EidOfferPage() {
  const content = await getPageContent(EID_OFFER);
  return <Landing content={content} />;
}
