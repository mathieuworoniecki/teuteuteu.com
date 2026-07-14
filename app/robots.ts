import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: ["/", "/api/og"],
        disallow: ["/api/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/api/og"],
        disallow: ["/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", SITE_ORIGIN).toString(),
    host: SITE_ORIGIN.origin,
  };
}
