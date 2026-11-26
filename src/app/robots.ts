import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Bingbot"
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/admin/"]
      }
    ],
    sitemap: "https://maisoncalve.fr/sitemap.xml"
  };
}
