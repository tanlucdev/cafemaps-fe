import { Suspense } from "react"
import type { Metadata } from "next"
import SearchLoader from "./_components/SearchLoader"
import SearchLoading from "./loading"

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const metadata: Metadata = {
  title: "Tìm quán — Cafe Maps",
  description: "Tìm kiếm và lọc quán cà phê tại TP.HCM theo vibe, quận, giá cả.",
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params
  const sp = await searchParams
  return (
    <div className="pt-16">
      <Suspense fallback={<SearchLoading />}>
        <SearchLoader locale={locale} searchParams={sp} />
      </Suspense>
    </div>
  )
}
