import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/apis/http/index.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
});

test("tagged server reads retain cache lifetime and caller overrides", async () => {
  const exports = {};
  let request;
  runInNewContext(outputText, {
    exports, Headers, FormData, AbortSignal, AbortController, setTimeout, clearTimeout,
    process: { env: {} },
    require: (name) => name.endsWith("/constants")
      ? { READ_REVALIDATE_SECONDS: 300 }
      : { AUTH_COOKIE_KEYS: {}, AUTH_STORAGE_KEYS: {} },
    fetch: async (_url, options) => {
      request = options;
      return { ok: true, json: async () => ({}) };
    },
  });

  await exports.apiFetch("/cafes/dumm", { next: { tags: ["cafes", "cafe:dumm"] } });
  assert.equal(request.cache, "force-cache");
  assert.equal(request.next.revalidate, 300);
  assert.equal(JSON.stringify(request.next.tags), '["cafes","cafe:dumm"]');

  await exports.apiFetch("/cafes/dumm", { next: { revalidate: 60 } });
  assert.equal(request.next.revalidate, 60);

  await exports.apiFetch("/cafes/dumm", { cache: "no-store", next: { tags: ["cafe:dumm"] } });
  assert.equal(request.cache, "no-store");
  assert.equal(request.next.revalidate, undefined);
  assert.equal(JSON.stringify(request.next.tags), '["cafe:dumm"]');
});
