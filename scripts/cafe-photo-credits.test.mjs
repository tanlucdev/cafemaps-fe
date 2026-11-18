// Run: node --test scripts/cafe-photo-credits.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const file = new URL(
  "../src/app/[locale]/(main)/cafe/[slug]/_components/CafePhotoCredits.tsx",
  import.meta.url,
);
const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
  },
});
const exports = {};
runInNewContext(outputText, {
  exports,
  require(name) {
    if (name === "next-intl")
      return { useTranslations: () => (key, args) => args?.username ?? key };
    if (name.endsWith("/InstagramIcon")) return { default: () => null };
    return require(name);
  },
});
const render = (cafe) =>
  renderToStaticMarkup(
    React.createElement(exports.default, {
      cafe: { images: ["photo.webp"], ...cafe },
    }),
  );

test("renders Instagram source tags for both API field names", () => {
  for (const field of ["imageSourceUsernames", "image_source_usernames"]) {
    const html = render({ [field]: ["cafearoundsaigon", "@coffee.photos"] });
    assert.match(html, /https:\/\/www\.instagram\.com\/cafearoundsaigon\//);
    assert.match(html, /https:\/\/www\.instagram\.com\/coffee\.photos\//);
    assert.match(html, /target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /aria-label="@coffee\.photos"/);
    assert.equal((html.match(/<a /g) ?? []).length, 2);
  }
});

test("normalizes duplicates and hides invalid or absent sources", () => {
  const html = render({
    imageSourceUsernames: [
      " @Coffee.Photos ",
      "coffee.photos",
      "",
      null,
      42,
      "javascript:alert(1)",
      "https://evil.test",
      "a/b",
      "a..b",
      "a".repeat(31),
    ],
  });
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.match(html, /@coffee\.photos/);
  for (const source of [undefined, null, [], [""], "coffee.photos"]) {
    assert.equal(render({ imageSourceUsernames: source }), "");
  }
  assert.equal(render({ images: [], imageSourceUsernames: ["coffee.photos"] }), "");
});
