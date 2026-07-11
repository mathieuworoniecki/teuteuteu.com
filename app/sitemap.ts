import type { MetadataRoute } from "next";

import { supportedLocales } from "@/lib/i18n";
import { languageAlternates, localeHistoryPath, localeHomePath, SITE_ORIGIN } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-11T00:00:00Z");
  const entry = (path: string, languages: Record<string, string>, priority: number): MetadataRoute.Sitemap[number] => ({
    url: new URL(path, SITE_ORIGIN).toString(),
    lastModified: updated,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languages).map(([locale, alternate]) => [locale, new URL(alternate, SITE_ORIGIN).toString()]),
      ),
    },
  });

  return [
    entry("/", languageAlternates("home"), 1),
    ...supportedLocales.flatMap((locale) => [
      entry(localeHomePath(locale), languageAlternates("home"), 0.9),
      entry(localeHistoryPath(locale), languageAlternates("history"), 0.6),
    ]),
  ];
}
