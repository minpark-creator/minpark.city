import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Next 16 requires every `quality` value used by <Image> to be declared
    // up front. We use 75 (default), 92 (thumbnails), and 95 (lightbox).
    // Listing them here removes the dev warnings that flood the console.
    qualities: [75, 92, 95],
  },
};

export default nextConfig;
