import assert from "node:assert/strict";
import test from "node:test";
import {
  persistTheme,
  readStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  themeColor,
} from "./theme.ts";

test("theme preferences default safely and preserve dark", () => {
  assert.equal(THEME_STORAGE_KEY, "cafe-maps-theme");
  assert.equal(resolveTheme(null), "light");
  assert.equal(resolveTheme("system"), "light");
  assert.equal(resolveTheme("dark"), "dark");
  assert.equal(readStoredTheme(() => ({ getItem: () => null })), "light");
  assert.equal(readStoredTheme(() => ({ getItem: () => "system" })), "light");
  assert.equal(readStoredTheme(() => ({ getItem: () => "dark" })), "dark");
  assert.equal(readStoredTheme(() => ({ getItem: () => { throw new Error("blocked"); } })), "light");
  assert.equal(readStoredTheme(() => { throw new Error("blocked"); }), "light");
  assert.equal(themeColor(resolveTheme("dark")), "#24211D");
  assert.equal(themeColor(resolveTheme(null)), "#fdf6ec");
});

test("theme persistence writes only when toggled", () => {
  const writes: string[][] = [];
  persistTheme("dark", () => ({ setItem: (key, value) => writes.push([key, value]) }));
  persistTheme("light", () => { throw new Error("blocked"); });
  assert.deepEqual(writes, [[THEME_STORAGE_KEY, "dark"]]);
});
