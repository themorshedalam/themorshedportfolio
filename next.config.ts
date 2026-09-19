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
  allowedDevOrigins: [
    "preview-chat-38d3203b-0833-47a2-966e-c5ca8a173735.space-z.ai",
    "*.space-z.ai",
  ],
};

export default nextConfig;
