import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function load(path, dependencies = {}) {
  const { outputText } = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  new Function("require", "module", "exports", outputText)(
    (name) => dependencies[name] ?? {},
    module,
    module.exports,
  );
  return module.exports;
}

let failure = false;
const calls = [];
const cafes = Array.from({ length: 12 }, (_, index) => ({
  id: String(index),
  name: `Quán ${index}`,
  nameEn: `Cafe ${index}`,
  vibes: [index === 0 ? "nhộn nhịp" : "yên tĩnh"],
  purposes: [index === 1 ? "học tập" : "làm việc"],
  distanceKm: index / 10,
})).reverse();
const { searchNearbyCafes } = load("../src/apis/cafes/index.ts", {
  "./filter-normalization": load("../src/apis/cafes/filter-normalization.ts"),
  "./queries": {
    getNearbyCafes: async (...args) => {
      calls.push(args);
      if (failure) throw new Error("API unavailable");
      return cafes;
    },
  },
});
const filter = { lat: 10.77, lng: 106.7, radiusKm: 5 };
assert.equal((await searchNearbyCafes("", "vi", filter)).length, 10);
const matched = await searchNearbyCafes("", "vi", {
  ...filter,
  purposes: ["work"],
  vibes: ["quiet"],
});
assert.deepEqual(
  matched.map(({ id }) => id),
  Array.from({ length: 10 }, (_, i) => String(i + 2)),
);
assert.deepEqual(calls[0], [10.77, 106.7, 5, "vi", { fallback: false }]);
assert.equal((await searchNearbyCafes(" CAFE 11 ", "en", filter))[0].id, "11");
assert.deepEqual(await searchNearbyCafes("missing", "vi", filter), []);
assert.equal((await searchNearbyCafes("", "vi", { lat: 0, lng: 0 })).length, 10);
for (const invalid of [{ lat: NaN }, { lng: 181 }, { radiusKm: -1 }, { lat: undefined }]) {
  await assert.rejects(
    searchNearbyCafes("", "vi", { ...filter, ...invalid }),
    /Invalid nearby location/,
  );
}
failure = true;
await assert.rejects(searchNearbyCafes("", "vi", filter), /API unavailable/);
console.log(
  "Meetup nearby passed: combined filters, bilingual names, distance order, limit, coordinates, API errors.",
);
