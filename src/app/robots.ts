import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Claude-Web",
          "ClaudeBot",
          "Google-Extended",
          "CCBot",
          "anthropic-ai",
          "cohere-ai",
          "PerplexityBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://aimaged.com/sitemap.xml",
  };
}
