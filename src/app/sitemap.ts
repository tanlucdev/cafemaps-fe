import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/metadata"
import { routing } from "@/i18n/routing"

const STATIC_PATHS = ["", "/search", "/blog", "/quiz", "/contribute"]

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "")
  const now = new Date()

  return routing.locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternateLocale) => [
            alternateLocale === "vi" ? "vi-VN" : "en-US",
            `${siteUrl}/${alternateLocale}${path}`,
          ]),
        ),
      },
    })),
  )
}
