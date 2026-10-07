import assert from "node:assert/strict";
import test from "node:test";
import {
  districtKey,
  includesDistrict,
  normalizeDistricts,
  parseDistrictParams,
  serializeDistricts,
} from "../src/lib/district-filter.ts";

const AREAS = ["Quận 1", "Quận 3", "Quận 4", "Quận 5"];

test("district params parse canonical, legacy, detected district", () => {
  assert.equal(parseDistrictParams(null, null, undefined, AREAS), undefined);
  assert.deepEqual(parseDistrictParams(" Quận 3 ", null, undefined, AREAS), ["Quận 3"]);
  assert.deepEqual(
    parseDistrictParams("Quận 3,,Quận 1,Quận 3", "Quận 4", undefined, AREAS),
    ["Quận 1", "Quận 3"],
  );
  assert.deepEqual(parseDistrictParams(null, "Quận 4", undefined, AREAS), ["Quận 4"]);
  assert.deepEqual(parseDistrictParams(null, null, "Quận 5", AREAS), ["Quận 5"]);
  assert.deepEqual(parseDistrictParams("invalid", "Quận 4", "Quận 5", AREAS), ["Quận 4"]);
});

test("district params serialize canonical CSV and query encoding", () => {
  const districts = normalizeDistricts(["Quận 3", "", "Quận 1", "Quận 3"], AREAS);
  assert.deepEqual(districts, ["Quận 1", "Quận 3"]);
  assert.equal(serializeDistricts(districts, AREAS), "Quận 1,Quận 3");
  assert.equal(new URLSearchParams({ districts: serializeDistricts(districts, AREAS) }).toString(), "districts=Qu%E1%BA%ADn+1%2CQu%E1%BA%ADn+3");
});

test("district filter uses OR semantics and cache keys differ", () => {
  assert.equal(includesDistrict(["Quận 1", "Quận 3"], "Quận 3"), true);
  assert.equal(includesDistrict(["Quận 1", "Quận 3"], "Quận 4"), false);
  assert.notEqual(districtKey(["Quận 1"], AREAS), districtKey(["Quận 3"], AREAS));
});
