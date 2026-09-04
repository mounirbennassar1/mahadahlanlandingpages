"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, DICT, LANG_META, type Dict, type Locale } from "./dictionary";

type LocaleValue = { locale: Locale; dict: Dict };

const LocaleContext = createContext<LocaleValue>({
  locale: DEFAULT_LOCALE,
  dict: DICT[DEFAULT_LOCALE],
});

/** Sets the locale for every `_home` client component underneath. Without a
 *  provider everything falls back to Arabic, so existing pages are unaffected.
 *
 *  `dict` carries the copy after the dashboard overrides have been merged in
 *  (see `lib/pages/home.ts`); omit it to render the copy shipped in code. */
export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict?: Dict;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, dict: dict ?? DICT[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): {
  locale: Locale;
  t: Dict;
  dir: "rtl" | "ltr";
  isRtl: boolean;
} {
  const { locale, dict } = useContext(LocaleContext);
  const dir = LANG_META[locale].dir;
  return { locale, t: dict, dir, isRtl: dir === "rtl" };
}
