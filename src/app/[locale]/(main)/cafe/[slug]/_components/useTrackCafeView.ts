"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCafeViewCountOverride } from "@/apis/cafes/view-count-overrides";
import { trackCafeViewOnce } from "@/apis/cafes/views";

function patchCafeViewCount(data: unknown, cafeId: string, viewCount: number): unknown {
  if (!data || typeof data !== "object") return data;
  const record = data as Record<string, unknown>;
  const key = Array.isArray(record.cafes) ? "cafes" : Array.isArray(record.data) ? "data" : null;
  if (!key) return data;
  const cafes = record[key] as Array<Record<string, unknown>>;
  return {
    ...record,
    [key]: cafes.map((cafe) => (cafe.id === cafeId ? { ...cafe, viewCount } : cafe)),
  };
}

export function useTrackCafeView(cafeId: string, initialViewCount?: number | null) {
  const queryClient = useQueryClient();
  const [viewCount, setViewCount] = useState(initialViewCount ?? 0);

  useEffect(() => {
    setViewCount(getCafeViewCountOverride(cafeId) ?? initialViewCount ?? 0);
  }, [cafeId, initialViewCount]);

  useEffect(() => {
    let ignored = false;

    void trackCafeViewOnce(cafeId)
      .then((result) => {
        if (!result) return;
        if (!Number.isFinite(result.viewCount)) return;
        if (!result.counted && getCafeViewCountOverride(cafeId) !== result.viewCount) return;
        queryClient.setQueriesData(
          { predicate: (query) => query.queryKey[0] === "cafes" },
          (data) => patchCafeViewCount(data, cafeId, result.viewCount),
        );
        if (!ignored) setViewCount(result.viewCount);
      })
      .catch(() => undefined);

    return () => {
      ignored = true;
    };
  }, [cafeId, initialViewCount, queryClient]);

  return viewCount;
}
