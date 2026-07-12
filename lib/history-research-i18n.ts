import type { SupportedLocale } from "@/lib/i18n";
import { historyResearchTranslations0 } from "@/lib/history-research-i18n-0";
import { historyResearchTranslations1 } from "@/lib/history-research-i18n-1";

export type HistoryResearchMessages = {
  timeline: string;
  confirmed: string;
  contemporary: string;
  unknown: string;
  circulation: string;
  parking: string;
  blog: string;
  unresolved: string;
};

const translations = {
  ...historyResearchTranslations0,
  ...historyResearchTranslations1,
};

export function historyResearchMessagesFor(
  locale: SupportedLocale,
): HistoryResearchMessages {
  const values = translations[locale];
  if (!values)
    throw new Error(`Missing history research translation for ${locale}`);
  const [
    timeline,
    confirmed,
    contemporary,
    unknown,
    circulation,
    parking,
    blog,
    unresolved,
  ] = values;
  return {
    timeline,
    confirmed,
    contemporary,
    unknown,
    circulation,
    parking,
    blog,
    unresolved,
  };
}
