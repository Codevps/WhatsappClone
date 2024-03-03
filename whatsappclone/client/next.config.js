/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 1195204933,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "c0a43e44770f409290b15b1316e28c01",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
