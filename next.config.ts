import type { NextConfig } from "next";
import path from "path";

/**
 * Static HTML export for CDN / file hosting until a VPS is available.
 * Set SITE_STATIC_EXPORT=0 to build a Node server again (`next start`).
 */
const staticExport = process.env.SITE_STATIC_EXPORT !== "0";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  ...(staticExport
    ? {
      output: "export" as const,
      /** Cleaner paths on static hosts (`/guides/` → `guides/index.html`). */
      trailingSlash: true,
    }
    : {}),
  images: {
    unoptimized: staticExport,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      { protocol: "http", hostname: "192.168.1.12", port: "3000", pathname: "/**" },
      { protocol: "https", hostname: "192.168.1.12", port: "3000", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/guides/kultury/:crop/view",
        destination: "/guides/view?culture=:crop",
        permanent: true,
      },
      {
        source: "/guides/kultury/:crop",
        destination: "/guides/?culture=:crop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
