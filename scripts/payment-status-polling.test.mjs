import assert from "node:assert/strict";
import { test } from "node:test";
import { paymentStatusInterval } from "../src/apis/payments/status-polling.ts";

test("payment status polling backs off, staggers requests and stops after the expiry grace period", () => {
  const started = 1_700_000_000_000;
  const expires = started + 15 * 60_000;
  assert.equal(paymentStatusInterval(1000, started, expires, started), 2000);
  assert.equal(paymentStatusInterval(1500, started, expires, started), 2200);
  assert.equal(paymentStatusInterval(1500, started, expires, started + 30_000), 5500);
  assert.equal(paymentStatusInterval(1500, started, expires, started + 120_000), 16_500);
  assert.equal(paymentStatusInterval(1500, started, expires, expires + 59_999), 16_500);
  assert.equal(paymentStatusInterval(1500, started, expires, expires + 60_000), false);
});
