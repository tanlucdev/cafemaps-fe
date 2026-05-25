import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import HeroSection2 from "../../_sections/HeroSection2";
import FeaturedCafesSectionLoader2 from "../../_sections/FeaturedCafesSectionLoader2";
import FeaturedCafesSkeleton from "../../_sections/FeaturedCafesSkeleton";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale, namespace: "hero" });

  return createLocalizedMetadata({
    locale,
    pathname: "/home2",
    title:
      normalizedLocale === "vi"
        ? "Cafe Maps — Khám phá quán cà phê TP.HCM"
        : "Cafe Maps — Discover cafés in Ho Chi Minh City",
    description: t("subtitleCompact"),
  });
}

export default async function Home2Page({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection2 locale={locale} />
      <Suspense fallback={<FeaturedCafesSkeleton />}>
        <FeaturedCafesSectionLoader2 locale={locale} />
      </Suspense>
    </>
  );
}
