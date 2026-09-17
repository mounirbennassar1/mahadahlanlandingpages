import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { getSellableItems } from "@/lib/orders";
import { CheckoutProvider } from "@/components/checkout";
import { DARK_CIRCLES } from "./content";
import { Landing } from "./_components/Landing";

/** Shortened blurb for the Twitter card; the editable copy drives the rest. */
const TWITTER_DESCRIPTION =
  "برنامج طبي متخصص في علاج الهالات والتصبّغات بأحدث التقنيات في جدة.";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(DARK_CIRCLES);
  return {
    // Both mahadahlan.com and the ads host serve this page; the canonical
    // keeps the main domain as the one Google indexes.
    alternates: { canonical: "/dark-circles" },
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
  const [content, items] = await Promise.all([getPageContent(DARK_CIRCLES), getSellableItems(DARK_CIRCLES.slug)]);
  return (
    <CheckoutProvider
      items={items}
      page={{ slug: DARK_CIRCLES.slug, title: DARK_CIRCLES.title, path: DARK_CIRCLES.path }}
      whatsappTopic="عندي استفسار عن علاج الهالات والتصبّغات"
    >
      <Landing content={content} />
    </CheckoutProvider>
  );
}
