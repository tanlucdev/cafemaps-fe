import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/metadata";
import { createHomeJsonLd, stringifyJsonLd } from "@/lib/structured-data";
import { routing } from "@/i18n/routing";
import HeroSection from "../_sections/HeroSection";
import FeaturedCafesSectionLoader from "../_sections/FeaturedCafesSectionLoader";
import FeaturedCafesSkeleton from "../_sections/FeaturedCafesSkeleton";
// import HomeSeoContent from "../_sections/HomeSeoContent";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return createLocalizedMetadata({
    locale,
    title: t("title"),
    absoluteTitle: true,
    description: t("description"),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const normalizedLocale = locale === "en" ? "en" : routing.defaultLocale;
  const jsonLd = createHomeJsonLd(normalizedLocale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />
      <HeroSection locale={locale} />
      <Suspense fallback={<FeaturedCafesSkeleton />}>
        <FeaturedCafesSectionLoader locale={locale} />
      </Suspense>
      {/* <HomeSeoContent locale={locale} /> */}
    </>
  );
}
