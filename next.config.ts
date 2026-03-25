import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    serverExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
