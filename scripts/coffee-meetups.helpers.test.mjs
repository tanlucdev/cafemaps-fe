import assert from "node:assert/strict";
import {
  buildGoogleMapsSearchUrl,
  isValidExternalCafeUrl,
  meetupLocalDateTimeToIso,
  meetupCafePurposes,
} from "../src/apis/coffee-meetups/helpers.ts";
import { mockCoffeeMeetups } from "../src/apis/coffee-meetups/mock.ts";

assert.equal(
  buildGoogleMapsSearchUrl("Okkio", "Quận 1"),
  "https://www.google.com/maps/search/?api=1&query=Okkio%20Qu%E1%BA%ADn%201%20TP.HCM",
);
assert.equal(meetupLocalDateTimeToIso("2026-09-19", "09:30"), "2026-09-19T02:30:00.000Z");
assert.equal(isValidExternalCafeUrl("https://maps.google.com/?q=Okkio"), true);
assert.equal(isValidExternalCafeUrl("javascript:alert(1)"), false);
assert.equal(isValidExternalCafeUrl(""), true);
assert.deepEqual(meetupCafePurposes(0), ["study"]);
assert.deepEqual(meetupCafePurposes(1), ["work"]);
assert.deepEqual(meetupCafePurposes(2), ["group"]);
assert.deepEqual(meetupCafePurposes(3), ["solo"]);
assert.deepEqual(meetupCafePurposes(4), ["friends"]);
assert.deepEqual(meetupCafePurposes(5), ["friends"]);
assert.equal(meetupCafePurposes(6), undefined);
assert.equal(meetupCafePurposes(-1), undefined);

const near2 = mockCoffeeMeetups({ nearMe: true, lat: 10.7758, lng: 106.7009, radiusKm: 2 });
const near10 = mockCoffeeMeetups({ nearMe: true, lat: 10.7758, lng: 106.7009, radiusKm: 10 });
assert.ok(near2.length < near10.length);
assert.ok(near2.every((meetup) => (meetup.cafe?.distanceKm ?? Infinity) <= 2));
