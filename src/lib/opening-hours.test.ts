import * as assert from "node:assert/strict";
import { test } from "node:test";
import { matchesCafeHours, normalizeCafeHoursFilter } from "./opening-hours.ts";

test("hour filters match the API semantics", () => {
  assert.equal(matchesCafeHours({ openingTime: "07:00:00", closingTime: "22:00" }, "open_at_7"), true);
  assert.equal(matchesCafeHours({ openingTime: "1970-01-01T07:00:00.000Z", closingTime: "22:00" }, "open_at_7"), true);
  assert.equal(matchesCafeHours({ openingTime: "07:00:00.000", closingTime: "22:00" }, "open_at_7"), true);
  assert.equal(matchesCafeHours({ openingTime: "07:00:00.001", closingTime: "22:00" }, "open_at_7"), false);
  assert.equal(matchesCafeHours({ openingTime: "06:59:59", closingTime: "22:00" }, "open_at_7"), false);
  assert.equal(matchesCafeHours({ openingTime: "07:00:01", closingTime: "22:00" }, "open_at_7"), false);
  assert.equal(matchesCafeHours({ openingTime: "07:30:00", closingTime: "22:00" }, "open_at_7"), false);
  assert.equal(matchesCafeHours({ openingTime: "08:00:00", closingTime: "22:00" }, "open_at_7"), false);
  assert.equal(matchesCafeHours({ openingTime: null, closingTime: "22:00" }, "open_at_7"), false);
  assert.equal(matchesCafeHours({ openingTime: "00:00", closingTime: "00:00" }, "open_24h"), true);
  assert.equal(matchesCafeHours({ openingTime: "00:00", closingTime: "23:59" }, "open_24h"), false);
  assert.equal(matchesCafeHours({ openingTime: "00:00:01", closingTime: "00:00:00" }, "open_24h"), false);
  assert.equal(matchesCafeHours({ openingTime: null, closingTime: null }, "open_24h"), false);
});

test("legacy hour value canonicalizes", () => {
  assert.equal(normalizeCafeHoursFilter("from_7"), "open_at_7");
  assert.equal(normalizeCafeHoursFilter("open_at_7"), "open_at_7");
  assert.equal(normalizeCafeHoursFilter("after_7"), undefined);
});
