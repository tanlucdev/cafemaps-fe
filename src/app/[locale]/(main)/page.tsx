import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCafeDistricts, getCafesWithMeta } from "@/apis/cafes";
import { createLocalizedMetadata } from "@/lib/metadata";
import { filterFromSearchParams, sortFromSearchParams } from "@/lib/search-state";
import { createHomeJsonLd, stringifyJsonLd } from "@/lib/structured-data";
import { routing } from "@/i18n/routing";
import FeaturedSection from "../_sections/FeaturedSection";
import { PAGE_SIZE } from "../_sections/featured-section-helpers";
// import HomeSeoContent from "../_sections/HomeSeoContent";

type HomeSearchParams = Record<string, string | string[] | undefined>;

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<HomeSearchParams>;
}

function createHomeSearchParams(searchParams: HomeSearchParams = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  }
  return params;
}

async function withHomeSsrTimeout<T>(
  run: (signal: AbortSignal) => Promise<T>,
  ms: number,
): Promise<T> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(controller.signal),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort();
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

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  const normalizedLocale = locale === "en" ? "en" : routing.defaultLocale;
  const urlSearchParams = createHomeSearchParams(await searchParams);
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

  if (!initialFilter.nearMe) {
    try {
      // ponytail: hardcoded 1500ms ceiling; upgrade to env/observability when latency data exists.
      const [data, districts] = await withHomeSsrTimeout(
        (signal) =>
          Promise.all([
            getCafesWithMeta(initialFilter, locale, { fallback: false, signal }),
            getCafeDistricts(locale, { fallback: false, signal }),
          ]),
        1500,
      );
      initialData = { ...data, districts };
    } catch {
      initialData = null;
    }
  }

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
          deferData={false}
        />
      ) : (
        <FeaturedSection cafes={[]} locale={locale} deferData />
      )}
      {/* <HomeSeoContent locale={locale} /> */}
    </>
  );
}
