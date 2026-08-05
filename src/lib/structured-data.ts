import type { Locale } from "@/i18n/routing"
import { HOME_DESCRIPTION, OG_IMAGE, SITE_NAME, getSiteUrl, localizedPath } from "@/lib/metadata"

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
  const imageUrl = absoluteUrl(OG_IMAGE)
  const language = locale === "vi" ? "vi-VN" : "en-US"
  const faq =
    locale === "vi"
      ? [
          {
            question: "Nên tìm quán cà phê gần tôi như thế nào?",
            answer:
              "Bắt đầu bằng khu vực hiện tại, sau đó lọc theo mục đích như làm việc, hẹn hò, đi một mình, ngoài trời hoặc yên tĩnh.",
          },
          {
            question: "Quán cà phê yên tĩnh có phải lúc nào cũng hợp để làm việc không?",
            answer:
              "Không hẳn. Làm việc còn cần bàn ghế ổn, wifi, ổ cắm, ánh sáng và thời gian ngồi phù hợp.",
          },
          {
            question: "Nên đi quán cà phê đẹp ở TP.HCM vào khung giờ nào?",
            answer:
              "Buổi sáng thường có ánh sáng dễ chụp và ít đông hơn; chiều tối hợp hẹn hò nhưng các quán trung tâm có thể ồn hơn.",
          },
        ]
      : [
          {
            question: "How should I find cafes near me?",
            answer:
              "Start with your current area, then narrow the list by purpose such as work, date, solo coffee, outdoor seating, or quiet space.",
          },
          {
            question: "Is every quiet cafe good for working?",
            answer:
              "Not always. Laptop work also needs stable tables, decent chairs, wifi, outlets, light, and seating that suits longer stays.",
          },
          {
            question: "What is the best time to visit beautiful cafes in Ho Chi Minh City?",
            answer:
              "Morning usually offers softer light and fewer crowds; evening is good for dates but central cafes may be noisier.",
          },
        ]
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
          width: 1024,
          height: 1024,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: SITE_NAME,
        url: homeUrl,
        description: HOME_DESCRIPTION,
        inLanguage: language,
        image: imageUrl,
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
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
        breadcrumb: { "@id": `${homeUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${homeUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: homeUrl,
          },
        ],
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
      {
        "@type": "FAQPage",
        "@id": `${homeUrl}#faq`,
        inLanguage: language,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  }
}
