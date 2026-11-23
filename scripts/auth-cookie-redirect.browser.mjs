// Run against the real local FE/backend: BASE_URL=http://localhost:3117 node scripts/auth-cookie-redirect.browser.mjs
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:3117";
const headers = { Cookie: "cafe-auth-token=expired-session" };
for (const locale of ["vi", "en"]) {
  for (const route of ["login", "register"]) {
    const path = `/${locale}/${route}`;
    const response = await fetch(`${base}${path}`, { headers, redirect: "manual" });
    assert.equal(response.status, 200, `${path} must remain reachable with an expired cookie`);
    await response.arrayBuffer();
  }
  const path = `/${locale}/contribute/owner`;
  const response = await fetch(`${base}${path}`, { redirect: "manual" });
  assert.equal(response.status, 307);
  const location = new URL(response.headers.get("location"), base);
  assert.equal(location.pathname, `/${locale}/login`);
  assert.equal(location.searchParams.get("returnUrl"), path);
}
const response = await fetch(`${base}/api-proxy/submissions`, {
  method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: "{}",
});
assert.equal(response.status, 401, "An expired cookie must not authorize submission writes");
console.log("PASS: expired cookies allow login/register; owner redirect and API JWT protection remain intact");
