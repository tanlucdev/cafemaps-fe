import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroSection2 from "../../_sections/HeroSection2";
import FeaturedCafesSectionLoader2 from "../../_sections/FeaturedCafesSectionLoader2";
import FeaturedCafesSkeleton from "../../_sections/FeaturedCafesSkeleton";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  return {
    title: "Cafe Maps — Khám phá quán cà phê TP.HCM",
    description: t("subtitleCompact"),
    metadataBase: new URL(siteUrl),
  };
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
