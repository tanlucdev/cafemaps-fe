import { getCafeDistricts, getCafesWithMeta, getNearbyCafes } from "@/lib/api";
import { filterFromSearchParams } from "@/lib/search-state";
import FeaturedSection from "@/app/[locale]/_sections/FeaturedSection";

const PAGE_SIZE = 9;

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
    const cafes = await getNearbyCafes(filter.lat, filter.lng, filter.radiusKm ?? 2, locale);
    return (
      <FeaturedSection
        cafes={cafes}
        locale={locale}
        districts={districts}
        serverMeta={{ total: cafes.length, page: 1, limit: cafes.length, totalPages: 1 }}
      />
    );
  }

  const { cafes, meta } = await getCafesWithMeta(filterWithLimit, locale);
  return <FeaturedSection cafes={cafes} locale={locale} districts={districts} serverMeta={meta} />;
}
