import { describe, expect, it } from "vitest";

import {
  EARLIEST_DOCUMENTED_DATE,
  HISTORY_EVENTS,
  HISTORY_SOURCES,
  RESTORATION_DATE,
} from "@/lib/history-timeline";

describe("documented site history", () => {
  it("separates the earliest surviving evidence from the restoration", () => {
    expect(EARLIEST_DOCUMENTED_DATE).toBe("2005-06-13");
    expect(RESTORATION_DATE).toBe("2026-07-10");
    expect(EARLIEST_DOCUMENTED_DATE).not.toBe(RESTORATION_DATE);
  });

  it("uses direct archival and registry sources", () => {
    expect(HISTORY_SOURCES.archive2005.url).toContain("20050613235831");
    expect(HISTORY_SOURCES.legal2021.url).toContain("mentions-legales");
    expect(HISTORY_SOURCES.rdap2026.url).toContain("rdap.verisign.com");
  });

  it("publishes a stable, sourced, chronological event ledger", () => {
    expect(HISTORY_EVENTS.length).toBeGreaterThanOrEqual(16);
    expect(new Set(HISTORY_EVENTS.map(({ id }) => id)).size).toBe(
      HISTORY_EVENTS.length,
    );
    expect(
      HISTORY_EVENTS.every(
        ({ evidence, sourceKeys, status }) =>
          evidence.length > 0 &&
          sourceKeys.length > 0 &&
          ["confirmed", "lead", "context"].includes(status),
      ),
    ).toBe(true);
    expect(HISTORY_EVENTS.at(0)?.id).toBe("2005-free-account");
    expect(HISTORY_EVENTS.at(-1)?.id).toBe("2026-restoration");
    expect(HISTORY_EVENTS.some(({ id }) => id.includes("unknown"))).toBe(false);
  });

  it("keeps every event source resolvable in the public source registry", () => {
    for (const event of HISTORY_EVENTS) {
      for (const sourceKey of event.sourceKeys) {
        const source = HISTORY_SOURCES[sourceKey];
        expect(source.url, `${event.id}:${sourceKey}`).toMatch(/^https:\/\//);
        expect(
          source.captured.trim().length,
          `${event.id}:${sourceKey}`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
