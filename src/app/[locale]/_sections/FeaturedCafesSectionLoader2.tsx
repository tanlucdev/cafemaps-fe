import { getCafes } from "@/lib/api";
import FeaturedCafesSection2 from "./FeaturedCafesSection2";

export default async function FeaturedCafesSectionLoader2({ locale }: { locale: string }) {
  const cafes = await getCafes({ limit: 3 }, locale);
  return <FeaturedCafesSection2 cafes={cafes} locale={locale} />;
}
