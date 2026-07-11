import { describe, expect, it } from "vitest";

import { readUtf8Body } from "@/lib/request";
import { isAllowedClickOrigin } from "@/lib/click-request";

describe("readUtf8Body", () => {
  it("accepts an empty request body", async () => {
    const request = new Request("https://teuteuteu.com/api/click", { method: "POST" });
    await expect(readUtf8Body(request, 0)).resolves.toBe("");
  });

  it("reads a payload within the limit", async () => {
    const request = new Request("https://teuteuteu.com/webhook", { body: "teu", method: "POST" });
    await expect(readUtf8Body(request, 3)).resolves.toBe("teu");
  });

  it("rejects a payload beyond the limit", async () => {
    const request = new Request("https://teuteuteu.com/api/click", { body: "x", method: "POST" });
    await expect(readUtf8Body(request, 0)).resolves.toBeNull();
  });
});

describe("click request origin", () => {
  it("accepts a production same-origin browser request", () => {
    const request = new Request("https://www.teuteuteu.com/api/click", {
      headers: {
        host: "www.teuteuteu.com",
        origin: "https://www.teuteuteu.com",
        "sec-fetch-site": "same-origin",
      },
      method: "POST",
    });
    expect(isAllowedClickOrigin(request, true)).toBe(true);
  });

  it("rejects missing and foreign production origins", () => {
    expect(isAllowedClickOrigin(new Request("https://www.teuteuteu.com/api/click"), true)).toBe(false);
    const foreign = new Request("https://www.teuteuteu.com/api/click", {
      headers: { host: "www.teuteuteu.com", origin: "https://attacker.example" },
      method: "POST",
    });
    expect(isAllowedClickOrigin(foreign, true)).toBe(false);
  });

  it("rejects cross-site fetch metadata even when a proxy host is present", () => {
    const request = new Request("https://www.teuteuteu.com/api/click", {
      headers: {
        "x-forwarded-host": "www.teuteuteu.com",
        origin: "https://www.teuteuteu.com",
        "sec-fetch-site": "cross-site",
      },
      method: "POST",
    });
    expect(isAllowedClickOrigin(request, true)).toBe(false);
  });
});
