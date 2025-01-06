import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "utfs.io",
      "img.freepik.com",
      "learn2pnl.s3.us-east-1.amazonaws.com",
    ],
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      "@aws-sdk/signature-v4-multi-region",
    ];
    return config;
  },
};

export default withNextVideo(nextConfig);