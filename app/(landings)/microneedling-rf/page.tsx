import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { MICRONEEDLING_RF } from "./content";
import { Landing } from "./_components/Landing";

/** Shorter headline for social cards; the editable copy drives the rest. */
const OG_TITLE = "علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(MICRONEEDLING_RF);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: OG_TITLE,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
    },
  };
}

export default async function MicroneedlingRfPage() {
  const content = await getPageContent(MICRONEEDLING_RF);
  return <Landing content={content} />;
}
