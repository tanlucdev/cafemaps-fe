import type { Metadata } from "next"
import { getCafes } from "@/lib/api"
import FeaturedSection from "@/app/[locale]/_sections/FeaturedSection"

interface SearchPageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: "Tìm quán — Cafe Finder",
  description: "Tìm kiếm và lọc quán cà phê tại TP.HCM theo vibe, quận, giá cả.",
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params
  const cafes = await getCafes()
  return (
    <div className="pt-16">
      <FeaturedSection cafes={cafes} locale={locale} />
    </div>
  )
}
