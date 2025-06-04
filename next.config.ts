import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const applyPrismaPlugin = require("@prisma/nextjs-monorepo-workaround-plugin");

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // ✅ 함수로 호출
      applyPrismaPlugin(config);
    }
    return config;
  },
  output: "standalone",
};

export default nextConfig;
