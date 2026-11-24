import { blogPosts } from "@/lib/blog-data"
import { localizedSitemap } from "@/lib/sitemap"

export const dynamic = "force-static"

export function GET() {
  return localizedSitemap(["/blog", ...blogPosts.map(({ slug }) => `/blog/${encodeURIComponent(slug)}`)])
}
