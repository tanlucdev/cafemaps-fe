"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { CafeFilter as Filter } from "@/types/cafe";
import { disableNearMe, invalidateNearMeRequest, startNearMeRequest } from "@/components/cafe/GuidedFilterBar/near-me-request";

export function useNearMe(filter: Filter, onChange: (filter: Filter) => void) {
  const tNearby = useTranslations("nearby");
  const [nearMeLoading, setNearMeLoading] = useState(false);
  const filterRef = useRef(filter);
  const onChangeRef = useRef(onChange);
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    filterRef.current = filter;
    onChangeRef.current = onChange;
  }, [filter, onChange]);

  const onNearMe = useCallback(() => {
    const options = {
      geolocation: typeof navigator === "undefined" ? undefined : navigator.geolocation,
      getFilter: () => filterRef.current,
      onChange: (nextFilter: Filter) => onChangeRef.current(nextFilter),
      setLoading: setNearMeLoading,
      onNoSupport: () => toast.error(tNearby("noSupport")),
      onLocationError: () => toast.error(tNearby("locationError")),
      inFlightRef,
      requestIdRef,
    };
    if (filterRef.current.nearMe || inFlightRef.current) {
      disableNearMe(options);
      return;
    }
    startNearMeRequest(options);
  }, [tNearby]);

  useEffect(() => () => invalidateNearMeRequest({ inFlightRef, requestIdRef }), []);

  return { nearMeLoading, onNearMe };
}
