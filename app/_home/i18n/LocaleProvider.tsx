"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, DICT, LANG_META, type Dict, type Locale } from "./dictionary";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Sets the locale for every `_home` client component underneath. Without a
 *  provider everything falls back to Arabic, so existing pages are unaffected. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): {
  locale: Locale;
  t: Dict;
  dir: "rtl" | "ltr";
  isRtl: boolean;
} {
  const locale = useContext(LocaleContext);
  const dir = LANG_META[locale].dir;
  return { locale, t: DICT[locale], dir, isRtl: dir === "rtl" };
}
