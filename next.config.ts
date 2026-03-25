import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Next.js moved `experimental.serverComponentsExternalPackages` -> `serverExternalPackages`
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
