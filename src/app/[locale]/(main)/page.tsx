import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getCafeDistricts, getCafesWithMeta } from "@/apis/cafes";
import { getRecentlyViewed, type RecentlyViewedCafe } from "@/apis/recently-viewed";
import { createLocalizedMetadata } from "@/lib/metadata";
import { filterFromSearchParams, sortFromSearchParams } from "@/lib/search-state";
import { createHomeJsonLd, stringifyJsonLd } from "@/lib/structured-data";
import { routing } from "@/i18n/routing";
import FeaturedSection from "../_sections/FeaturedSection";
import { PAGE_SIZE } from "../_sections/featured-section-helpers";
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys";
// import HomeSeoContent from "../_sections/HomeSeoContent";

export const revalidate = 300;

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function withHomeSsrTimeout<T>(run: () => Promise<T>, ms: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error("Timed out"));
        }, ms);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return createLocalizedMetadata({
    locale,
    title: t("title"),
    absoluteTitle: true,
    description: t("description"),
  });
}

function toUrlSearchParams(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== undefined) query.set(key, value);
  }
  return query;
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  // Request-time auth must be read before the cached API boundary.
  const accessToken = (await cookies()).get(AUTH_COOKIE_KEYS.accessToken)?.value;
  const normalizedLocale = locale === "en" ? "en" : routing.defaultLocale;
  const urlSearchParams = toUrlSearchParams(await searchParams);
  const parsedFilter = filterFromSearchParams(urlSearchParams);
  const initialFilter = {
    ...parsedFilter,
    page: parsedFilter.page ?? 1,
    limit: PAGE_SIZE,
    sort: sortFromSearchParams(urlSearchParams),
  };
  const jsonLd = createHomeJsonLd(normalizedLocale);
  let initialData: (Awaited<ReturnType<typeof getCafesWithMeta>> & { districts: string[] }) | null =
    null;
  const recentlyViewedPromise: Promise<RecentlyViewedCafe[]> = accessToken
    ? withHomeSsrTimeout(() => getRecentlyViewed(accessToken, normalizedLocale, 3), 1500).catch(
        () => [],
      )
    : Promise.resolve([]);

  if (!initialFilter.nearMe) {
    try {
      // ponytail: hardcoded 5000ms ceiling; upgrade to env/observability when latency data exists.
      const [data, districts] = await withHomeSsrTimeout(
        () =>
          Promise.all([
            getCafesWithMeta(initialFilter, locale, {
              fallback: false,
              headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
            }),
            getCafeDistricts(locale, { fallback: false }),
          ]),
        5000,
      );
      initialData = { ...data, districts };
    } catch (error) {
      console.warn("Home SSR data unavailable:", error);
      initialData = null;
    }
  }
  const recentlyViewed = await recentlyViewedPromise;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />
      {initialData ? (
        <FeaturedSection
          cafes={initialData.cafes}
          districts={initialData.districts}
          locale={locale}
          serverMeta={initialData.meta}
          serverFilter={initialFilter}
          deferData={false}
          recentlyViewed={recentlyViewed}
        />
      ) : (
        <FeaturedSection cafes={[]} locale={locale} deferData recentlyViewed={recentlyViewed} />
      )}
      {/* <HomeSeoContent locale={locale} /> */}
    </>
  );
}
