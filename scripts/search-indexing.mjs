import assert from "node:assert/strict";

const origin = new URL(process.argv[2] ?? "http://localhost:3028");
const get = (path) => fetch(new URL(path, origin), {
  headers: { "User-Agent": "Googlebot" },
  redirect: "manual",
  signal: AbortSignal.timeout(20_000),
});

async function read(path, status = 200) {
  const response = await get(path);
  assert.equal(response.status, status, String(path));
  return response.text();
}

const locations = (xml) => Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), ([, url]) => url);
const index = locations(await read("/sitemap.xml"));
assert(index.includes(new URL("/sitemap-pages.xml", origin).href));
const pages = await read("/sitemap-pages.xml");
assert(!pages.includes("/contribute/owner"));

const cafeSitemap = index.find((url) => new URL(url).pathname.startsWith("/sitemap-cafes-"));
assert(cafeSitemap, "Database must have published cafes");
const cafes = locations(await read(cafeSitemap));
for (const locale of ["vi", "en"]) {
  const cafe = cafes.find((url) => new URL(url).pathname.startsWith(`/${locale}/cafe/`));
  assert(cafe);
  const path = new URL(cafe).pathname;
  const response = await get(`${path}?utm_source=check`);
  assert.equal(response.status, 200, path);
  assert.doesNotMatch(response.headers.get("link") ?? "", /hreflang=/i);
  const page = await response.text();
  const head = page.split("</head>", 1)[0];
  assert.deepEqual([...page.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(([, href]) => href), [cafe]);
  assert(head.includes(`<link rel="canonical" href="${cafe}"`));
  for (const [lang, prefix] of [["vi-VN", "vi"], ["en-US", "en"], ["x-default", "vi"]]) {
    const href = new URL(path.replace(/^\/[^/]+/, `/${prefix}`), origin);
    assert(head.includes(`<link rel="alternate" hrefLang="${lang}" href="${href}"`));
  }
  assert(!/<meta name="(?:robots|googlebot)" content="[^"]*noindex/.test(head));
}

for (const path of ["/vi/cafe/search-indexing-missing-cafe", "/en/chains/search-indexing-missing-chain"]) {
  const html = await read(path, 404);
  assert(!html.includes('<link rel="canonical"'));
}
assert.match(await read("/vi/login"), /<meta name="robots" content="noindex/);
assert.equal((await get("/vi/contribute/owner")).status, 307);

for (const [from, to] of [
  ["/?q=cafe", "/vi?q=cafe"],
  ["/en/vi/blog", "/en/blog"],
  ["/search?q=cafe", "/vi?q=cafe"],
  ["/en/search?q=cafe", "/en?q=cafe"],
]) {
  const response = await get(from);
  assert.equal(response.status, 308, from);
  assert.equal(new URL(response.headers.get("location"), origin).href, new URL(to, origin).href);
}
console.log("Search indexing checks passed");
