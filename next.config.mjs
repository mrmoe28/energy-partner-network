const nextConfig = {
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
