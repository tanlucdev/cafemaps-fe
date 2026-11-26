export function paymentStatusInterval(
  orderCode: number,
  submittedAt: number,
  expiresAt: number,
  now: number,
) {
  // Keep polling briefly after expiry for a late webhook.
  if (now >= expiresAt + 60_000) return false;
  const age = now - submittedAt;
  const interval = age < 30_000 ? 2_000 : age < 120_000 ? 5_000 : 15_000;
  // Spread polls for orders created together across up to 20% of the interval.
  return interval + Math.floor(interval * (orderCode % 1000) / 5000);
}
