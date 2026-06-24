import { getCafeDistricts, getCafesWithMeta, getNearbyCafes } from "@/lib/api";
import { isCafeOpenNow } from "@/lib/opening-hours";
import { filterFromSearchParams } from "@/lib/search-state";
import FeaturedSection from "@/app/[locale]/_sections/FeaturedSection";
import type { Cafe, CafeFilter } from "@/types/cafe";

const PAGE_SIZE = 9;

function filterNearbyCafes(cafes: Cafe[], filter: CafeFilter): Cafe[] {
  return cafes.filter((cafe) => {
    if (filter.openNow && !isCafeOpenNow(cafe)) return false;
    if (filter.vibes?.length && !filter.vibes.some((vibe) => cafe.vibes.includes(vibe))) return false;
    if (
      filter.purposes?.length &&
      !filter.purposes.some((purpose) => cafe.purposes.includes(purpose))
    ) {
      return false;
    }
    if (filter.tags?.length && !filter.tags.some((tag) => cafe.tags.includes(tag))) return false;
    if (filter.district && cafe.district !== filter.district) return false;
    return true;
  });
}

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
  const filterWithLimit = { ...filter, limit: PAGE_SIZE };
  const districts = await getCafeDistricts(locale);

  if (filter.nearMe && filter.lat != null && filter.lng != null) {
    const nearbyCafes = await getNearbyCafes(filter.lat, filter.lng, filter.radiusKm ?? 2, locale);
    const cafes = filterNearbyCafes(nearbyCafes, filter);
    return (
      <FeaturedSection
        cafes={cafes}
        locale={locale}
        districts={districts}
        serverMeta={{ total: cafes.length, page: 1, limit: cafes.length, totalPages: 1 }}
      />
    );
  }

  const { cafes, meta } = await getCafesWithMeta(filterWithLimit, locale, { cache: "no-store" });
  return <FeaturedSection cafes={cafes} locale={locale} districts={districts} serverMeta={meta} />;
}
