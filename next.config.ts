import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Next 16 requires every `quality` value used by <Image> to be declared
    // up front. We use 75 (default), 92 (thumbnails), and 95 (lightbox).
    qualities: [75, 92, 95],
    // Sanity already hands back a 2400px WebP (see `cdnUrl` in
    // sanity/queries.ts), so there is nothing for Next's optimiser to do to
    // it — and routing through /_next/image was failing outright on these
    // URLs. Local images are small enough that skipping it costs nothing.
    unoptimized: true,
  },
};

export default nextConfig;
