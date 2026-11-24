import { getCafeSitemapGroups, localizedSitemap } from "@/lib/sitemap"

export const revalidate = 3600

export async function GET(_request: Request, { params }: { params: Promise<{ district: string }> }) {
  const { district } = await params
  const paths = (await getCafeSitemapGroups()).get(district)
  return paths ? localizedSitemap(paths) : new Response(null, { status: 404 })
}
