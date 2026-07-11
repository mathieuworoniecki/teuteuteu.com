import { describe, expect, it } from "vitest";

import { formatClicks, formatClicksDisplay, incrementClicks, maxClicks, normaliseDonorName } from "@/lib/format";

describe("normaliseDonorName", () => {
  it("keeps a presentable name and compacts whitespace", () => {
    expect(normaliseDonorName("  Jean   Michel  ")).toBe("Jean Michel");
  });

  it("rejects a blank name", () => {
    expect(normaliseDonorName(" \n ")).toBeNull();
  });

  it("caps a display name at 64 characters", () => {
    expect(normaliseDonorName("a".repeat(80))).toHaveLength(64);
  });
});

describe("large click counts", () => {
  it("increments beyond JavaScript's safe integer limit without losing precision", () => {
    expect(incrementClicks("9007199254740992")).toBe("9007199254740993");
  });

  it("never lets a stale distributed-cache response move the counter backwards", () => {
    expect(maxClicks("9223372036854775806", "9223372036854775805")).toBe("9223372036854775806");
    expect(maxClicks("41", "42")).toBe("42");
  });

  it("keeps an exact localized representation", () => {
    expect(formatClicks("9223372036854775807", "fr-FR").replace(/\s/g, " ")).toBe("9 223 372 036 854 775 807");
  });

  it("uses a compact visual representation for very large values", () => {
    expect(formatClicksDisplay("1250000000", "fr-FR")).toMatch(/1,3\s?Md/);
  });

  it("uses the requested locale without reducing precision", () => {
    expect(formatClicks("9007199254740993", "en-US")).toBe("9,007,199,254,740,993");
  });
});
