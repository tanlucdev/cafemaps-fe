// Run with Playwright installed, FE running; optionally set PLAYWRIGHT_MODULE and BASE_URL.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage();
    let enabled = true;
    let failed = false;
    let defaultDescription = false;
    await page.route("**/api-proxy/donation-settings", (route) =>
      route.fulfill({
        status: failed ? 500 : 200,
        json: {
          enabled,
          qrImageUrl: `${process.env.BASE_URL || "http://localhost:3002"}/image/donate-qr.jpg`,
          titleVi: "Footer QR VI",
          titleEn: "Footer QR EN",
          descriptionVi: defaultDescription ? null : "Nội dung footer",
          descriptionEn: defaultDescription ? null : "Footer content",
        },
      }),
    );
    for (const locale of ["vi", "en"]) {
      const title = `Footer QR ${locale.toUpperCase()}`;
      const messages = JSON.parse(
        readFileSync(new URL(`../src/messages/${locale}.json`, import.meta.url)),
      );
      for (const width of [320, 375, 768, 1024, 1440]) {
        defaultDescription = width === 320;
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`${process.env.BASE_URL || "http://localhost:3002"}/${locale}/saved`);
        const section = page.getByRole("region", { name: title, exact: true });
        await section.waitFor();
        await section
          .getByText(
            defaultDescription
              ? messages.donate.description
              : locale === "vi"
                ? "Nội dung footer"
                : "Footer content",
            { exact: true },
          )
          .waitFor();
        await section.scrollIntoViewIfNeeded();
        assert.equal(await section.locator("img").count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const boxes = await section.locator("h2, img").evaluateAll((nodes) =>
          nodes.map((node) => {
            const r = node.getBoundingClientRect();
            return { left: r.left, right: r.right };
          }),
        );
        assert.ok(boxes[0].right <= boxes[1].left, `QR overlap at ${width}`);
      }
    }
    await page.setViewportSize({ width: 1280, height: 1000 });
    for (const state of ["disabled", "error"]) {
      enabled = false;
      failed = state === "error";
      await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes("/api-proxy/donation-settings"),
        ),
        page.reload(),
      ]);
      await page.waitForTimeout(200);
      assert.equal(await page.locator("footer section").count(), 0);
      const button = page
        .locator("button[aria-controls][aria-expanded]")
        .filter({ has: page.locator("svg.lucide-coffee") });
      await button.click();
      const panel = page.locator(`[id="${await button.getAttribute("aria-controls")}"]`);
      await panel.waitFor();
      assert.ok(!(await panel.locator("img").getAttribute("alt")).startsWith("Footer QR"));
      await panel
        .locator("button")
        .filter({ has: page.locator("svg.lucide-message-square-text") })
        .click();
      await panel.locator("textarea").waitFor();
      await page.keyboard.press("Escape");
    }
    console.log(
      "Passed: responsive footer VI/EN; disabled/API error leave floating QR and feedback usable.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
