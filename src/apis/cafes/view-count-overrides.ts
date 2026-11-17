export const CAFE_VIEW_COUNT_OVERRIDE_EVENT = "cafe:view-count-override";

type ViewCountOverride = {
  cafeId: string;
  viewCount: number;
};

const overrides = new Map<string, ViewCountOverride>();

export function getCafeViewCountOverride(cafeId: string) {
  const override = overrides.get(cafeId);
  if (!override || !Number.isFinite(override.viewCount)) return null;
  return override.viewCount;
}

export function setCafeViewCountOverride(cafeId: string, viewCount: number) {
  if (typeof window === "undefined" || !Number.isFinite(viewCount)) return;
  overrides.set(cafeId, { cafeId, viewCount });
  window.dispatchEvent(
    new CustomEvent(CAFE_VIEW_COUNT_OVERRIDE_EVENT, { detail: { cafeId, viewCount } }),
  );
}
