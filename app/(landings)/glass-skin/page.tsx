import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/get";
import { getSellableItems } from "@/lib/orders";
import { CheckoutProvider } from "@/components/checkout";
import { GLASS_SKIN } from "./content";
import { Landing } from "./_components/Landing";

/** Headline used on social cards; the editable copy drives the rest. */
const OG_TITLE = "الجلاس سكين الكوري، بشرة زجاجية تتوهّج من الداخل";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(GLASS_SKIN);
  return {
    // Both mahadahlan.com and the ads host serve this page; the canonical
    // keeps the main domain as the one Google indexes.
    alternates: { canonical: "/glass-skin" },
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
  const [content, items] = await Promise.all([getPageContent(GLASS_SKIN), getSellableItems(GLASS_SKIN.slug)]);
  return (
    <CheckoutProvider
      items={items}
      page={{ slug: GLASS_SKIN.slug, title: GLASS_SKIN.title, path: GLASS_SKIN.path }}
      whatsappTopic="عندي استفسار بخصوص الجلاس سكين الكوري"
    >
      <Landing content={content} />
    </CheckoutProvider>
  );
}
