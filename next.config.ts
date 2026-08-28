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
    ],
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
