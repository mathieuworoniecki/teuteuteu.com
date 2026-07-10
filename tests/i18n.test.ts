import { describe, expect, it } from "vitest";

import {
  directionFor,
  interpolate,
  messagesFor,
  resolveAcceptLanguage,
  supportedLocale,
  supportedLocales,
} from "@/lib/i18n";

describe("locale negotiation", () => {
  it("respects quality weights and regional fallbacks", () => {
    expect(resolveAcceptLanguage("de-DE;q=0.7, fr-CA;q=0.9, en;q=0.5")).toBe("fr");
    expect(resolveAcceptLanguage("pt-BR,pt;q=0.8")).toBe("pt-BR");
    expect(resolveAcceptLanguage("zh-Hant-HK,zh;q=0.8")).toBe("zh-TW");
  });

  it("falls back safely to English", () => {
    expect(resolveAcceptLanguage("xx-ZZ,*;q=0.5")).toBe("en");
    expect(supportedLocale("not_a_locale_at_all")).toBeNull();
  });

  it("normalises supported regional tags", () => {
    expect(supportedLocale("fr_CA")).toBe("fr");
    expect(supportedLocale("zh-CN")).toBe("zh-CN");
    expect(supportedLocale("pt")).toBe("pt-PT");
  });
});

describe("translation catalogue", () => {
  it("ships broad international coverage with complete messages", () => {
    expect(supportedLocales.length).toBeGreaterThanOrEqual(50);
    const englishKeys = Object.keys(messagesFor("en")).sort();
    for (const locale of supportedLocales) {
      expect(Object.keys(messagesFor(locale)).sort(), locale).toEqual(englishKeys);
      expect(messagesFor(locale).counter, locale).toContain("{count}");
    }
  });

  it("marks right-to-left languages", () => {
    expect(directionFor("ar")).toBe("rtl");
    expect(directionFor("he")).toBe("rtl");
    expect(directionFor("fr")).toBe("ltr");
  });

  it("interpolates counters without evaluating unknown placeholders", () => {
    expect(interpolate("Worldwide clicks: {count} {unknown}", { count: "42" })).toBe(
      "Worldwide clicks: 42 {unknown}",
    );
  });
});
