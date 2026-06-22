const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  experimental: {
    webpackBuildWorker: false,
    useWasmBinary: true,
  },
};

export default nextConfig;
