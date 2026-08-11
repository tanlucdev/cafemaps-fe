import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/metadata";
import HeroSection from "../../_sections/HeroSection";
import FeaturedCafesSectionLoader from "../../_sections/FeaturedCafesSectionLoader";
import FeaturedCafesSkeleton from "../../_sections/FeaturedCafesSkeleton";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    ...createLocalizedMetadata({
      locale,
      pathname: "/about",
      title: t("title"),
      absoluteTitle: true,
      description: t("description"),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection />
      <Suspense fallback={<FeaturedCafesSkeleton />}>
        <FeaturedCafesSectionLoader locale={locale} />
      </Suspense>
    </>
  );
}
