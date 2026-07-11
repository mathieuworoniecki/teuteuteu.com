import { expect, test } from "@playwright/test";

test("keeps the historical interaction accessible and scroll-free", async ({ page }) => {
  await page.route("**/api/click", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify({ clicks: "42", limited: false }) }),
  );
  await page.addInitScript(() => {
    const originalAnimate = Element.prototype.animate;
    const state = window as unknown as { __legacyShakeCount: number };
    state.__legacyShakeCount = 0;
    Element.prototype.animate = function (keyframes, options) {
      if (this.classList.contains("site-shell")) state.__legacyShakeCount += 1;
      return originalAnimate.call(this, keyframes, options);
    };
  });
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Play teuteuteu" })).toBeVisible();
  const button = page.locator(".teu-button");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("link", { name: "A teu for hosting?" })).toHaveAttribute(
    "href",
    "https://buymeacoffee.com/alzok",
  );

  await button.click();
  await expect(button).toHaveClass(/is-pressed/);
  await expect(button).not.toHaveClass(/is-pressed/, { timeout: 1_500 });
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Press the button")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __legacyShakeCount: number }).__legacyShakeCount))
    .toBeGreaterThan(0);
});

test("detects browser languages and supports right-to-left copy", async ({ browser }) => {
  const french = await browser.newContext({ locale: "fr-FR" });
  const frenchPage = await french.newPage();
  await frenchPage.goto("/");
  await expect(frenchPage.locator("html")).toHaveAttribute("lang", "fr");
  await expect(frenchPage.getByText("Appuie sur le bouton")).toBeVisible();
  await french.close();

  const arabic = await browser.newContext({ locale: "ar" });
  const arabicPage = await arabic.newPage();
  await arabicPage.goto("/");
  await expect(arabicPage.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(arabicPage.getByText("اضغط على الزر")).toBeVisible();
  await expect(arabicPage.locator("body")).toHaveCSS("overflow", "hidden");
  await arabic.close();
});

test("allows a supported language override without adding interface chrome", async ({ page }) => {
  await page.goto("/?lang=ja");
  await expect(page.locator("main")).toHaveAttribute("lang", "ja");
  await expect(page.getByText("ボタンを押して")).toBeVisible();
});

test("plays two support-panel evasions and then becomes stable", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "A teu for hosting?", exact: true });
  const panel = page.locator(".support-panel");

  await link.hover();
  await expect(panel).toHaveAttribute("data-state", "following");
  await expect(panel).toHaveAttribute("data-evasions", "1", { timeout: 4_000 });
  await expect(page.getByText("Are you sure?")).toBeVisible({ timeout: 2_000 });
  await expect(panel).toHaveAttribute("data-evasions", "2", { timeout: 4_000 });
  await expect(panel).toHaveAttribute("data-state", "stable", { timeout: 2_000 });
  await expect(page.getByText("A tiny tip for my kibble?")).toBeVisible();

  const box = await panel.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);

  await page.getByRole("button", { name: "Play teuteuteu" }).click();
  await expect(panel).toHaveAttribute("data-state", "closed");
});

test("opens support costs accessibly for keyboard and reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const link = page.getByRole("link", { name: "A teu for hosting?", exact: true });
  const panel = page.locator(".support-panel");

  await link.focus();
  await expect(panel).toHaveAttribute("data-state", "stable");
  await expect(page.getByText("Current estimate")).toBeVisible();
  await expect(page.getByText("$25+ / month")).toBeVisible();
  await expect(page.getByText("$45+ / month + €16 / year")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("data-state", "closed");

  await link.hover();
  await expect(panel).toHaveAttribute("data-state", "stable");
  await page.waitForTimeout(2_700);
  await expect(panel).toHaveAttribute("data-evasions", "0");
  await context.close();
});

test("refreshes the global counter without requiring a local click", async ({ page }) => {
  let globalClicks = "100";
  await page.route("**/api/counter", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ clicks: globalClicks, configured: true, updatedAt: new Date().toISOString() }),
    }),
  );

  await page.goto("/en");
  await expect(page.getByText("Worldwide clicks: 100")).toBeVisible();
  globalClicks = "101";
  await expect(page.getByText("Worldwide clicks: 101")).toBeVisible({ timeout: 5_000 });
});

test("publishes visible localized history with canonical discovery metadata", async ({ page }) => {
  await page.goto("/fr/history");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("années 2000");
  await expect(page.getByText("166 secousses")).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/fr\/history$/);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", /\/en\/history$/);
  await expect(page.getByRole("link", { name: /Retour au bouton/ })).toHaveAttribute("href", "/fr");
});

test("exposes crawler policy and the complete international sitemap", async ({ request }) => {
  const counter = await request.get("/api/counter");
  expect(counter.headers()["vercel-cdn-cache-control"]).toContain("max-age=2");

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /api/");

  const sitemap = await request.get("/sitemap.xml");
  const xml = await sitemap.text();
  expect(xml).toContain("/en/history");
  expect(xml).toContain("/zh-CN/history");
  expect(xml).toContain('hreflang="fr"');
});
