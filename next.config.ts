import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages (generates ./out directory)
  output: "export",
  // Add trailing slash to all pages (ensures correct routing on CDN)
  trailingSlash: true,
  // Disable image optimization (Cloudflare Pages serves static files)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
