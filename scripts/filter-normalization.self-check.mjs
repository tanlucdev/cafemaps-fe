import assert from "node:assert/strict"
import {
  EN_VIBE_VALUES,
  localizeFilterValues,
} from "../src/apis/cafes/filter-normalization.ts"
import { filterFromSearchParams } from "../src/lib/search-state.ts"

assert.deepEqual(localizeFilterValues(["thiên nhiên"], EN_VIBE_VALUES, "en"), ["nature"])
assert.deepEqual(localizeFilterValues(["Nature"], EN_VIBE_VALUES, "en"), ["nature"])
assert.deepEqual(localizeFilterValues(["NATURE"], EN_VIBE_VALUES, "en"), ["nature"])

const filter = filterFromSearchParams(new URLSearchParams("vibes=Nature"))

assert.deepEqual(filter.vibes, ["thiên nhiên"])
