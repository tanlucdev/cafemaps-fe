import { getCafes } from "@/lib/api"
import FeaturedSection from "@/app/[locale]/_sections/FeaturedSection"

export default async function SearchLoader({ locale }: { locale: string }) {
  const cafes = await getCafes()
  return <FeaturedSection cafes={cafes} locale={locale} />
}
