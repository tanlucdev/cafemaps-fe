import { getCafes, getNearbyCafes } from "@/lib/api";
import { filterFromSearchParams } from "@/lib/search-state";
import FeaturedSection from "@/app/[locale]/_sections/FeaturedSection";

export default async function SearchLoader({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: Record<string, string | string[]>;
}) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (Array.isArray(v)) v.forEach((val) => sp.append(k, val));
    else sp.set(k, v);
  }
  const filter = filterFromSearchParams(sp);
  const cafes =
    filter.nearMe && filter.lat != null && filter.lng != null
      ? await getNearbyCafes(filter.lat, filter.lng, filter.radiusKm ?? 2)
      : await getCafes(filter);

  return <FeaturedSection cafes={cafes} locale={locale} />;
}
