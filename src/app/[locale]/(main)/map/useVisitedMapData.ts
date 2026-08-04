"use client";

import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/apis/http";
import { getVisitedCafeEntries } from "@/apis/visited";
import { getCurrentAccessToken } from "@/lib/auth-client";
import type { Cafe } from "@/types/cafe";

export function useVisitedMapData({
  initialCafes,
  initialVisitedIds,
  locale,
  onUnauthorized,
}: {
  initialCafes: Cafe[];
  initialVisitedIds: string[];
  locale: string;
  onUnauthorized: () => void;
}) {
  const [cafes, setCafes] = useState(initialCafes);
  const [visitedIds, setVisitedIds] = useState(() => new Set(initialVisitedIds));

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = await getCurrentAccessToken();
      if (!token) return onUnauthorized();
      try {
        const entries = await getVisitedCafeEntries(token, locale);
        if (!alive) return;
        setCafes(entries.map((entry) => entry.cafe));
        setVisitedIds(new Set(entries.map((entry) => entry.cafe.id)));
      } catch (error) {
        if (isUnauthorizedError(error)) onUnauthorized();
      }
    })();
    return () => {
      alive = false;
    };
  }, [locale, onUnauthorized]);

  return { cafes, visitedIds, setVisitedIds };
}
