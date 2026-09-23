import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("owner image uploads use batch endpoint for single files too", async () => {
  const api = await readFile("src/apis/submissions/index.ts", "utf8");
  const hook = await readFile(
    "src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/useImageUploads.ts",
    "utf8",
  );

  assert.match(api, /\/\$\{kind\}\/batch`/);
  assert.match(hook, /uploadSubmissionImages/);
  assert.doesNotMatch(hook, /uploadSubmissionImage(?!s)/);
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

  assert.match(form, /imagesLocked=\{hasUploadPending\}/);
  assert.match(form, /disabled=\{!canPreview \|\| loading \|\| hasUploadPending \|\| hasUploadFailed\}/);
  assert.match(controls, /disabled=\{locked \|\| !remainingImages\}/);
  assert.match(controls, /disabled=\{locked\} onClick=\{\(\) => onRemove\(index\)\}/);
  assert.match(controls, /disabled=\{locked\} onClick=\{\(\) => onMakeCover\(index\)\}/);
});
