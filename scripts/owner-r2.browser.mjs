// Start test/owner-r2.browser-server.ts in the backend, point local FE API_URL at it.
// Uses an existing Playwright installation; no project dependency required.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const session = JSON.parse(
  await readFile(process.env.OWNER_R2_SESSION_FILE || "/tmp/cafe-owner-r2-browser.json", "utf8"),
);
const base = process.env.BASE_URL || "http://localhost:3117";
const browser = await chromium.launch({ channel: "chrome", headless: true });
let page;
try {
  page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  page.setDefaultTimeout(10000);
  await page.context().addCookies([{ name: "cafe-auth-token", value: session.token, url: base }]);
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem("cafe-access-token", token);
    localStorage.setItem("cafe-auth-user", JSON.stringify(user));
  }, session);
  const errors = [],
    traffic = [],
    uploads = [];
  let active = 0,
    maximum = 0,
    failDelete = true,
    failUpload = false;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => traffic.push({ url: request.url(), method: request.method() }));
  await page.route("**/api-proxy/submissions/*/{images,menu}", async (route) => {
    if (route.request().method() === "DELETE" && failDelete) {
      failDelete = false;
      await route.fulfill({ status: 502 });
      return;
    }
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    if (failUpload) {
      failUpload = false;
      await route.fulfill({ status: 400 });
      return;
    }
    maximum = Math.max(maximum, ++active);
    const response = await route.fetch();
    const result = await response.json();
    uploads.push(result);
    if (uploads.length === 1) await new Promise((resolve) => setTimeout(resolve, 150));
    await route.fulfill({ response });
    active--;
  });
  await page.goto(`${base}/vi/contribute/owner`);
  await page.getByPlaceholder("Nhập tên quán").fill("R2 Browser Test");
  await page.getByPlaceholder("07:00", { exact: true }).fill("07:00");
  await page.getByPlaceholder("22:00", { exact: true }).fill("22:00");
  await page.getByPlaceholder("Nhập địa chỉ", { exact: true }).fill("Local test address");
  const image = {
    name: "gallery.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZuoAAAAASUVORK5CYII=",
      "base64",
    ),
  };
  await page
    .locator("#owner-gallery-empty-upload")
    .setInputFiles([image, { ...image, name: "gallery2.png" }]);
  await page.locator("#owner-menu-direct-upload").setInputFiles({ ...image, name: "menu.png" });
  await page.getByRole("button", { name: "Xem lại", exact: true }).waitFor();
  assert.equal(uploads.length, 3);
  assert.equal(maximum, 2);
  await page.getByRole("button", { name: "Sửa", exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  const sources = await dialog.locator("img").evaluateAll((nodes) => nodes.map((node) => node.src));
  assert.match(sources[0], /-gallery\.webp$/);
  assert.match(sources[1], /-gallery2\.webp$/);
  await dialog.getByRole("button", { name: "Đặt bìa", exact: true }).click();
  assert.match(await dialog.locator("img").first().getAttribute("src"), /-gallery2\.webp$/);
  await dialog.getByRole("button", { name: "Xoá ảnh", exact: true }).first().click();
  await dialog.getByRole("button", { name: "Thử xoá lại", exact: true }).waitFor();
  assert.equal(await dialog.locator("img").count(), 2);
  await dialog.getByRole("button", { name: "Thử xoá lại", exact: true }).click();
  await dialog.locator("img").filter({ visible: true }).first().waitFor();
  await page.waitForFunction(() => document.querySelectorAll('[role="dialog"] img').length === 1);
  failUpload = true;
  await dialog.locator("#owner-gallery-upload").setInputFiles({ ...image, name: "retry.png" });
  await dialog.getByRole("button", { name: "Chọn lại", exact: true }).waitFor();
  await dialog
    .locator('input[id^="replace-gallery"]')
    .setInputFiles({ ...image, name: "replacement.png" });
  await dialog.locator('img[src$="-replacement.webp"]').waitFor();
  await dialog.getByRole("button", { name: "Xong", exact: true }).click();
  await page.getByRole("button", { name: "Xem lại", exact: true }).click();
  const id = uploads[0].id;
  const before = await fetch(`${session.base}/submissions/me`, {
    headers: { Authorization: `Bearer ${session.token}` },
  }).then((r) => r.json());
  const draft = before.find((value) => value.id === id);
  assert.equal(draft.payload.images.length, 2);
  assert.equal(draft.payload.menuImages.length, 1);
  const deleted = sources[1];
  assert.equal(draft.payload.images.includes(deleted), false);
  await page.getByRole("button", { name: "Gửi duyệt", exact: true }).click();
  await page.getByRole("heading", { name: "Cảm ơn bạn đã đóng góp quán", exact: true }).waitFor();
  const after = await fetch(`${session.base}/submissions/me`, {
    headers: { Authorization: `Bearer ${session.token}` },
  }).then((r) => r.json());
  const saved = after.find((value) => value.id === id);
  assert.equal(saved.status, "pending");
  assert.match(saved.payload.images[0], /-gallery\.webp$/);
  assert.equal(
    saved.payload.images.some((url) => url === deleted),
    false,
  );
  assert.equal(
    traffic.some(
      (request) => request.method === "POST" && request.url.includes("api.cloudinary.com"),
    ),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: gallery/menu, two concurrent requests, order, cover, delete retry, replacement, preview, save/submit; no Cloudinary POST or React errors",
  );
} catch (error) {
  console.error(await page.locator("body").innerText());
  throw error;
} finally {
  await browser.close();
}
