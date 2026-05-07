import { getCafes } from "@/lib/api"
import FeaturedCafesSection from "./FeaturedCafesSection"

export default async function FeaturedCafesSectionLoader({ locale }: { locale: string }) {
  const cafes = await getCafes()
  return <FeaturedCafesSection cafes={cafes} locale={locale} />
}
