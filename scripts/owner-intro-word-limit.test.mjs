import assert from "node:assert/strict";
import test from "node:test";
import {
  limitWords,
  ONE_LINER_WORD_LIMIT,
} from "../src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/model.ts";

test("one-liner keeps at most its configured number of words", () => {
  const value = Array.from({ length: ONE_LINER_WORD_LIMIT + 1 }, (_, index) => `word${index}`).join(
    " ",
  );

  assert.equal(limitWords(value, ONE_LINER_WORD_LIMIT).split(" ").length, ONE_LINER_WORD_LIMIT);
});
