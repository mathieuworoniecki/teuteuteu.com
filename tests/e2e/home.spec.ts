import { expect, test } from "@playwright/test";

test("keeps the historical interaction accessible and scroll-free", async ({ page }) => {
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

  await expect(page.getByRole("button", { name: "Lancer teuteuteu" })).toBeVisible();
  const button = page.locator(".teu-button");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("link", { name: "Un teu pour l’hébergement ?" })).toHaveAttribute(
    "href",
    "https://buymeacoffee.com/alzok",
  );

  await button.click();
  await expect(button).toHaveClass(/is-pressed/);
  await expect(button).not.toHaveClass(/is-pressed/, { timeout: 1_500 });
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Appuie sur le bouton")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __legacyShakeCount: number }).__legacyShakeCount))
    .toBeGreaterThan(0);
});
