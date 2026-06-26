import { getCafes } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import FeaturedCafesSection from "./FeaturedCafesSection";

export default async function FeaturedCafesSectionLoader({ locale }: { locale: string }) {
  const [cafes, featuredT, cafeT] = await Promise.all([
    getCafes({ limit: 3 }, locale),
    getTranslations({ locale, namespace: "featured" }),
    getTranslations({ locale, namespace: "cafe" }),
  ]);

  return (
    <FeaturedCafesSection
      cafes={cafes}
      copy={{
        weeklyFavourite: featuredT("weeklyFavourite"),
        mustVisit: featuredT("mustVisit"),
        viewAll: featuredT("viewAll"),
        viewAllMobile: featuredT("viewAllMobile"),
        openNow: cafeT("openNow"),
        closedNow: cafeT("closedNow"),
      }}
    />
  );
}
