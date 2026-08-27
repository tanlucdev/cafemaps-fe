import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const DEFAULT_BACKEND_URL = "https://cafe-finder-be.onrender.com/api";
const API_URL = process.env.API_URL ?? DEFAULT_BACKEND_URL;

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
      {
        source: "/:locale/search",
        destination: "/:locale",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(ico|png|jpg|jpeg|webp|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  webpack(config, { dev, webpack }) {
    if (!dev) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@\/apis\/cafes\/dev-fallback$/,
          path.join(process.cwd(), "src/apis/cafes/prod-fallback.ts"),
        ),
      );
    }
    return config;
  },
  images: {
    qualities: [48, 58, 75, 85, 88, 90],
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
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  logging: {
    browserToTerminal: false,
  },
  allowedDevOrigins: [
    "192.168.2.89:3000",
    "192.168.1.186:3000",
    "192.168.2.25:3000",
    "172.16.0.135:3000",
    "192.168.2.191:3000",
    "192.168.10.239",
    "192.168.1.125",
    "192.168.1.90",
    "192.168.2.225",
  ],
};

export default withNextIntl(nextConfig);
