import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCafeDistricts, getCafesWithMeta, getNearbyCafes } from "@/lib/api";
import { cafeListQueryKey } from "@/apis/cafes/query";
import type { Cafe, CafeFilter as Filter } from "@/types/cafe";
import { filterNearbyCafes, type ServerMeta } from "./featured-section-helpers";

export function useFeaturedSectionData({
  cafes,
  deferData,
  districts,
  filter,
  locale,
  serverFilter,
  serverMeta,
}: {
  cafes: Cafe[];
  deferData: boolean;
  districts?: string[];
  filter: Filter;
  locale: string;
  serverFilter?: Filter;
  serverMeta?: ServerMeta;
}) {
  const queryKey = cafeListQueryKey(filter, locale);
  const serializedQueryKey = JSON.stringify(queryKey);
  const [initialQueryKey] = useState(() =>
    JSON.stringify(cafeListQueryKey(serverFilter ?? filter, locale)),
  );
  const shouldFetchCafes =
    deferData || (!deferData && Boolean(serverMeta) && serializedQueryKey !== initialQueryKey);
  const districtsQuery = useQuery({
    queryKey: ["cafe-districts", locale],
    queryFn: () => getCafeDistricts(locale),
    enabled: deferData,
    staleTime: 60 * 60 * 1000,
  });
  const cafesQuery = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (filter.nearMe && filter.lat != null && filter.lng != null) {
        const nearbyCafes = await getNearbyCafes(
          filter.lat,
          filter.lng,
          filter.radiusKm ?? 2,
          locale,
        );
        const nextCafes = filterNearbyCafes(nearbyCafes, filter);
        return {
          cafes: nextCafes,
          meta: { total: nextCafes.length, page: 1, limit: nextCafes.length, totalPages: 1 },
        };
      }

      return getCafesWithMeta(filter, locale, { signal });
    },
    enabled: shouldFetchCafes,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  return {
    activeCafes: shouldFetchCafes ? (cafesQuery.data?.cafes ?? cafes) : cafes,
    activeDistricts: deferData ? (districtsQuery.data ?? districts) : districts,
    activeMeta: shouldFetchCafes ? cafesQuery.data?.meta : serverMeta,
    cafesQuery,
    dataError: shouldFetchCafes && cafesQuery.isError,
    shouldFetchCafes,
  };
}
