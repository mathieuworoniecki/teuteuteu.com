import { describe, expect, it } from "vitest";

import { historySourceLedger } from "@/lib/history-source-ledger";

describe("public history source ledger", () => {
  it("publishes the preserved artifact facts without claiming an author", () => {
    const ledger = historySourceLedger();

    expect(ledger.scope.earliestDocumentedPublicCapture).toBe("2005-06-13");
    expect(ledger.scope.originalCreator).toBe("unknown");
    expect(ledger.artifact.sha256).toHaveLength(64);
    expect(ledger.artifact.frames).toBe(4494);
    expect(ledger.artifact.shakeCalls).toBe(166);
  });

  it("keeps every event source resolvable in the public ledger", () => {
    const ledger = historySourceLedger();
    const sourceIds = new Set(ledger.sources.map((source) => source.id));

    expect(ledger.events.length).toBeGreaterThan(10);
    for (const event of ledger.events) {
      for (const sourceId of event.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });
});
