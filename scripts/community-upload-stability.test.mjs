import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("community upload guards keep selection and transport limits aligned", async () => {
  const [config, helpers, api, submissions, form] = await Promise.all([
    readFile("next.config.ts", "utf8"),
    readFile("src/app/[locale]/(main)/contribute/contribute-form.helpers.ts", "utf8"),
    readFile("src/apis/http/index.ts", "utf8"),
    readFile("src/apis/submissions/index.ts", "utf8"),
    readFile("src/app/[locale]/(main)/contribute/useContributeForm.ts", "utf8"),
  ]);

  assert.match(config, /proxyClientMaxBodySize: "42mb"/);
  assert.match(helpers, /MAX_TOTAL_IMAGE_BYTES/);
  assert.match(helpers, /nextPhotos\.reduce\(\(total, file\) => total \+ file\.size, 0\) > MAX_TOTAL_IMAGE_BYTES/);
  assert.match(api, /timeoutMs\?: number/);
  assert.match(api, /new ApiError\("API request timed out", 408\)/);
  assert.match(submissions, /COMMUNITY_UPLOAD_TIMEOUT_MS = 180_000/);
  assert.match(submissions, /timeoutMs: COMMUNITY_UPLOAD_TIMEOUT_MS/);
  assert.match(form, /t\("errors\.photoUploadFailed"\)/);
  assert.match(form, /\}, 5000\)/);
  assert.match(form, /clearSlowUploadTimer\(\)/);
});
