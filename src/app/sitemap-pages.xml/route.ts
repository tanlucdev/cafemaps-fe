import { featureFlags } from "@/lib/feature-flags"
import { localizedSitemap } from "@/lib/sitemap"

export const dynamic = "force-static"

export function GET() {
  return localizedSitemap([
    "",
    "/quiz",
    "/contribute",
    "/contribute/suggest",
    ...(featureFlags.coffeeMeetupsEnabled ? ["/coffee-meetups"] : []),
  ])
}
