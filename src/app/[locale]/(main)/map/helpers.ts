import type { useTranslations } from "next-intl";
import type { Cafe } from "@/types/cafe";
import { isCafeOpenNow } from "@/lib/opening-hours";

export type Point = { type: "Point"; coordinates: [number, number] };
export type CafeFeature = {
  type: "Feature";
  geometry: Point;
  properties: { id: string; name: string; visited: boolean };
};
export type CafeCollection = { type: "FeatureCollection"; features: CafeFeature[] };

export function cafeHref(locale: string, cafe: Cafe) {
  return `/${locale}/cafe/${cafe.slug}`;
}

export function cafePoint(cafe: Cafe, visited: boolean): CafeFeature | null {
  if (typeof cafe.lng !== "number" || typeof cafe.lat !== "number") return null;
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [cafe.lng, cafe.lat] },
    properties: { id: cafe.id, name: cafe.name, visited },
  };
}

export function statusLabel(cafe: Cafe, t: ReturnType<typeof useTranslations>) {
  return isCafeOpenNow(cafe) ? t("openNow") : t("unknownHours");
}
