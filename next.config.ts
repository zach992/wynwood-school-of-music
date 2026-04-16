import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/summercamp",
        destination: "/musicperformancecamp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
