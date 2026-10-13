import * as assert from "node:assert/strict";
import { test } from "node:test";
import type { CafeFilter } from "@/types/cafe";
import { disableNearMe, startNearMeRequest } from "./near-me-request.ts";

type PositionCallbacks = {
  success: PositionCallback;
  error: PositionErrorCallback;
};

function setup(filter: CafeFilter = {}) {
  const callbacks: PositionCallbacks[] = [];
  const changes: CafeFilter[] = [];
  const loading: boolean[] = [];
  const errors: string[] = [];
  const refs = { inFlightRef: { current: false }, requestIdRef: { current: 0 } };
  const options = {
    geolocation: {
      getCurrentPosition(success: PositionCallback, error: PositionErrorCallback) {
        callbacks.push({ success, error });
      },
    } as Geolocation,
    getFilter: () => filter,
    onChange: (next: CafeFilter) => {
      filter = next;
      changes.push(next);
    },
    setLoading: (next: boolean) => loading.push(next),
    onNoSupport: () => errors.push("noSupport"),
    onLocationError: () => errors.push("locationError"),
    ...refs,
  };
  const position = { coords: { latitude: 10.77, longitude: 106.7 } } as GeolocationPosition;
  return { callbacks, changes, errors, loading, options, position };
}

test("rapid near-me clicks create one geolocation request", () => {
  const state = setup();
  startNearMeRequest(state.options);
  startNearMeRequest(state.options);
  assert.equal(state.callbacks.length, 1);
});

test("current success updates the filter once without a location error", () => {
  const state = setup({ search: "coffee" });
  startNearMeRequest(state.options);
  state.callbacks[0].success(state.position);
  assert.deepEqual(state.changes, [{ search: "coffee", nearMe: true, lat: 10.77, lng: 106.7, radiusKm: 2 }]);
  assert.deepEqual(state.loading, [true, false]);
  assert.deepEqual(state.errors, []);
});

test("a stale error after success is ignored", () => {
  const state = setup();
  startNearMeRequest(state.options);
  state.callbacks[0].success(state.position);
  state.callbacks[0].error({} as GeolocationPositionError);
  assert.deepEqual(state.errors, []);
  assert.equal(state.changes.length, 1);
});

test("the current error stops loading without changing the filter", () => {
  const state = setup({ search: "coffee" });
  startNearMeRequest(state.options);
  state.callbacks[0].error({} as GeolocationPositionError);
  assert.deepEqual(state.errors, ["locationError"]);
  assert.deepEqual(state.changes, []);
  assert.deepEqual(state.loading, [true, false]);
});

test("disabling near me invalidates a late callback", () => {
  const state = setup();
  startNearMeRequest(state.options);
  disableNearMe(state.options);
  state.callbacks[0].success(state.position);
  assert.deepEqual(state.changes, []);
  assert.deepEqual(state.loading, [true, false]);
});
