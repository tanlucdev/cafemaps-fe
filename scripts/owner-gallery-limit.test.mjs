import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  limitOwnerGalleryFiles,
  remainingOwnerGalleryImages,
} from "../src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/image-limits.ts";

test("owner gallery accepts only its remaining twelve-image quota", () => {
  assert.equal(remainingOwnerGalleryImages(0), 12);
  assert.deepEqual(limitOwnerGalleryFiles(["a", "b"], 11), ["a"]);
  assert.deepEqual(limitOwnerGalleryFiles(["a"], 12), []);
  assert.equal(remainingOwnerGalleryImages(11), 1);
});

test("gallery picker becomes single-select at eleven images and disabled at twelve", async () => {
  const pane = await readFile(
    "src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/EditableDetailPane.tsx",
    "utf8",
  );
  const controls = await readFile(
    "src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/editable-controls.tsx",
    "utf8",
  );

  assert.match(pane, /multiple=\{remainingGalleryImages > 1\}/);
  assert.match(controls, /disabled=\{locked \|\| !remainingImages\}/);
  assert.match(controls, /multiple=\{multiple\}/);
});
