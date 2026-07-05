import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { getCafeBySlug, getCafesWithMeta } from "@/lib/api"
import { CAFE_API_PAGE_SIZE_LIMIT } from "@/apis/cafes/constants"
import { routing } from "@/i18n/routing"
import { createLocalizedMetadata, getSiteUrl } from "@/lib/metadata"
import CafeDetailContent from "./_components/CafeDetailContent"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

const getCafe = cache((slug: string, locale: string) => getCafeBySlug(slug, locale))

export const revalidate = 300
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const byLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      let firstPage: Awaited<ReturnType<typeof getCafesWithMeta>>
      let extraPages: Array<Awaited<ReturnType<typeof getCafesWithMeta>>>

      try {
        firstPage = await getCafesWithMeta(
          { page: 1, limit: CAFE_API_PAGE_SIZE_LIMIT },
          locale,
          { fallback: false }
        )
        extraPages = await Promise.all(
          Array.from({ length: Math.max(firstPage.meta.totalPages - 1, 0) }, (_, index) =>
            getCafesWithMeta(
              { page: index + 2, limit: CAFE_API_PAGE_SIZE_LIMIT },
              locale,
              { fallback: false }
            )
          )
        )
      } catch (error) {
        console.error(`generateStaticParams cafes failed for ${locale}:`, error)
        return []
      }

      return [firstPage, ...extraPages]
        .flatMap((page) => page.cafes)
        .filter((cafe) => cafe.slug && cafe.isPublished !== false)
        .map((cafe) => ({ locale, slug: cafe.slug }))
    })
  )

  return byLocale.flat()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const cafe = await getCafe(slug, locale)

  if (!cafe) {
    return {
      title: "Cafe not found",
      robots: { index: false, follow: false },
    }
  }

  return {
    ...createLocalizedMetadata({
      locale,
      pathname: `/cafe/${cafe.slug}`,
      title: cafe.name,
      description: cafe.oneLiner ?? cafe.description ?? undefined,
      image: cafe.coverImage ?? undefined,
      imageAlt: cafe.name,
    }),
    openGraph: {
      title: cafe.name,
      description: cafe.oneLiner ?? cafe.description ?? undefined,
      images: cafe.coverImage
        ? [{ url: cafe.coverImage, width: 1200, height: 630, alt: cafe.name }]
        : [],
      siteName: "Cafe Maps",
      url: `/${locale}/cafe/${cafe.slug}`,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: locale === "vi" ? ["en_US"] : ["vi_VN"],
      type: "website",
    },
  }
}

export default async function CafeDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const cafe = await getCafe(slug, locale)

  if (!cafe) notFound()

  const jsonLd = {
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
    ...(cafe.openingTime && cafe.closingTime && {
      openingHours: `${cafe.openingTime.slice(0, 5)}-${cafe.closingTime.slice(0, 5)}`,
    }),
    image: cafe.images,
    url: new URL(`/${locale}/cafe/${cafe.slug}`, getSiteUrl()).toString(),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CafeDetailContent cafe={cafe} locale={locale} />
    </>
  )
}
