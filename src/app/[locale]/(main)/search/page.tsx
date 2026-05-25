import { Suspense } from "react";
import type { Metadata } from "next";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import SearchLoader from "./_components/SearchLoader";
import SearchLoading from "./loading";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/search",
    title: normalizedLocale === "vi" ? "Tìm quán" : "Find cafés",
    description:
      normalizedLocale === "vi"
        ? "Tìm kiếm và lọc quán cà phê tại TP.HCM theo vibe, quận, giá cả."
        : "Search and filter cafés in Ho Chi Minh City by vibe, area, and price.",
  });
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  return (
    <div className="pt-16">
      <Suspense fallback={<SearchLoading />}>
        <SearchLoader locale={locale} searchParams={sp} />
      </Suspense>
    </div>
  );
}
