import type { NextConfig } from "next";
import PrismaPlugin from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  optimizePackageImports: ["@prisma/client"],
  output: "standalone", // ✅ Prisma 바이너리 포함을 보장
};

export default nextConfig;
