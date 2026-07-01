import type { Metadata } from "next";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import FeaturedSection from "@/app/[locale]/_sections/FeaturedSection";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
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

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  return (
    <div className="pt-16">
      <FeaturedSection cafes={[]} locale={locale} deferData />
    </div>
  );
}
