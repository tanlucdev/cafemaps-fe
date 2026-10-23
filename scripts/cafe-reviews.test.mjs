// Run: postman simulation run postman/simulations/cafe-reviews.sim.yaml --port 4900
// Then: CAFE_REVIEWS_TEST_API_URL=http://127.0.0.1:4900/reviews node --test scripts/cafe-reviews.test.mjs
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";
import ts from "typescript";

process.env.API_URL = process.env.CAFE_REVIEWS_TEST_API_URL ?? "http://127.0.0.1:4900/reviews";
const reviewTest = process.env.CAFE_REVIEWS_TEST_API_URL ? test : test.skip;
const sourceRoot = new URL("../src/", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const path = specifier.slice(2);
      const file = new URL(`${path}.ts`, sourceRoot);
      specifier = existsSync(file) ? file.href : new URL(`${path}/index.ts`, sourceRoot).href;
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (!url.startsWith(sourceRoot.href) || !url.endsWith(".ts")) return nextLoad(url, context);
    return {
      format: "module", shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText,
    };
  },
});
const { getCafeReviews, getMyCafeReview } = await import("../src/apis/reviews/index.ts");
const { ApiError, apiFetch } = await import("../src/apis/http/index.ts");

reviewTest("public reviews remain available when the user has no review", async () => {
  const [list, mine] = await Promise.all([
    getCafeReviews("no-review", 1, 3),
    getMyCafeReview("no-review", "test-token"),
  ]);
  assert.equal(mine, null);
  assert.equal(list.data.length, 1);
  assert.equal(list.summary.averageRating, 5);
});

reviewTest("existing personal reviews retain their content and ownership", async () => {
  const mine = await getMyCafeReview("has-review", "test-token");
  assert.equal(mine.id, "review-1");
  assert.equal(mine.isMine, true);
  assert.equal(mine.rating, 5);
  assert.equal(mine.content, "Good coffee");
});

reviewTest("empty-response support preserves HTTP and malformed JSON errors", async () => {
  for (const [id, status] of [["unauthorized", 401], ["server-error", 500]]) {
    await assert.rejects(getMyCafeReview(id, "test-token"),
      (error) => error instanceof ApiError && error.status === status);
  }
  await assert.rejects(getMyCafeReview("invalid-json", "test-token"), SyntaxError);
  await assert.rejects(apiFetch("/cafes/no-review/reviews/me"), SyntaxError);
});
