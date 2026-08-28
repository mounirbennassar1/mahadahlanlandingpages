import type { Metadata } from "next";
import { HomePage } from "@/app/_home/HomePage";

const TITLE =
  "Dr. Maha Dahlan Clinics | Dermatology, Aesthetics & Laser in Jeddah";
const DESCRIPTION =
  "Dr. Maha Dahlan Clinics in Jeddah: Botox and fillers, neck lift, Korean glass skin, pigmentation and acne treatment, body sculpting and hair loss treatment. Led by consultant dermatologists, with an all-female team and 13+ years of experience.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/en", languages: { ar: "/", en: "/en" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dr. Maha Dahlan Clinics",
    title: TITLE,
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
    title: TITLE,
    description:
      "Dermatology, aesthetics and laser in Jeddah. Skin, hair, Botox and fillers, body sculpting and more.",
    images: ["/logo.webp"],
  },
};

export default function HomeEnglish() {
  return <HomePage locale="en" />;
}
