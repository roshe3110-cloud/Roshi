import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "tetaeagqedpbxevwmghi.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache optimized images for 30 days
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 80, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: "/:path*.(mp3|webm|mp4|webp|png|jpg|jpeg|avif|woff2|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/shop",
        destination: "/collection",
        permanent: true,
      },
      {
        source: "/shop/:path*",
        destination: "/collection",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
