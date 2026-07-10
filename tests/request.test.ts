import { describe, expect, it } from "vitest";

import { readUtf8Body } from "@/lib/request";

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
