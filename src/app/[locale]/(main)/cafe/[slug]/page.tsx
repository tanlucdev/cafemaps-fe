import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCafeBySlug } from "@/lib/api"
import CafeDetailContent from "./_components/CafeDetailContent"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const cafe = await getCafeBySlug(slug)

  if (!cafe) return { title: "Không tìm thấy quán" }

  return {
    title: cafe.name,
    description: cafe.oneLiner ?? cafe.description,
    openGraph: {
      title: cafe.name,
      description: cafe.oneLiner ?? cafe.description,
      images: cafe.coverImage
        ? [{ url: cafe.coverImage, width: 1200, height: 630, alt: cafe.name }]
        : [],
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
    },
  }
}

export default async function CafeDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const cafe = await getCafeBySlug(slug)

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
    geo: {
      "@type": "GeoCoordinates",
      latitude: cafe.lat,
      longitude: cafe.lng,
    },
    ...(cafe.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: cafe.rating,
        reviewCount: cafe.reviewCount ?? 0,
      },
    }),
    ...(cafe.openingHours && { openingHours: cafe.openingHours }),
    image: cafe.images,
    url: `https://cafefinder.vn/${locale}/cafe/${cafe.slug}`,
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
