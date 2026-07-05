import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
})

export type Locale = (typeof routing.locales)[number]
