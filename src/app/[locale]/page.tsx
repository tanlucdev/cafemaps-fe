import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { getCafes } from "@/lib/api"
import HeroSection from "./_sections/HeroSection"
import FeaturedCafesSection from "./_sections/FeaturedCafesSection"

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "hero" })

  return {
    title: "Cafe Finder — Khám phá quán cà phê TP.HCM",
    description: t("subtitleCompact"),
    openGraph: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Cafe Finder",
        },
      ],
    },
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const cafes = await getCafes({ city: "Ho Chi Minh City" })

  return (
    <>
      <HeroSection locale={locale} />
      <FeaturedCafesSection cafes={cafes} locale={locale} />
    </>
  )
}
