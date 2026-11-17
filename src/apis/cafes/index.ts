import type { CafeFilter } from "@/types/cafe";
import { getNearbyCafes } from "./queries";
import { EN_PURPOSE_VALUES, EN_VIBE_VALUES } from "./filter-normalization";

export { normalizeCafeLocale } from "./mapper";
export { READ_REVALIDATE_SECONDS } from "./constants";
export { ApiError, isUnauthorizedError } from "@/apis/http";
export { voteCafe, unvoteCafe, getMyCafeVotes } from "./votes";
export { trackCafeView, trackCafeViewOnce, type CafeViewResponse } from "./views";
export * from "./queries";
export * from "./submissions";
export * from "@/apis/auth";
export * from "@/apis/saved";

export async function searchNearbyCafes(search: string, locale: string, filter: CafeFilter) {
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
  const cafes = await getNearbyCafes(lat, lng, radiusKm, locale, { fallback: false });
  const query = search.trim().toLocaleLowerCase(locale);
  return cafes
    .filter(
      (cafe) =>
        (!query ||
          [cafe.name, cafe.nameEn].some((name) =>
            name?.toLocaleLowerCase(locale).includes(query),
          )) &&
        (!filter.vibes?.length ||
          filter.vibes.some((vibe) =>
            [...cafe.vibes, ...(cafe.vibesEn ?? [])].some(
              (value) => (EN_VIBE_VALUES[value.toLowerCase()] ?? value) === vibe,
            ),
          )) &&
        (!filter.purposes?.length ||
          filter.purposes.some((purpose) =>
            [...cafe.purposes, ...(cafe.purposesEn ?? [])].some(
              (value) => (EN_PURPOSE_VALUES[value.toLowerCase()] ?? value) === purpose,
            ),
          )),
    )
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    .slice(0, 10);
}
