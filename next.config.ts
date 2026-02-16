import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  },
};

export default nextConfig;
