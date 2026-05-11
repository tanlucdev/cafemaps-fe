import { Suspense } from "react"
import type { Metadata } from "next"
import SearchLoader from "./_components/SearchLoader"
import SearchLoading from "./loading"

interface SearchPageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: "Tìm quán — Cafe Maps",
  description: "Tìm kiếm và lọc quán cà phê tại TP.HCM theo vibe, quận, giá cả.",
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params
  return (
    <div className="pt-16">
      <Suspense fallback={<SearchLoading />}>
        <SearchLoader locale={locale} />
      </Suspense>
    </div>
  )
}
