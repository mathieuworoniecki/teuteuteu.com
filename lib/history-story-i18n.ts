import type { HistoryChapterId } from "@/lib/history-chapters";
import { historyStoryTranslations0 } from "@/lib/history-story-i18n-0";
import { historyStoryTranslations1 } from "@/lib/history-story-i18n-1";
import type { SupportedLocale } from "@/lib/i18n";

export type HistoryChapterCopy = {
  title: string;
  paragraphs: readonly [string, string];
  fact: string;
};

export type HistoryStoryMessages = {
  title: string;
  intro: string;
  duration: string;
  chapter: string;
  shortVersion: string;
  examineEvidence: string;
  evidenceFiles: string;
  directSources: string;
  chapters: Record<HistoryChapterId, HistoryChapterCopy>;
  mysteryTitle: string;
  mysteryBody: string;
  strongestLead: string;
  remainsUnknown: string;
};

const translations = {
  ...historyStoryTranslations0,
  ...historyStoryTranslations1,
};

export function historyStoryMessagesFor(
  locale: SupportedLocale,
): HistoryStoryMessages {
  const values = translations[locale];
  if (!values || values.length !== 32)
    throw new Error(`Missing history story translation for ${locale}`);
  const chapter = (offset: number): HistoryChapterCopy => ({
    title: values[offset],
    paragraphs: [values[offset + 1], values[offset + 2]],
    fact: values[offset + 3],
  });
  return {
    title: values[0],
    intro: values[1],
    duration: values[2],
    chapter: values[3],
    shortVersion: values[4],
    examineEvidence: values[5],
    evidenceFiles: values[6],
    directSources: values[7],
    chapters: {
      birth: chapter(8),
      viral: chapter(12),
      silence: chapter(16),
      afterlives: chapter(20),
      restoration: chapter(24),
    },
    mysteryTitle: values[28],
    mysteryBody: values[29],
    strongestLead: values[30],
    remainsUnknown: values[31],
  };
}
