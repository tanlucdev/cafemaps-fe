import type { CafeFilter } from "@/types/cafe";
import { getNearbyCafes } from "./queries";

export { normalizeCafeLocale } from "./mapper";
export { READ_REVALIDATE_SECONDS } from "./constants";
export { ApiError, isUnauthorizedError } from "@/apis/http";
export { voteCafe, unvoteCafe, getMyCafeVotes } from "./votes";
export { trackCafeView, trackCafeViewOnce, type CafeViewResponse } from "./views";
export { getSimilarCafes } from "@/apis/chains";
export * from "./queries";
export * from "./submissions";
export * from "@/apis/auth";
export * from "@/apis/saved";

export async function searchNearbyCafes(search: string, locale: string, filter: CafeFilter, signal?: AbortSignal, limit = 10) {
  const { lat, lng, radiusKm = 2 } = filter;
  if (
    lat == null ||
    lng == null ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180 ||
    !Number.isFinite(radiusKm) ||
    radiusKm <= 0
  ) {
    throw new Error("Invalid nearby location");
  }
  const cafes = await getNearbyCafes(lat, lng, radiusKm, locale, { fallback: false, signal }, { ...filter, search: search.trim() });
  return cafes.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)).slice(0, limit);
}
