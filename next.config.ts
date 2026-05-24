import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const BACKEND_URL = process.env.API_URL ?? "https://cafe-finder-be.onrender.com/api";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/client",
        destination: "/vi/profile",
        permanent: false,
      },
      {
        source: "/:locale/client",
        destination: "/:locale/profile",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  allowedDevOrigins: [
    "192.168.2.89:3000, 192.168.1.186:3000, 192.168.2.25:3000, 172.16.0.135:3000",
  ],
};

export default withNextIntl(nextConfig);
