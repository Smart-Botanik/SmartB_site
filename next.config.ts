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
    ],
  },
};

export default nextConfig;
