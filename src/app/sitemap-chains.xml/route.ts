import { getChains } from "@/apis/chains"
import { routing } from "@/i18n/routing"
import { localizedSitemap } from "@/lib/sitemap"

export const revalidate = 0

export async function GET() {
  const first = await getChains(routing.defaultLocale, 1, 50)
  const pages = Math.ceil(first.total / first.limit)
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, index) =>
      getChains(routing.defaultLocale, index + 2, first.limit)
    )
  )
  const paths = [first, ...rest].flatMap(({ data }) =>
    data.map(({ slug }) => `/chains/${encodeURIComponent(slug)}`)
  )
  return localizedSitemap(["/chains", ...paths])
}
