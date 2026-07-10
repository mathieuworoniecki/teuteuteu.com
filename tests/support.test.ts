import { describe, expect, it } from "vitest";

import { supportedLocales } from "@/lib/i18n";
import { currentCostSummary, supportCosts } from "@/lib/support-costs";
import { supportMessagesFor } from "@/lib/support-i18n";
import {
  beginEvasion,
  beginReturn,
  closedSupport,
  finishReturn,
  openFollowing,
  openStable,
} from "@/lib/support-machine";

describe("support cost model", () => {
  it("separates current costs from the optional Supabase upgrade", () => {
    expect(supportCosts.filter((cost) => !cost.optional)).toEqual([
      { name: "Vercel Pro", price: "$20", period: "month", optional: false },
      { name: "Supabase Free", price: "$0", period: "month", optional: false },
      { name: "Domain", price: "€16", period: "year", optional: false },
    ]);
    expect(currentCostSummary).toBe("$20 / month + €16 / year");
  });

  it("translates every support message in every supported locale", () => {
    const keys = Object.keys(supportMessagesFor("en")).sort();
    for (const locale of supportedLocales) {
      const messages = supportMessagesFor(locale);
      expect(Object.keys(messages).sort(), locale).toEqual(keys);
      expect(Object.values(messages).every((message) => message.trim().length > 0), locale).toBe(true);
    }
  });
});

describe("support interaction state machine", () => {
  it("returns to following after the first evasion", () => {
    const following = openFollowing(closedSupport);
    const evading = beginEvasion(following);
    expect(finishReturn(beginReturn(evading))).toEqual({ phase: "following", evasions: 1 });
  });

  it("becomes stable after two evasions and cannot evade again", () => {
    const firstReturn = finishReturn(beginReturn(beginEvasion(openFollowing(closedSupport))));
    const stable = finishReturn(beginReturn(beginEvasion(firstReturn)));
    expect(stable).toEqual({ phase: "stable", evasions: 2 });
    expect(beginEvasion(stable)).toBe(stable);
  });

  it("opens directly in a stable state for keyboard and touch", () => {
    expect(openStable(closedSupport)).toEqual({ phase: "stable", evasions: 0 });
  });
});
