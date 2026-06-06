import type { Metadata } from "next"
import type { Locale } from "@/i18n/routing"

export const SITE_NAME = "Cafe Maps"
export const DEFAULT_LOCALE: Locale = "vi"
export const OG_IMAGE = "/image/meta-image.png.png"
export const HOME_TITLE = "Cafe Maps — Khám phá quán cà phê TP.HCM"
export const HOME_DESCRIPTION =
  "Tìm kiếm và khám phá những quán cà phê đẹp nhất tại TP.HCM theo phong cách, mục đích và địa điểm. Lọc nhanh theo quận, vibe, nhu cầu làm việc, hẹn hò hoặc chụp ảnh để chọn nơi ghé hôm nay."

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://cafemaps.net"

  return new URL(siteUrl)
}

export function normalizeLocale(locale: string): Locale {
  return locale === "en" ? "en" : "vi"
}

export function localizedPath(locale: Locale, pathname = "") {
  const cleanPath = pathname === "/" ? "" : pathname.replace(/^\/+/, "")
  return `/${locale}${cleanPath ? `/${cleanPath}` : ""}`
}

export function getLanguageAlternates(pathname = ""): Metadata["alternates"] {
  return {
    languages: {
      "vi-VN": localizedPath("vi", pathname),
      "en-US": localizedPath("en", pathname),
      "x-default": localizedPath(DEFAULT_LOCALE, pathname),
    },
  }
}

export function createLocalizedMetadata({
  locale,
  pathname = "",
  title,
  description,
  image = OG_IMAGE,
  imageAlt,
  absoluteTitle = false,
}: {
  locale: string
  pathname?: string
  title: string
  description?: string
  image?: string
  imageAlt?: string
  absoluteTitle?: boolean
}): Metadata {
  const normalizedLocale = normalizeLocale(locale)
  const canonical = localizedPath(normalizedLocale, pathname)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    metadataBase: getSiteUrl(),
    alternates: {
      canonical,
      ...getLanguageAlternates(pathname),
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: canonical,
      locale: normalizedLocale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: normalizedLocale === "vi" ? ["en_US"] : ["vi_VN"],
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
