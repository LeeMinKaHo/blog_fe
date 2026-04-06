import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/static/images/**",
      },
      {
        protocol: "https",
        hostname: "blog-be-production-76e8.up.railway.app",
        pathname: "/static/images/**",
      },
    ],
  },
};

export default nextConfig;

