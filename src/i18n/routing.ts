import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false, // Page metadata supplies canonical hreflang URLs without query parameters.
})

export type Locale = (typeof routing.locales)[number]
