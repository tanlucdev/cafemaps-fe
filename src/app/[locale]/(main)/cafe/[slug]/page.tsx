import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getCafeBySlug } from "@/lib/api";
import { createLocalizedMetadata, getSiteUrl } from "@/lib/metadata";
import CafeDetailContent from "./_components/CafeDetailContent";
import { getSimilarCafes } from "@/apis/chains";
import CafeCard from "@/components/cafe/CafeCard";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const getCafe = cache((slug: string, locale: string) => getCafeBySlug(slug, locale));

export const revalidate = 300;
export const dynamic = "force-dynamic";

function getDescription(cafe: NonNullable<Awaited<ReturnType<typeof getCafeBySlug>>>) {
  return cafe.oneLiner ?? cafe.description ?? undefined;
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
    image: cafe.images,
    url: new URL(`/${locale}/cafe/${cafe.slug}`, getSiteUrl()).toString(),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const cafe = await getCafe(slug, locale);

  if (!cafe) {
    return {
      title: "Cafe not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    ...createLocalizedMetadata({
      locale,
      pathname: `/cafe/${cafe.slug}`,
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
      url: `/${locale}/cafe/${cafe.slug}`,
      ...getOpenGraphLocale(locale),
      type: "website",
    },
  };
}

export default async function CafeDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const cafe = await getCafe(slug, locale);

  if (!cafe) notFound();

  const jsonLd = createCafeJsonLd(cafe, locale);
  let similar = [] as Awaited<ReturnType<typeof getSimilarCafes>>;
  try {
    similar = await getSimilarCafes(slug, locale);
  } catch {
    similar = [];
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CafeDetailContent
        cafe={cafe}
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
                      className="similar-marquee-group flex flex-nowrap"
                      aria-hidden={duplicate || undefined}
                      inert={duplicate || undefined}
                    >
                      {similar.map((item, index) => (
                        <div key={`${duplicate ? "copy-" : ""}${item.cafe.id}`} className="similar-marquee-card w-[min(76vw,280px)] min-w-[min(76vw,280px)] shrink-0">
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
