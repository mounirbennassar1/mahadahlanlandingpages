import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { getSellableItems } from "@/lib/orders";
import { CheckoutProvider } from "@/components/checkout";
import { BOTOX } from "./content";
import { Landing } from "./_components/Landing";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(BOTOX);
  return {
    // Both mahadahlan.com and the ads host serve this page; the canonical
    // keeps the main domain as the one Google indexes.
    alternates: { canonical: "/botox" },
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
  const [content, items] = await Promise.all([getPageContent(BOTOX), getSellableItems(BOTOX.slug)]);
  return (
    <CheckoutProvider
      items={items}
      page={{ slug: BOTOX.slug, title: BOTOX.title, path: BOTOX.path }}
      whatsappTopic="عندي استفسار بخصوص البوتوكس والفيلر"
    >
      <Landing content={content} />
    </CheckoutProvider>
  );
}
