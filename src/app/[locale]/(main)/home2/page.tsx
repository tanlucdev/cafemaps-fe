import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/metadata";
import HeroSection2 from "../../_sections/HeroSection2";
import FeaturedCafesSectionLoader2 from "../../_sections/FeaturedCafesSectionLoader2";
import FeaturedCafesSkeleton from "../../_sections/FeaturedCafesSkeleton";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    ...createLocalizedMetadata({
      locale,
      pathname: "/home2",
      title: t("title"),
      absoluteTitle: true,
      description: t("description"),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function Home2Page({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection2 />
      <Suspense fallback={<FeaturedCafesSkeleton />}>
        <FeaturedCafesSectionLoader2 locale={locale} />
      </Suspense>
    </>
  );
}
