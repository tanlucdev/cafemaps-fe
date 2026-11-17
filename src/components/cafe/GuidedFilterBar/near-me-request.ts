import type { CafeFilter } from "@/types/cafe";

export interface MutableRef<T> {
  current: T;
}

interface NearMeRequestOptions {
  geolocation?: Geolocation;
  getFilter: () => CafeFilter;
  onChange: (filter: CafeFilter) => void;
  setLoading: (loading: boolean) => void;
  onNoSupport: () => void;
  onLocationError: () => void;
  inFlightRef: MutableRef<boolean>;
  requestIdRef: MutableRef<number>;
}

function isCurrentRequest({ inFlightRef, requestIdRef }: NearMeRequestOptions, requestId: number) {
  return inFlightRef.current && requestIdRef.current === requestId;
}

export function startNearMeRequest(options: NearMeRequestOptions) {
  if (options.inFlightRef.current) return;
  if (!options.geolocation) {
    options.onNoSupport();
    return;
  }

  const requestId = ++options.requestIdRef.current;
  options.inFlightRef.current = true;
  options.setLoading(true);
  options.geolocation.getCurrentPosition(
    (position) => {
      if (!isCurrentRequest(options, requestId)) return;
      options.inFlightRef.current = false;
      try {
        const filter = options.getFilter();
        options.onChange({
          ...filter,
          nearMe: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          radiusKm: filter.radiusKm ?? 2,
        });
      } finally {
        options.setLoading(false);
      }
    },
    () => {
      if (!isCurrentRequest(options, requestId)) return;
      options.inFlightRef.current = false;
      try {
        options.onLocationError();
      } finally {
        options.setLoading(false);
      }
    },
    { timeout: 10000, maximumAge: 60000 },
  );
}

export function disableNearMe(options: NearMeRequestOptions) {
  options.requestIdRef.current += 1;
  options.inFlightRef.current = false;
  options.setLoading(false);
  const filter = options.getFilter();
  if (filter.nearMe)
    options.onChange({ ...filter, nearMe: false, lat: undefined, lng: undefined, radiusKm: undefined });
}

export function invalidateNearMeRequest({ inFlightRef, requestIdRef }: Pick<NearMeRequestOptions, "inFlightRef" | "requestIdRef">) {
  requestIdRef.current += 1;
  inFlightRef.current = false;
}
