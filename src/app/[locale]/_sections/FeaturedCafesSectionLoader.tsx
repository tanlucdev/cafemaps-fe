import { getCafes } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import DeferredFeaturedCafesSection from "./DeferredFeaturedCafesSection";

export default async function FeaturedCafesSectionLoader({ locale }: { locale: string }) {
  const [cafes, featuredT, cafeT] = await Promise.all([
    getCafes({ limit: 3 }, locale),
    getTranslations({ locale, namespace: "featured" }),
    getTranslations({ locale, namespace: "cafe" }),
  ]);

  return (
    <DeferredFeaturedCafesSection
      cafes={cafes}
      copy={{
        weeklyFavourite: featuredT("weeklyFavourite"),
        mustVisit: featuredT("mustVisit"),
        viewAll: featuredT("viewAll"),
        viewAllMobile: featuredT("viewAllMobile"),
        openNow: cafeT("openNow"),
        closedNow: cafeT("closedNow"),
        vote: featuredT("vote"),
        voted: featuredT("voted"),
        voteCount: "",
      }}
    />
  );
}
