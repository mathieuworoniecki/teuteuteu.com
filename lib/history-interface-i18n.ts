import type { SupportedLocale } from "@/lib/i18n";
import { historyInterfaceTranslations0 } from "@/lib/history-interface-i18n-0";
import { historyInterfaceTranslations1 } from "@/lib/history-interface-i18n-1";

export type HistoryInterfaceMessages = {
  origins: string;
  viral: string;
  parking: string;
  blog: string;
  restoration: string;
  unknown: string;
  openAll: string;
  closeAll: string;
  copyLink: string;
  linkCopied: string;
  known: string;
  proves: string;
  doesNotProve: string;
  technicalEvidence: string;
  sources: string;
  confirmed: string;
  lead: string;
  context: string;
  periods: string;
  showDetails: string;
  hideDetails: string;
};

const translations = {
  ...historyInterfaceTranslations0,
  ...historyInterfaceTranslations1,
};

export function historyInterfaceMessagesFor(
  locale: SupportedLocale,
): HistoryInterfaceMessages {
  const values = translations[locale];
  if (!values)
    throw new Error(`Missing history interface translation for ${locale}`);
  const [
    origins,
    viral,
    parking,
    blog,
    restoration,
    unknown,
    openAll,
    closeAll,
    copyLink,
    linkCopied,
    known,
    proves,
    doesNotProve,
    technicalEvidence,
    sources,
    confirmed,
    lead,
    context,
    periods,
    showDetails,
    hideDetails,
  ] = values;
  return {
    origins,
    viral,
    parking,
    blog,
    restoration,
    unknown,
    openAll,
    closeAll,
    copyLink,
    linkCopied,
    known,
    proves,
    doesNotProve,
    technicalEvidence,
    sources,
    confirmed,
    lead,
    context,
    periods,
    showDetails,
    hideDetails,
  };
}
