import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const calls = [];
const source = ts.transpileModule(
  readFileSync(new URL("../src/app/api/revalidate-cafes/route.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
const exports = {};
let fail = false;
new Function("require", "exports", source)((name) => {
  assert.equal(name, "next/cache");
  return { revalidateTag: (...args) => {
    if (fail) throw new Error("cache unavailable");
    calls.push(args);
  } };
}, exports);

test("webhook validates auth and payload before expiring cache tags", async (t) => {
  const previousSecret = process.env.REVALIDATE_SECRET;
  t.after(() => {
    if (previousSecret === undefined) delete process.env.REVALIDATE_SECRET;
    else process.env.REVALIDATE_SECRET = previousSecret;
  });
  const logs = [];
  t.mock.method(console, "info", (line) => logs.push(line));
  t.mock.method(console, "warn", (line) => logs.push(line));
  process.env.REVALIDATE_SECRET = "test-webhook-secret";
  const send = (body, authorization = "Bearer test-webhook-secret") => exports.POST(
    new Request("http://localhost/api/revalidate-cafes", {
      method: "POST", headers: { Authorization: authorization }, body,
    }),
  );
  assert.equal((await send("{}", "Bearer wrong")).status, 401);
  delete process.env.REVALIDATE_SECRET;
  assert.equal((await send("{}")).status, 401);
  process.env.REVALIDATE_SECRET = "test-webhook-secret";
  for (const body of ["{", "", "null", "[]", '"text"', "42", "true",
    '{"slug":null}', '{"slug":12}', '{"slug":{}}', '{"slug":[]}',
    '{"slug":""}', '{"slug":"  "}', JSON.stringify({ slug: "a".repeat(252) })]) {
    assert.equal((await send(body)).status, 400, body);
  }
  assert.deepEqual(calls, []);
  for (const slug of [undefined, " ten-quan ", "a".repeat(251)]) {
    calls.length = 0;
    const response = await send(JSON.stringify({ reason: "cafe_changed", ...(slug ? { slug } : {}) }));
    const tags = ["cafes", ...(slug ? [`cafe:${slug.trim()}`] : [])];
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { revalidated: true, tags });
    assert.deepEqual(calls, tags.map((tag) => [tag, { expire: 0 }]));
  }
  fail = true;
  const failed = await send("{}");
  assert.equal(failed.status, 500);
  assert.deepEqual(await failed.json(), { revalidated: false });
  assert.ok(logs.every((line) => !line.includes("test-webhook-secret")));
});

test("server fetch retains the 300-second fallback when callers supply cache tags", async (t) => {
  const previousUrl = process.env.API_URL;
  process.env.API_URL = "https://api.test";
  t.after(() => {
    if (previousUrl === undefined) delete process.env.API_URL;
    else process.env.API_URL = previousUrl;
  });
  const httpSource = ts.transpileModule(
    readFileSync(new URL("../src/apis/http/index.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText;
  const http = {};
  new Function("require", "exports", httpSource)(
    () => ({ READ_REVALIDATE_SECONDS: 300 }), http,
  );
  const requests = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    requests.push(options);
    return Response.json({});
  });
  for (const locale of ["vi", "en"]) {
    await http.apiFetch(`/cafes/ten-quan?locale=${locale}`, {
      next: { tags: ["cafes", "cafe:ten-quan"] },
    });
    assert.equal(requests.at(-1).cache, "force-cache");
    assert.deepEqual(requests.at(-1).next, {
      revalidate: 300, tags: ["cafes", "cafe:ten-quan"],
    });
  }
  await http.apiFetch("/cafes", { next: { revalidate: 60 } });
  assert.equal(requests.at(-1).next.revalidate, 60);
  await http.apiFetch("/cafes", { cache: "no-store" });
  assert.equal(requests.at(-1).cache, "no-store");
  assert.equal(requests.at(-1).next, undefined);
});
