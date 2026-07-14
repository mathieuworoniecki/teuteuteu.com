import {
  EARLIEST_DOCUMENTED_DATE,
  HISTORY_EVENTS,
  HISTORY_SOURCES,
  RESTORATION_DATE,
} from "@/lib/history-timeline";
import { HISTORY_MODIFIED_AT, SITE_ORIGIN } from "@/lib/seo";

export function historySourceLedger() {
  return {
    name: "teuteuteu.com public history source ledger",
    url: new URL("/en/history", SITE_ORIGIN).toString(),
    lastModified: HISTORY_MODIFIED_AT,
    scope: {
      earliestDocumentedPublicCapture: EARLIEST_DOCUMENTED_DATE,
      modernRestoration: RESTORATION_DATE,
      originalCreator: "unknown",
    },
    artifact: {
      name: "www.teuteuteu.com.swf",
      sha256:
        "74da8efc7fa5f64b1f038863fb097ea7d1dca13942b1e0ad90c68b9d376068b5",
      format: "Shockwave Flash 6",
      dimensions: "550 × 400",
      frameRate: 60,
      frames: 4494,
      shakeCalls: 166,
      audio: "MP3 · 44.1 kHz · stereo · 128 kbit/s",
    },
    methodology: {
      confirmed:
        "Directly supported by an archived artifact, registry record, or contemporary source.",
      lead: "A documented clue that does not establish identity or authorship.",
      context:
        "Contemporary context that helps explain the artifact but does not prove ownership.",
    },
    sources: Object.entries(HISTORY_SOURCES).map(([id, source]) => ({
      id,
      ...source,
    })),
    events: HISTORY_EVENTS.map((event) => ({
      id: event.id,
      date: event.dateTime ?? event.dateLabel,
      period: event.period,
      status: event.status,
      title: event.title,
      evidence: event.evidence,
      sourceIds: event.sourceKeys,
    })),
  } as const;
}
