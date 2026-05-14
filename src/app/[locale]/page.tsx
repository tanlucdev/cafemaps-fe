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

  // Tự động nhận diện domain thật trên Vercel hoặc dùng biến môi trường
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
    openGraph: {
      title: "Cafe Maps — Khám phá quán cà phê TP.HCM",
      description: t("subtitleCompact"),
      type: "website",
      images: [
        {
          url: "/image/meta-image.png",
          width: 1200,
          height: 630,
          alt: "Cafe Maps — Khám phá quán cà phê TP.HCM",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Cafe Maps — Khám phá quán cà phê TP.HCM",
      description: t("subtitleCompact"),
      images: ["/image/meta-image.png"],
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
