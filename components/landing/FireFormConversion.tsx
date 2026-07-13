"use client";

import { useEffect } from "react";
import { fireConversion } from "@/lib/gtag";

/**
 * Drop into a "thank-you" page (for flows that redirect after submit instead
 * of swapping to an in-place success view) to fire the Google Ads FORM
 * conversion exactly once on mount. Renders nothing.
 */
export function FireFormConversion() {
  useEffect(() => {
    fireConversion("form");
  }, []);
  return null;
}
