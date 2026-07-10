import { describe, expect, it } from "vitest";

import {
  LEGACY_DURATION_SECONDS,
  LEGACY_SHAKE_EVENTS,
  LEGACY_TOTAL_FRAMES,
} from "@/lib/legacy-timeline";

describe("legacy Flash timeline", () => {
  it("preserves the 550x400 SWF's 60 fps timing", () => {
    expect(LEGACY_TOTAL_FRAMES).toBe(4494);
    expect(LEGACY_DURATION_SECONDS).toBe(74.9);
  });

  it("contains all 166 extracted shake events in chronological order", () => {
    expect(LEGACY_SHAKE_EVENTS).toHaveLength(166);
    expect(LEGACY_SHAKE_EVENTS[0]).toMatchObject({ frame: 23, axis: "xy", amplitude: 1 });
    expect(LEGACY_SHAKE_EVENTS.at(-1)).toMatchObject({ frame: 4423, axis: "xy", amplitude: 5 });
    expect(LEGACY_SHAKE_EVENTS.every((event, index) => index === 0 || event.frame > LEGACY_SHAKE_EVENTS[index - 1].frame)).toBe(true);
  });

  it("keeps the original amplitude distribution", () => {
    const count = (axis: "x" | "xy", amplitude: 1 | 2 | 5) =>
      LEGACY_SHAKE_EVENTS.filter((event) => event.axis === axis && event.amplitude === amplitude).length;

    expect(count("xy", 1)).toBe(17);
    expect(count("x", 2)).toBe(15);
    expect(count("xy", 2)).toBe(133);
    expect(count("xy", 5)).toBe(1);
  });
});
