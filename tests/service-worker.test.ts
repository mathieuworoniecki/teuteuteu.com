import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("service worker deployment safety", () => {
  const worker = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
  const offline = readFileSync(new URL("../public/offline.html", import.meta.url), "utf8");

  it("never stores deployment-bound Next.js HTML as an offline shell", () => {
    expect(worker).not.toContain('fetch("/")');
    expect(worker).not.toContain("cache.put(OFFLINE_PAGE");
    expect(worker).toContain('const OFFLINE_PAGE = "/offline.html"');
  });

  it("ships a self-contained offline document without Next.js chunks", () => {
    expect(offline).not.toContain("/_next/");
    expect(offline).toContain("/teuteuteu.mp3");
  });
});
