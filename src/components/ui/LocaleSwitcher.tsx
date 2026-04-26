"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function toggle() {
    const next = locale === "vi" ? "en" : "vi"
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-(--foreground-muted) hover:bg-(--background-secondary) transition-colors"
      aria-label="Switch language"
    >
      {locale === "vi" ? "EN" : "VI"}
    </button>
  )
}
