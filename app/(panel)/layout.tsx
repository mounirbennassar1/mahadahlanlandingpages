import { Plus_Jakarta_Sans, Inter, Fraunces } from "next/font/google";
import "./panel.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["italic"],
  display: "swap",
});

export const metadata = {
  title: "MD Clinics — Lead Management",
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Forces LTR + Latin fonts for the admin panel, inside the otherwise
  // RTL/Arabic root layout. All admin styles cascade from `.panel-root`.
  return (
    <div
      dir="ltr"
      lang="en"
      className={`panel-root ${jakarta.variable} ${inter.variable} ${fraunces.variable}`}
    >
      {children}
    </div>
  );
}
