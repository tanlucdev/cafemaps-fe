import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCafeDistricts, getCafesWithMeta, getNearbyDiscoveryCafes } from "@/apis/cafes";
import { cafeListQueryKey } from "@/apis/cafes/query";
import { useAuthState } from "@/components/layout/useAuthState";
import type { Cafe, CafeFilter as Filter } from "@/types/cafe";
import type { ServerMeta } from "./featured-section-helpers";

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
  const { user, isLoggedIn } = useAuthState();
  const authScope = user?.id ? `user:${user.id}` : isLoggedIn ? "member" : "guest";
  const queryKey = cafeListQueryKey(filter, locale, authScope);
  const serializedQueryKey = JSON.stringify(queryKey);
  const [initialQueryKey] = useState(() =>
    JSON.stringify(cafeListQueryKey(serverFilter ?? filter, locale, "guest")),
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
        return getNearbyDiscoveryCafes(filter, locale, { signal });
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
