import type { MetadataRoute } from "next"
import { getCafesWithMeta } from "@/lib/api"
import { blogPosts } from "@/lib/blog-data"
import { getSiteUrl } from "@/lib/metadata"
import { routing } from "@/i18n/routing"
import { CAFE_API_PAGE_SIZE_LIMIT } from "@/apis/cafes/constants"

export const revalidate = 3600

type SitemapEntry = MetadataRoute.Sitemap[number]
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>

const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: ChangeFrequency
  priority: number
}> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/search", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/quiz", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contribute", changeFrequency: "monthly", priority: 0.5 },
]

const BLOG_LAST_MODIFIED: Record<string, string> = {
  "mot-buoi-sang-cham-o-thao-dien": "2026-05-12",
  "chon-quan-lam-viec-khong-bi-met": "2026-05-08",
  "nhung-goc-nho-hop-de-di-mot-minh": "2026-05-02",
  "hen-cuoi-tuan-o-mot-quan-co-san-vuon": "2026-04-26",
}

const CAFE_SITEMAP_PAGE_SIZE = CAFE_API_PAGE_SIZE_LIMIT
const MAX_CAFE_SITEMAP_PAGES = 500

function getBaseUrl() {
  return getSiteUrl().toString().replace(/\/$/, "")
}

function localizedUrl(siteUrl: string, locale: string, path: string) {
  return `${siteUrl}/${locale}${path}`
}

function languageAlternates(siteUrl: string, path: string) {
  return {
    "vi-VN": localizedUrl(siteUrl, "vi", path),
    "en-US": localizedUrl(siteUrl, "en", path),
    "x-default": localizedUrl(siteUrl, routing.defaultLocale, path),
  }
}

function localizedEntries(
  siteUrl: string,
  path: string,
  entry: Omit<SitemapEntry, "url" | "alternates">
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    ...entry,
    url: localizedUrl(siteUrl, locale, path),
    alternates: {
      languages: languageAlternates(siteUrl, path),
    },
  }))
}

function toValidDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

async function getCafeEntries(siteUrl: string, fallbackLastModified: Date) {
  const firstPage = await getCafesWithMeta(
    { page: 1, limit: CAFE_SITEMAP_PAGE_SIZE },
    routing.defaultLocale,
    { fallback: false }
  )
  const totalPages = Math.max(
    1,
    Math.min(firstPage.meta.totalPages || 1, MAX_CAFE_SITEMAP_PAGES)
  )
  const extraPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getCafesWithMeta(
        { page: index + 2, limit: CAFE_SITEMAP_PAGE_SIZE },
        routing.defaultLocale,
        { fallback: false }
      )
    )
  )
  const seenSlugs = new Set<string>()

  return [firstPage, ...extraPages]
    .flatMap((page) => page.cafes)
    .filter((cafe) => {
      if (!cafe.slug || cafe.isPublished === false || seenSlugs.has(cafe.slug)) {
        return false
      }
      seenSlugs.add(cafe.slug)
      return true
    })
    .flatMap((cafe) =>
      localizedEntries(siteUrl, `/cafe/${cafe.slug}`, {
        lastModified: toValidDate(cafe.updatedAt) ?? toValidDate(cafe.createdAt) ?? fallbackLastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getBaseUrl()
  const now = new Date()
  const staticEntries = STATIC_ROUTES.flatMap(({ path, ...entry }) =>
    localizedEntries(siteUrl, path, {
      ...entry,
      lastModified: now,
    })
  )
  const blogEntries = blogPosts.flatMap((post) =>
    localizedEntries(siteUrl, `/blog/${post.slug}`, {
      lastModified: BLOG_LAST_MODIFIED[post.slug] ?? now,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  )
  let cafeEntries: MetadataRoute.Sitemap = []
  try {
    cafeEntries = await getCafeEntries(siteUrl, now)
  } catch (error) {
    console.error("sitemap cafes failed:", error)
  }

  return [...staticEntries, ...blogEntries, ...cafeEntries]
}
