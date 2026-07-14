import type { Metadata } from "next";

import { historyMessagesFor } from "@/lib/history-i18n";
import { historyStoryMessagesFor } from "@/lib/history-story-i18n";
import {
  messagesFor,
  supportedLocales,
  type SupportedLocale,
} from "@/lib/i18n";

export const SITE_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.teuteuteu.com",
);
export const RESTORER = {
  name: "Mathieu Woroniecki",
  url: "https://github.com/mathieuworoniecki",
} as const;
export const HOME_MODIFIED_AT = "2026-07-14";
export const HISTORY_PUBLISHED_AT = "2026-07-10";
export const HISTORY_MODIFIED_AT = "2026-07-14";

export function localeHomePath(locale: SupportedLocale) {
  return `/${locale}`;
}

export function localeHistoryPath(locale: SupportedLocale) {
  return `/${locale}/history`;
}

export function languageAlternates(kind: "home" | "history") {
  const entries = supportedLocales.map((locale) => [
    locale,
    kind === "home" ? localeHomePath(locale) : localeHistoryPath(locale),
  ]);
  return Object.fromEntries([
    ...entries,
    ["x-default", kind === "home" ? "/" : "/en/history"],
  ]);
}

export function homeMetadata(
  locale: SupportedLocale,
  canonical: string,
): Metadata {
  const messages = messagesFor(locale);
  return {
    title: "teuteuteu.com",
    description: messages.instruction,
    alternates: { canonical, languages: languageAlternates("home") },
    openGraph: {
      title: "teuteuteu.com",
      description: messages.instruction,
      locale,
      type: "website",
      url: canonical,
      images: [`/api/og?lang=${encodeURIComponent(locale)}`],
    },
    twitter: {
      card: "summary_large_image",
      title: "teuteuteu.com",
      description: messages.instruction,
      images: [`/api/og?lang=${encodeURIComponent(locale)}`],
    },
  };
}

export function historyMetadata(locale: SupportedLocale): Metadata {
  const story = historyStoryMessagesFor(locale);
  const messages = historyMessagesFor(locale);
  const canonical = localeHistoryPath(locale);
  const image = `/api/og?lang=${encodeURIComponent(locale)}&page=history`;
  return {
    title: messages.title,
    description: messages.original,
    alternates: { canonical, languages: languageAlternates("history") },
    openGraph: {
      title: messages.title,
      description: messages.original,
      locale,
      type: "article",
      url: canonical,
      publishedTime: HISTORY_PUBLISHED_AT,
      modifiedTime: HISTORY_MODIFIED_AT,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.title,
      description: story.intro,
      images: [image],
    },
  };
}
