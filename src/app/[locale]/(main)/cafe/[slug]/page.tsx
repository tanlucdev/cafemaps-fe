import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { getCafeBySlug } from "@/apis/cafes";
import { createLocalizedMetadata, getSiteUrl } from "@/lib/metadata";
import CafeDetailAccess from "./_components/CafeDetailAccess";
import CafeDetailLoading from "./_components/CafeDetailLoading";
import { getSimilarCafes } from "@/apis/chains";
import CafeCard from "@/components/cafe/CafeCard";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const getCafe = cache(async (slug: string, locale: string) => {
  const cafe = await getCafeBySlug(slug, locale, { fallback: false });
  if (!cafe) notFound();
  return cafe;
});

export const revalidate = 300;
export const dynamic = "force-dynamic";

function getDescription(cafe: NonNullable<Awaited<ReturnType<typeof getCafeBySlug>>>) {
  return cafe.oneLiner ?? undefined;
}

function getOpenGraphLocale(locale: string) {
  return {
    locale: locale === "vi" ? "vi_VN" : "en_US",
    alternateLocale: locale === "vi" ? ["en_US"] : ["vi_VN"],
  };
}

function createCafeJsonLd(
  cafe: NonNullable<Awaited<ReturnType<typeof getCafeBySlug>>>,
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafe.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: cafe.address,
      addressLocality: cafe.district,
      addressRegion: "TP.HCM",
      addressCountry: "VN",
    },
    ...(cafe.openingTime &&
      cafe.closingTime && {
        openingHours: `${cafe.openingTime.slice(0, 5)}-${cafe.closingTime.slice(0, 5)}`,
      }),
    image: cafe.coverImage ?? undefined,
    url: new URL(`/${locale}/cafe/${encodeURIComponent(cafe.slug)}`, getSiteUrl()).toString(),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const cafe = await getCafe(slug, locale);

  return {
    ...createLocalizedMetadata({
      locale,
      pathname: `/cafe/${encodeURIComponent(cafe.slug)}`,
      title: cafe.name,
      description: getDescription(cafe),
      image: cafe.coverImage ?? undefined,
      imageAlt: cafe.name,
    }),
    openGraph: {
      title: cafe.name,
      description: getDescription(cafe),
      images: cafe.coverImage
        ? [{ url: cafe.coverImage, width: 1200, height: 630, alt: cafe.name }]
        : [],
      siteName: "Cafe Maps",
      url: `/${locale}/cafe/${encodeURIComponent(cafe.slug)}`,
      ...getOpenGraphLocale(locale),
      type: "website",
    },
  };
}

export default async function CafeDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const cafe = await getCafe(slug, locale);

  return (
    <Suspense fallback={<CafeDetailLoading />}>
      <CafeDetail cafe={cafe} locale={locale} />
    </Suspense>
  );
}

async function CafeDetail({
  cafe,
  locale,
}: {
  cafe: NonNullable<Awaited<ReturnType<typeof getCafeBySlug>>>;
  locale: string;
}) {
  const jsonLd = createCafeJsonLd(cafe, locale);
  let similar = [] as Awaited<ReturnType<typeof getSimilarCafes>>;
  try {
    similar = await getSimilarCafes(cafe.slug, locale);
  } catch {
    similar = [];
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CafeDetailAccess
        key={`${locale}:${cafe.id}`}
        preview={cafe}
        locale={locale}
        aboveReviews={
          similar.length ? (
            <section className="mx-auto mt-8 w-full max-w-full">
              <h2 className="mb-4 text-2xl font-black">
                {locale === "vi" ? "Gợi ý cùng vibe" : "Similar vibe"}
              </h2>
              <div className="similar-marquee" tabIndex={0}>
                <div className="similar-marquee-track flex flex-nowrap">
                  {[false, true].map((duplicate) => (
                    <div
                      key={duplicate ? "similar-copy" : "similar-original"}
                      className="similar-marquee-group"
                      aria-hidden={duplicate || undefined}
                      inert={duplicate || undefined}
                    >
                      {similar.map((item, index) => (
                        <div key={`${duplicate ? "copy-" : ""}${item.cafe.id}`} className="similar-marquee-card">
                          <CafeCard cafe={item.cafe} locale={locale} index={index} mobileCompact />
                          <p className="mt-2 text-xs font-bold text-[var(--foreground-muted)]">
                            {locale === "vi" ? `Cùng vibe ${item.matchedVibe}` : `Same vibe: ${item.matchedVibe}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null
        }
      />
    </>
  );
}
