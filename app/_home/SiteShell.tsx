import type { ReactNode } from "react";
import { almarai } from "@/lib/fonts";
import { Providers } from "@/components/providers/Providers";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyBar } from "./StickyBar";
import { BackToTop, ScrollProgress } from "./Motion";
import { paletteVars } from "./palette";
import { WA_TOPIC_MESSAGE, WHATSAPP_NUMBER } from "./config";
import "./home.css";

/**
 * The onyx + gold chrome every public site page sits in: Lenis/GSAP providers,
 * palette tokens, fixed header, footer, WhatsApp FAB, mobile sticky bar.
 *
 * The home page (`app/page.tsx`) composes the same pieces itself so its
 * structure stays untouched; the `(site)` route group wraps its pages in this.
 */
export function SiteShell({
  children,
  bookHref = "/book-now",
}: {
  children: ReactNode;
  /** Where the sticky mobile "احجزي الآن" button points. */
  bookHref?: string;
}) {
  return (
    <Providers>
      <div
        className={`md-home relative flex-1 overflow-clip ${almarai.variable}`}
        style={{
          ...paletteVars,
          fontFamily: "var(--font-almarai), system-ui, sans-serif",
          lineHeight: 1.7,
        }}
      >
        <ScrollProgress />
        <Header />

        <main>{children}</main>

        <Footer />

        <WhatsAppFAB
          whatsappNumber={WHATSAPP_NUMBER}
          topicMessage={WA_TOPIC_MESSAGE}
        />
        <StickyBar bookHref={bookHref} />
        <BackToTop />
      </div>
    </Providers>
  );
}
