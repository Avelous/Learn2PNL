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
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      "@aws-sdk/signature-v4-multi-region",
    ];
    return config;
  },
};

export default nextConfig;
