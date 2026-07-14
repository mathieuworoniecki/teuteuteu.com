import type { MetadataRoute } from "next";

import { supportedLocales } from "@/lib/i18n";
import {
  HISTORY_MODIFIED_AT,
  HOME_MODIFIED_AT,
  languageAlternates,
  localeHistoryPath,
  localeHomePath,
  SITE_ORIGIN,
} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    languages: Record<string, string>,
    priority: number,
    lastModified: string,
  ): MetadataRoute.Sitemap[number] => ({
    url: new URL(path, SITE_ORIGIN).toString(),
    lastModified: new Date(`${lastModified}T00:00:00Z`),
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languages).map(([locale, alternate]) => [
          locale,
          new URL(alternate, SITE_ORIGIN).toString(),
        ]),
      ),
    },
  });

  return [
    entry("/", languageAlternates("home"), 1, HOME_MODIFIED_AT),
    ...supportedLocales.flatMap((locale) => [
      entry(
        localeHomePath(locale),
        languageAlternates("home"),
        0.9,
        HOME_MODIFIED_AT,
      ),
      entry(
        localeHistoryPath(locale),
        languageAlternates("history"),
        0.7,
        HISTORY_MODIFIED_AT,
      ),
    ]),
  ];
}
