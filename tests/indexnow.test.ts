import { afterEach, describe, expect, it } from "vitest";

import { GET } from "@/app/indexnow-key/route";

const originalKey = process.env.INDEXNOW_KEY;

afterEach(() => {
  if (originalKey === undefined) delete process.env.INDEXNOW_KEY;
  else process.env.INDEXNOW_KEY = originalKey;
});

describe("IndexNow ownership route", () => {
  it("stays unavailable when no valid key is configured", async () => {
    delete process.env.INDEXNOW_KEY;
    expect((await GET()).status).toBe(404);

    process.env.INDEXNOW_KEY = "short";
    expect((await GET()).status).toBe(404);
  });

  it("serves the configured key as non-indexable plain text", async () => {
    process.env.INDEXNOW_KEY = "12345678-valid-indexnow-key";
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(response.headers.get("x-robots-tag")).toBe("noindex");
    expect(await response.text()).toBe("12345678-valid-indexnow-key");
  });
});
