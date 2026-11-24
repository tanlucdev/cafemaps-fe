import { useEffect, useState } from "react";
import { getCafesWithMeta, searchNearbyCafes } from "@/apis/cafes";
import { EN_TAG_VALUES, localizeFilterValues } from "@/apis/cafes/filter-normalization";
import { isCafeOpenNow } from "@/lib/opening-hours";
import { meetupCafePurposes } from "@/apis/coffee-meetups/helpers";
import type { Cafe, CafeFilter } from "@/types/cafe";

const PAGE_SIZE = 24;

function matchesNearbyFilters(cafe: Cafe, filter: CafeFilter) {
  if (filter.districts?.length && !filter.districts.some((district) => district === cafe.district || district === cafe.districtEn)) return false;
  if (filter.openNow && !isCafeOpenNow(cafe)) return false;
  const tags = localizeFilterValues(filter.tags, EN_TAG_VALUES, "en");
  if (tags?.length && ![...cafe.tags, ...(cafe.tagsEn ?? [])].some((tag) => {
    const key = tag.trim().toLowerCase();
    return tags.includes(EN_TAG_VALUES[key] ?? key);
  })) return false;

  const { priceMin, priceMax } = cafe;
  switch (filter.priceRange) {
    case "under_50k": return priceMax != null && priceMax <= 50_000;
    case "price_50k_100k": return priceMin != null && priceMin >= 50_000 && priceMax != null && priceMax <= 100_000;
    case "price_100k_150k": return priceMin != null && priceMin >= 100_000 && priceMax != null && priceMax <= 150_000;
    case "above_150k": return priceMin != null && priceMin >= 150_000;
    default: return true;
  }
}

export function useCafeSearch({
  enabled,
  cafeQuery,
  locale,
  purpose,
  filter,
  page,
}: {
  enabled: boolean;
  cafeQuery: string;
  locale: string;
  purpose: string;
  filter: CafeFilter;
  page: number;
}) {
  const [results, setResults] = useState<Cafe[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const controller = new AbortController();
    setSearching(true);
    setError(false);
    if (page === 1) setResults([]);
    const cafeFilter = {
      ...filter,
      purposes: filter.purposes?.length ? filter.purposes : meetupCafePurposes(purpose),
    };
    const timer = setTimeout(async () => {
      try {
        const response = filter.nearMe
          ? await searchNearbyCafes(cafeQuery, locale, cafeFilter, controller.signal, Infinity).then((cafes) => {
              const matching = cafes.filter((cafe) => matchesNearbyFilters(cafe, cafeFilter));
              return {
                cafes: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
                meta: { total: matching.length, totalPages: Math.ceil(matching.length / PAGE_SIZE) },
              };
            })
          : await getCafesWithMeta(
              { ...cafeFilter, search: cafeQuery.trim(), page, limit: PAGE_SIZE },
              locale,
              { fallback: false, signal: controller.signal },
            );
        if (!active) return;
        setResults((current) =>
          page === 1
            ? response.cafes
            : [
                ...current,
                ...response.cafes.filter((cafe) => !current.some(({ id }) => id === cafe.id)),
              ],
        );
        setTotal(response.meta.total);
        setHasMore(page < response.meta.totalPages);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setSearching(false);
      }
    }, 250);
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [enabled, cafeQuery, locale, purpose, filter, page, retryCount]);

  return {
    results,
    searching,
    hasMore,
    total,
    error,
    retry: () => setRetryCount((current) => current + 1),
  };
}
