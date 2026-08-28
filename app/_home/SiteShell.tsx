import type { ReactNode } from "react";
import { almarai } from "@/lib/fonts";
import { Providers } from "@/components/providers/Providers";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyBar } from "./StickyBar";
import { BackToTop, ScrollProgress } from "./Motion";
import { paletteVars } from "./palette";
import { WHATSAPP_NUMBER } from "./config";
import { LANG_META, type Locale } from "./i18n/dictionary";
import { LocaleProvider } from "./i18n/LocaleProvider";
import "./home.css";

/** Almarai is Arabic-only; the English tree defines `--font-en` (see `app/en/layout.tsx`). */
const FONT_STACK: Record<Locale, string> = {
  ar: "var(--font-almarai), system-ui, sans-serif",
  en: "var(--font-en), var(--font-almarai), system-ui, sans-serif",
};

/**
 * The onyx + gold chrome every public site page sits in: Lenis/GSAP providers,
 * palette tokens, fixed header, footer, WhatsApp FAB, mobile sticky bar.
 *
 * The home page (`HomePage.tsx`) and the `(site)` route group both wrap their
 * content in this; `locale` picks the dictionary every chrome piece reads.
 */
export function SiteShell({
  children,
  bookHref = "/book-now",
  locale = "ar",
}: {
  children: ReactNode;
  /** Where the sticky mobile "احجزي الآن" button points. */
  bookHref?: string;
  locale?: Locale;
}) {
  return (
    <LocaleProvider locale={locale}>
      <Providers>
        <div
          className={`md-home relative flex-1 overflow-clip ${almarai.variable}`}
          style={{
            ...paletteVars,
            fontFamily: FONT_STACK[locale],
            lineHeight: 1.7,
          }}
        >
          <ScrollProgress />
          <Header />

          <main>{children}</main>

          <Footer locale={locale} />

          <WhatsAppFAB
            whatsappNumber={WHATSAPP_NUMBER}
            topicMessage={LANG_META[locale].waMessage}
          />
          <StickyBar bookHref={bookHref} />
          <BackToTop />
        </div>
      </Providers>
    </LocaleProvider>
  );
}
