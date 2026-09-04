import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { BOTOX } from "./content";
import { Landing } from "./_components/Landing";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(BOTOX);
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
          url: "/botox/hero_section_botox.webp",
          width: 1200,
          height: 630,
          alt: "عيادات د. مها دحلان — البوتوكس والفيلر",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description:
        "بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين في جدة.",
      images: ["/botox/hero_section_botox.webp"],
    },
  };
}

export default async function BotoxPage() {
  const content = await getPageContent(BOTOX);
  return <Landing content={content} />;
}
