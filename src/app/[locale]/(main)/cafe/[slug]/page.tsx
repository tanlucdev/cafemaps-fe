import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { getCafeBySlug } from "@/lib/api"
import CafeDetailContent from "./_components/CafeDetailContent"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

const getCafe = cache((slug: string) => getCafeBySlug(slug))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const cafe = await getCafe(slug)

  if (!cafe) return { title: "Không tìm thấy quán" }

  return {
    title: cafe.name,
    description: cafe.oneLiner ?? cafe.description ?? undefined,
    openGraph: {
      title: cafe.name,
      description: cafe.oneLiner ?? cafe.description ?? undefined,
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
  const cafe = await getCafe(slug)

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
