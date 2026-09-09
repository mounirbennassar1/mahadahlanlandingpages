import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 900, 1080, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384, 512, 768],
    // optimized derivatives are content-addressed, so they can be cached hard
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Dashboard image uploads (Vercel Blob) + images kept on the old site / CDN.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "mahadahlan.com",
      },
      {
        protocol: "https",
        hostname: "www.mahadahlan.com",
      },
    ],
  },

  async redirects() {
    return [
      // ── www → apex ───────────────────────────────────────────────────────
      // The canonical host is the bare domain: every default in the code, the
      // sitemap and the stored UTM links use it. Vercel can also do this at the
      // domain level; keeping it here means the rule holds wherever we deploy.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mahadahlan.com" }],
        destination: "https://mahadahlan.com/:path*",
        permanent: true,
      },

      // ── URLs of the previous PHP site ────────────────────────────────────
      // mahadahlan.com used to serve a different site. These paths are linked
      // from Google, ads and printed material, so they must not 404 after the
      // DNS cutover.
      { source: "/bookNow", destination: "/book-now", permanent: true },
      { source: "/offersform", destination: "/offers", permanent: true },
      { source: "/cosmetics-services", destination: "/services", permanent: true },
      { source: "/hair-services", destination: "/services", permanent: true },
      { source: "/laser-services", destination: "/services", permanent: true },
      // "قيّم تجربتك" — the new site has no rating page, so send visitors to the
      // reviews section on the home page. Swap this for the clinic's Google
      // review link once we have the place URL (an Arabic Maps search query
      // cannot go in a Location header: it is rejected as an invalid header).
      { source: "/rate-us", destination: "/#reviews", permanent: false },
    ];
  },

  // Rewrite barrel imports of these packages to per-module paths so a page
  // only ships the icons/components it actually renders.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "react-icons"],
  },

  async headers() {
    return [
      {
        // hero videos, posters and logos in public/ — these are replaced by
        // filename when the art changes, so a long TTL is safe and saves a
        // revalidation round-trip on every repeat visit
        source: "/:path*.:ext(mp4|webm|webp|avif|jpg|jpeg|png|svg|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
