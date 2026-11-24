import { getSiteUrl } from "@/lib/metadata"
import { getCafeSitemapGroups, xmlResponse, xmlEscape, SITEMAP_NAMESPACE } from "@/lib/sitemap"

export const revalidate = 3600

export async function GET() {
  const siteUrl = getSiteUrl()
  const groups = await getCafeSitemapGroups()
  const paths = [
    "/sitemap-pages.xml",
    "/sitemap-blog.xml",
    "/sitemap-chains.xml",
    ...Array.from(groups.keys()).sort().map((group) => `/sitemap-cafes-${group}.xml`),
  ]
  const sitemaps = paths.map(
    (path) => `  <sitemap><loc>${xmlEscape(new URL(path, siteUrl).href)}</loc></sitemap>`
  )

  return xmlResponse(
    `<sitemapindex xmlns="${SITEMAP_NAMESPACE}">\n${sitemaps.join("\n")}\n</sitemapindex>`
  )
}
