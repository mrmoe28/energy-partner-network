import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false,
    useWasmBinary: true,
  },
};

export default nextConfig;
