import assert from "node:assert/strict";
import test from "node:test";
import { mapStyle } from "./map-style.ts";

test("map style follows the selected theme", () => {
  assert.equal(mapStyle("light"), "mapbox://styles/mapbox/streets-v12");
  assert.equal(mapStyle("dark"), "mapbox://styles/mapbox/navigation-night-v1");
});
