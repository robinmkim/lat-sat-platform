const applyPrismaPlugin =
  require("@prisma/nextjs-monorepo-workaround-plugin").default;

const nextConfig: import("next").NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      applyPrismaPlugin(config); // ✅ 함수 호출
    }
    return config;
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
