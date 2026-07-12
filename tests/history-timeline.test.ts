import { describe, expect, it } from "vitest";

import { EARLIEST_DOCUMENTED_DATE, HISTORY_SOURCES, RESTORATION_DATE } from "@/lib/history-timeline";

describe("documented site history", () => {
  it("separates the earliest surviving evidence from the restoration", () => {
    expect(EARLIEST_DOCUMENTED_DATE).toBe("2005-06-13");
    expect(RESTORATION_DATE).toBe("2026-07-10");
    expect(EARLIEST_DOCUMENTED_DATE).not.toBe(RESTORATION_DATE);
  });

  it("uses direct archival and registry sources", () => {
    expect(HISTORY_SOURCES.archive2005).toContain("20050613235831");
    expect(HISTORY_SOURCES.legal2021).toContain("mentions-legales");
    expect(HISTORY_SOURCES.rdap2026).toContain("rdap.verisign.com");
  });
});
