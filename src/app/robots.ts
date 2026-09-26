import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://themorshedalam.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api"],
      },
      // Search Engines
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot"],
        allow: "/",
        disallow: ["/api"],
      },
      // AI Answer Engines & LLM Web Search Agents (AEO)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Applebot-Extended",
          "cohere-ai",
          "Omgilibot",
          "FacebookBot",
        ],
        allow: "/",
        disallow: ["/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
