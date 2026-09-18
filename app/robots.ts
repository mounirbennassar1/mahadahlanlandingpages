import type { MetadataRoute } from "next";

/**
 * The ads host. Crawling stays allowed (Google's AdsBot checks every landing),
 * there is no sitemap here on purpose, and every landing's canonical already
 * points at the same path on www.mahadahlan.com, so search signals consolidate
 * on the website. `NOINDEX_ADS_HOST=true` (see proxy.ts) adds a noindex header
 * on top once the website is indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
  };
}
