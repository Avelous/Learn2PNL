import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    domains: [
      "utfs.io",
      "img.freepik.com",
      "learn2pnl.s3.us-east-1.amazonaws.com",
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals = [
      ...(config.externals || []),
      "@aws-sdk/signature-v4-multi-region",
    ];
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }``
    return config;
  },
};

export default withNextVideo(nextConfig);
