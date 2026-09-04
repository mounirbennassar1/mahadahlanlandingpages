import type { Metadata } from "next";
import { HomePage } from "./_home/HomePage";
import { getHomeSeo } from "@/lib/pages/home";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo("ar");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/", languages: { ar: "/", en: "/en" } },
  };
}

export default function Home() {
  return <HomePage locale="ar" />;
}
