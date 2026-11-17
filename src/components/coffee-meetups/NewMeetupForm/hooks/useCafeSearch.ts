import { useEffect, useState } from "react";
import { searchCafes, searchNearbyCafes } from "@/apis/cafes";
import { meetupCafePurposes } from "@/apis/coffee-meetups/helpers";
import type { Cafe, CafeFilter } from "@/types/cafe";

export function useCafeSearch({
  cafes,
  cafeQuery,
  locale,
  hasPurpose,
  purposeIndex,
  vibe,
  nearby,
  setError,
  loadError,
}: {
  cafes: Cafe[];
  cafeQuery: string;
  locale: string;
  hasPurpose: boolean;
  purposeIndex: number;
  vibe: string;
  nearby: CafeFilter;
  setError: (error: string) => void;
  loadError: string;
}) {
  const [results, setResults] = useState(cafes);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!hasPurpose && !vibe && !nearby.nearMe) {
      setResults([]);
      setSearching(false);
      return;
    }
    let active = true;
    setError("");
    setSearching(true);
    const filter = {
      ...nearby,
      purposes: meetupCafePurposes(purposeIndex),
      vibes: vibe ? [vibe] : undefined,
    };
    const request = nearby.nearMe
      ? searchNearbyCafes(cafeQuery, locale, filter)
      : searchCafes(cafeQuery, locale, filter);
    request
      .then((data) => {
        if (active) setResults(data);
      })
      .catch(() => {
        if (active) {
          setResults([]);
          setError(loadError);
        }
      })
      .finally(() => {
        if (active) setSearching(false);
      });
    return () => {
      active = false;
    };
  }, [cafeQuery, hasPurpose, purposeIndex, vibe, nearby, locale, loadError, setError]);

  return { results, searching };
}
