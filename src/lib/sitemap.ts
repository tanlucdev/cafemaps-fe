import { getCafeSitemapEntries } from "@/apis/cafes"
import { routing } from "@/i18n/routing"
import { getLanguageAlternates, getSiteUrl, localizedPath } from "@/lib/metadata"

export const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9"

export async function getCafeSitemapGroups() {
  const groups = new Map<string, string[]>()
  for (const { slug, district } of await getCafeSitemapEntries()) {
    if (!slug.trim() || slug === "." || slug === "..") continue

    const key = (district ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replaceAll("đ", "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .replace(/^(quan|district)-/, "")
    const group = /^\d+$/.test(key) ? `quan-${Number(key)}` : key || "khac"
    const path = `/cafe/${encodeURIComponent(slug)}`
    const paths = groups.get(group)
    if (paths) paths.push(path)
    else groups.set(group, [path])
  }
  return groups
}

export function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

export function xmlResponse(xml: string) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n${xml}\n`
  if (Buffer.byteLength(body) > 52_428_800) {
    throw new Error("Sitemap exceeds 50 MB uncompressed")
  }

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}

export function localizedSitemap(paths: string[]) {
  // ponytail: split a sitemap by page count once a single URL group approaches the protocol limits.
  if (paths.length * routing.locales.length > 50_000) {
    throw new Error("Sitemap exceeds 50,000 URLs")
  }

  const siteUrl = getSiteUrl()
  const entries = paths.flatMap((path) => {
    const alternates = Object.entries(getLanguageAlternates(path).languages).map(
      ([language, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${xmlEscape(new URL(href, siteUrl).href)}" />`
    )

    return routing.locales.map((locale) =>
      [
        "  <url>",
        `    <loc>${xmlEscape(new URL(localizedPath(locale, path), siteUrl).href)}</loc>`,
        ...alternates,
        "  </url>",
      ].join("\n")
    )
  })

  const xml = [
    `<urlset xmlns="${SITEMAP_NAMESPACE}" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...entries,
    "</urlset>",
  ].join("\n")

  return xmlResponse(xml)
}
