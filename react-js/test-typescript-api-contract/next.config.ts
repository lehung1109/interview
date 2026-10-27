import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.NEXT_EXERCISE_DISTDIR ?? ".next",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
