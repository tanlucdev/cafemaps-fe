import { apiFetch } from "@/apis/http";
import { setCafeViewCountOverride } from "./view-count-overrides";

export interface CafeViewResponse {
  viewCount: number;
  counted: boolean;
}

const inFlight = new Map<string, Promise<CafeViewResponse | null>>();

export function trackCafeView(cafeId: string) {
  return apiFetch<CafeViewResponse>(`/cafes/${cafeId}/view`, {
    method: "POST",
    body: JSON.stringify({ source: "detail" }),
  });
}

export function trackCafeViewOnce(cafeId: string) {
  const pending = inFlight.get(cafeId);
  if (pending) return pending;

  const request = trackCafeView(cafeId)
    .then((result) => {
      if (Number.isFinite(result.viewCount)) setCafeViewCountOverride(cafeId, result.viewCount);
      return result;
    })
    .catch(() => null)
    .finally(() => inFlight.delete(cafeId));

  inFlight.set(cafeId, request);
  return request;
}
