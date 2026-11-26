import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "use-intl/core";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = new URL(
  "../src/app/[locale]/(main)/cafe/[slug]/_components/CafeDetailInfo/components/AboutSection/index.tsx",
  import.meta.url,
);
const { outputText } = ts.transpileModule(readFileSync(source, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
});

function render(locale, paragraphs, experienceUrls) {
  const messages = require(`../src/messages/${locale}.json`);
  const exports = {};
  runInNewContext(outputText, {
    exports,
    URL,
    require(name) {
      if (name === "next-intl") {
        return { useTranslations: (namespace) => createTranslator({ locale, messages, namespace }) };
      }
      return require(name);
    },
  });
  return renderToStaticMarkup(React.createElement(exports.default, { paragraphs, experienceUrls }));
}

test("experience sources follow the text and link to unique, valid original posts", () => {
  const post = "https://www.instagram.com/p/source/";
  const reel = "https://www.instagram.com/reel/source/";
  const html = render("vi", ["Cafe experience"], [
    ` ${post} `,
    post,
    "javascript:alert(1)",
    "https://",
    null,
    reel,
  ]);
  assert.ok(html.indexOf("Cafe experience") < html.indexOf("<a "));
  assert.equal((html.match(/<a /g) ?? []).length, 2);
  assert.ok(html.includes(`href="${post}" target="_blank" rel="noopener noreferrer"`));
  assert.ok(html.includes(`href="${reel}" target="_blank" rel="noopener noreferrer"`));
  assert.match(html, /aria-label="Xem bài gốc 1 \(mở tab mới\)"/);
  assert.match(html, /aria-label="Xem bài gốc 2 \(mở tab mới\)"/);
  assert.match(render("en", [], [post]), /aria-label="View original post \(opens in a new tab\)"/);
  assert.doesNotMatch(render("vi", ["Cafe experience"], []), /<a /);
  assert.equal(render("vi", [], null), "");
});
