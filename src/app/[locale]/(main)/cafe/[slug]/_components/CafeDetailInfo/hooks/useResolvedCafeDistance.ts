import { useEffect, useState } from "react";
import { getNearbyCafes } from "@/lib/api";
import { getLastSearchState } from "@/lib/search-state";
import type { Cafe } from "@/types/cafe";
import { calculateDistanceKm } from "../helpers";
import type { ResolvedDistance } from "../types";

export function useResolvedCafeDistance(cafe: Cafe, locale: string): ResolvedDistance {
  const [resolvedDistance, setResolvedDistance] = useState<ResolvedDistance>({
    distanceKm: cafe.distanceKm,
    distanceMode: cafe.distanceMode,
    durationMin: cafe.durationMin,
  });

  useEffect(() => {
    if (cafe.distanceKm != null) {
      setResolvedDistance({
        distanceKm: cafe.distanceKm,
        distanceMode: cafe.distanceMode,
        durationMin: cafe.durationMin,
      });
      return;
    }

    let cancelled = false;
    const lastSearch = getLastSearchState();
    const fromLat = lastSearch?.filter.lat;
    const fromLng = lastSearch?.filter.lng;
    if (fromLat == null || fromLng == null || cafe.lat == null || cafe.lng == null) {
      setResolvedDistance({});
      return;
    }

    const originLat = fromLat;
    const originLng = fromLng;
    const searchRadiusKm = lastSearch?.filter.radiusKm ?? 2;

    setResolvedDistance({
      distanceKm: calculateDistanceKm(originLat, originLng, cafe.lat, cafe.lng),
      distanceMode: "straight",
    });

    async function resolveRouteDistance() {
      const nearbyCafes = await getNearbyCafes(originLat, originLng, searchRadiusKm, locale);
      if (cancelled) return;

      const routeCafe = nearbyCafes.find(
        (nearbyCafe) => nearbyCafe.id === cafe.id || nearbyCafe.slug === cafe.slug,
      );
      if (routeCafe?.distanceKm == null) return;

      setResolvedDistance({
        distanceKm: routeCafe.distanceKm,
        distanceMode: routeCafe.distanceMode,
        durationMin: routeCafe.durationMin,
      });
    }

    void resolveRouteDistance();

    return () => {
      cancelled = true;
    };
  }, [
    cafe.distanceKm,
    cafe.distanceMode,
    cafe.durationMin,
    cafe.id,
    cafe.lat,
    cafe.lng,
    cafe.slug,
    locale,
  ]);

  return resolvedDistance;
}
