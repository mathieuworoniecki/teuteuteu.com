import type { Metadata } from "next";

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
    },
  };
}

export function historyMetadata(locale: SupportedLocale): Metadata {
  const messages = historyStoryMessagesFor(locale);
  const canonical = localeHistoryPath(locale);
  return {
    title: `${messages.title} — teuteuteu.com`,
    description: messages.intro,
    alternates: { canonical, languages: languageAlternates("history") },
    openGraph: {
      title: messages.title,
      description: messages.intro,
      locale,
      type: "article",
      url: canonical,
      images: [`/api/og?lang=${encodeURIComponent(locale)}`],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.title,
      description: messages.intro,
    },
  };
}
