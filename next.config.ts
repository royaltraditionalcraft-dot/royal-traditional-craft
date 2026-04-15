import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  allowedDevOrigins: ["192.168.31.153"],
  serverExternalPackages: ["@prisma/client", "@neondatabase/serverless"],
  experimental: {},
};

export default nextConfig;
