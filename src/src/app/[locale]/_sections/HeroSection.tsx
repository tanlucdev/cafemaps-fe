"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"

interface HeroSectionProps {
  locale: string
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("hero")
  const router = useRouter()
  const [search, setSearch] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    if (search.trim()) params.set("search", search.trim())
    const qs = params.toString()
    router.push(`/${locale}/search${qs ? `?${qs}` : ""}`)
  }

  return (
    <section className="bg-(--background-secondary) border-b border-border pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 tracking-tight leading-tight">
          {t("headlineCompact")}
        </h1>
        <p className="text-(--foreground-muted) text-base mb-8 max-w-xl mx-auto">
          {t("subtitleCompact")}
        </p>

        {/* Search bar */}
        <div className="flex gap-2 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--foreground-muted)"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("searchPlaceholder")}
              className="w-full h-11 rounded-xl border border-border bg-background text-foreground text-sm pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-11 px-6 rounded-xl bg-accent text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors shrink-0"
          >
            {t("cta")}
          </button>
        </div>

        {/* Explore CTA */}
        <p className="mt-5 text-sm text-(--foreground-muted)">
          hoặc{" "}
          <a
            href={`/${locale}/search`}
            className="text-accent underline underline-offset-2 hover:text-(--accent-hover) transition-colors"
          >
            khám phá tất cả quán →
          </a>
        </p>
      </div>
    </section>
  )
}
