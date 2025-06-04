import type { NextConfig } from "next";

// ✅ CommonJS 모듈은 require 방식으로 import

const PrismaPlugin = require("@prisma/nextjs-monorepo-workaround-plugin");

const nextConfig: NextConfig = {
  eslint: {
    // eslint 에러가 있어도 빌드 진행
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  // ✅ Prisma 바이너리가 포함되도록 설정
  output: "standalone",
};

export default nextConfig;
