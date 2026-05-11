"use client";

import { LenisProvider } from "./LenisProvider";
import { GsapProvider } from "./GsapProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GsapProvider>
      <LenisProvider>{children}</LenisProvider>
    </GsapProvider>
  );
}
