import type { Metadata } from "next";
import { HomePage } from "@/app/_home/HomePage";
import { getHomeSeo } from "@/lib/pages/home";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo("en");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/en", languages: { ar: "/", en: "/en" } },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Dr. Maha Dahlan Clinics",
      title: seo.title,
      description:
        "A refined medical and aesthetic experience in Jeddah. Book your consultation today.",
      images: [
        {
          url: "/logo.webp",
          width: 800,
          height: 800,
          alt: "Dr. Maha Dahlan Clinics logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description:
        "Dermatology, aesthetics and laser in Jeddah. Skin, hair, Botox and fillers, body sculpting and more.",
      images: ["/logo.webp"],
    },
  };
}

export default function HomeEnglish() {
  return <HomePage locale="en" />;
}
