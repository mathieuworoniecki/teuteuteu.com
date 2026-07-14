import type { HistoryEvent } from "@/lib/history-timeline";

export type HistoryChapterId =
  "birth" | "viral" | "silence" | "afterlives" | "restoration";

export type HistoryChapter = {
  id: HistoryChapterId;
  period: string;
  eventIds: readonly HistoryEvent["id"][];
  scene: HistoryChapterId;
};

export const HISTORY_CHAPTERS: readonly HistoryChapter[] = [
  {
    id: "birth",
    period: "2005",
    scene: "birth",
    eventIds: [
      "2005-free-account",
      "2005-mobile-ecosystem",
      "2005-swf",
      "2005-frog-swf",
      "2005-html",
      "2005-first-capture",
    ],
  },
  {
    id: "viral",
    period: "2006–2008",
    scene: "viral",
    eventIds: [
      "2006-commercial-removal",
      "2006-viral-circulation",
      "2008-games",
    ],
  },
  {
    id: "silence",
    period: "2010–2014",
    scene: "silence",
    eventIds: ["2010-parking", "2011-tomware"],
  },
  {
    id: "afterlives",
    period: "2020–2023",
    scene: "afterlives",
    eventIds: ["2020-registration", "2021-blog", "2023-whois"],
  },
  {
    id: "restoration",
    period: "2026",
    scene: "restoration",
    eventIds: ["2026-registration", "2026-restoration"],
  },
] as const;
