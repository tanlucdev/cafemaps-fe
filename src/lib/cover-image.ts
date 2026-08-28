import type { Cafe } from "@/types/cafe";

export function coverObjectPosition(cafe: Pick<Cafe, "coverImageCrop">) {
  const crop = cafe.coverImageCrop;
  return `${crop?.x ?? 50}% ${crop?.y ?? 50}%`;
}
