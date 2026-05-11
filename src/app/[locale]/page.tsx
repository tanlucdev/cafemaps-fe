import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroSection from "./_sections/HeroSection";
import FeaturedCafesSectionLoader from "./_sections/FeaturedCafesSectionLoader";
import FeaturedCafesSkeleton from "./_sections/FeaturedCafesSkeleton";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    title: "Cafe Maps — Khám phá quán cà phê TP.HCM",
    description: t("subtitleCompact"),
    openGraph: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Cafe Maps",
        },
      ],
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <Suspense fallback={<FeaturedCafesSkeleton />}>
        <FeaturedCafesSectionLoader locale={locale} />
      </Suspense>
    </>
  );
}
