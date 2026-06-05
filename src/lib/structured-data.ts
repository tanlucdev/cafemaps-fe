import type { Locale } from "@/i18n/routing"
import { HOME_DESCRIPTION, SITE_NAME, getSiteUrl, localizedPath } from "@/lib/metadata"

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[]

function absoluteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString()
}

export function stringifyJsonLd(value: JsonLdValue) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

export function createHomeJsonLd(locale: Locale) {
  const homePath = localizedPath(locale)
  const homeUrl = absoluteUrl(homePath)
  const searchUrl = absoluteUrl(localizedPath(locale, "/search"))
  const blogUrl = absoluteUrl(localizedPath(locale, "/blog"))
  const quizUrl = absoluteUrl(localizedPath(locale, "/quiz"))
  const contributeUrl = absoluteUrl(localizedPath(locale, "/contribute"))
  const logoUrl = absoluteUrl("/image/logo.png")
  const language = locale === "vi" ? "vi-VN" : "en-US"
  const navNames =
    locale === "vi"
      ? {
          search: "Tìm quán cà phê",
          blog: "Blog Cafe Maps",
          quiz: "Trắc nghiệm chọn quán",
          contribute: "Đóng góp quán cà phê",
        }
      : {
          search: "Find cafés",
          blog: "Cafe Maps Blog",
          quiz: "Café quiz",
          contribute: "Contribute a café",
        }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${homeUrl}#organization`,
        name: SITE_NAME,
        url: homeUrl,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: SITE_NAME,
        url: homeUrl,
        description: HOME_DESCRIPTION,
        inLanguage: language,
        publisher: { "@id": `${homeUrl}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${searchUrl}?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        inLanguage: language,
        isPartOf: { "@id": `${homeUrl}#website` },
        about: { "@id": `${homeUrl}#organization` },
      },
      {
        "@type": "ItemList",
        "@id": `${homeUrl}#site-navigation`,
        name: "Site navigation",
        itemListElement: [
          { "@type": "SiteNavigationElement", position: 1, name: navNames.search, url: searchUrl },
          { "@type": "SiteNavigationElement", position: 2, name: navNames.blog, url: blogUrl },
          { "@type": "SiteNavigationElement", position: 3, name: navNames.quiz, url: quizUrl },
          {
            "@type": "SiteNavigationElement",
            position: 4,
            name: navNames.contribute,
            url: contributeUrl,
          },
        ],
      },
    ],
  }
}
