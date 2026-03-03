import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "iinjuktvgivhsfxwnvij.supabase.co",
      },
      {
        protocol: "https",
        hostname: "iinjuktvgivhsfxwnvij.storage.supabase.co",
      },
    ],
  },
};

export default nextConfig;
