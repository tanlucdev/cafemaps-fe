import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("owner image uploads sign, upload direct, then persist", async () => {
  const api = await readFile("src/apis/submissions/index.ts", "utf8");
  const hook = await readFile(
    "src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/useImageUploads.ts",
    "utf8",
  );

  assert.match(api, /assets\/signatures/);
  assert.match(api, /api\.cloudinary\.com/);
  assert.match(api, /method: "DELETE"/);
  assert.match(hook, /signSubmissionAssets/);
  assert.match(hook, /uploadSignedSubmissionAsset/);
  assert.match(hook, /persistSubmissionAsset/);
  assert.match(hook, /mapLimit\(items, 2/);
  assert.match(hook, /AbortController/);
  assert.match(hook, /deleteSubmissionAsset/);
  assert.match(hook, /isHeicFile/);
  assert.match(hook, /Cloudinary public ID mismatch/);
  assert.doesNotMatch(api, /\/batch/);
});

test("owner image controls lock during every pending batch", async () => {
  const form = await readFile(
    "src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/index.tsx",
    "utf8",
  );
  const controls = await readFile(
    "src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/editable-controls.tsx",
    "utf8",
  );
  const grid = await readFile(
    "src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/ImageGrid.tsx",
    "utf8",
  );

  assert.match(form, /imagesLocked=\{hasUploadPending\}/);
  assert.match(
    form,
    /disabled=\{!canPreview \|\| loading \|\| hasUploadPending \|\| hasUploadFailed\}/,
  );
  assert.match(controls, /disabled=\{locked \|\| !remainingImages\}/);
  assert.match(controls, /disabled=\{locked\}/);
  assert.match(grid, /onClick=\{\(\) => onRemove\(index\)\}/);
  assert.match(grid, /onClick=\{\(\) => onMakeCover\(index\)\}/);
  assert.match(grid, />\s*Huỷ\s*</);
});
