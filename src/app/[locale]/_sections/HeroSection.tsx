"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  locale: string
}

const QUICK_FILTERS = [
  { emoji: "☁️", vibe: "yên tĩnh", labelKey: "quickFilterQuiet" as const },
  { emoji: "🌿", vibe: "thiên nhiên", labelKey: "quickFilterNature" as const },
  { emoji: "✨", vibe: "vintage", labelKey: "quickFilterVintage" as const },
  { emoji: "💻", purpose: "làm việc", labelKey: "quickFilterWork" as const },
]

const PLACEHOLDER_KEYS = [
  "placeholderWork",
  "placeholderDate",
  "placeholderMorning",
] as const

function getGreetingKey() {
  const h = new Date().getHours()
  if (h >= 6 && h < 11) return "greetingMorning"
  if (h >= 11 && h < 14) return "greetingNoon"
  if (h >= 14 && h < 18) return "greetingAfternoon"
  return "greetingEvening"
}

function CoffeeSteamIcon() {
  return (
    <svg
      width="72"
      height="88"
      viewBox="0 0 72 88"
      fill="none"
      aria-hidden
      className="mx-auto mb-4"
    >
      {/* Steam wisps */}
      <path
        className="steam-1"
        d="M26 28 Q22 20 26 12 Q30 4 26 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0"
      />
      <path
        className="steam-2"
        d="M36 26 Q32 18 36 10 Q40 2 36 -2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0"
      />
      <path
        className="steam-3"
        d="M46 28 Q42 20 46 12 Q50 4 46 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0"
      />
      {/* Saucer */}
      <ellipse cx="36" cy="80" rx="30" ry="6" fill="currentColor" opacity="0.18" />
      {/* Cup body */}
      <path
        d="M14 42 L18 76 Q18 80 22 80 L50 80 Q54 80 54 76 L58 42 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Cup rim */}
      <rect x="12" y="36" width="48" height="10" rx="5" fill="currentColor" />
      {/* Handle */}
      <path
        d="M58 48 Q72 50 72 60 Q72 70 58 70"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Coffee surface */}
      <ellipse cx="36" cy="41" rx="19" ry="3.5" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("hero")
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [greetingKey] = useState(getGreetingKey)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_KEYS.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  function handleSearch() {
    const params = new URLSearchParams()
    if (search.trim()) params.set("search", search.trim())
    const qs = params.toString()
    router.push(`/${locale}/search${qs ? `?${qs}` : ""}`)
  }

  function handleQuickFilter({ vibe, purpose }: { vibe?: string; purpose?: string }) {
    const params = new URLSearchParams()
    if (vibe) params.set("vibe", vibe)
    if (purpose) params.set("purpose", purpose)
    router.push(`/${locale}/search?${params.toString()}`)
  }

  return (
    <section className="bg-(--background-secondary) border-b border-border pt-16 relative overflow-hidden">
      {/* Subtle background grain overlay for hero */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
        aria-hidden
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center relative">
        {/* Animated coffee icon */}
        <div className="text-accent">
          <CoffeeSteamIcon />
        </div>

        {/* Time-based greeting */}
        <p className="text-sm font-semibold text-accent mb-2 tracking-wide uppercase">
          {t(greetingKey)}
        </p>

        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 tracking-tight leading-tight">
          {t("headlineCompact")}
        </h1>
        <p className="text-(--foreground-muted) text-base mb-7 max-w-xl mx-auto">
          {t("subtitleCompact")}
        </p>

        {/* Search bar */}
        <div className="flex gap-2 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <Search
              size={15}
              className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors",
                focused ? "text-accent" : "text-(--foreground-muted)"
              )}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={!search ? t(PLACEHOLDER_KEYS[placeholderIdx]) : undefined}
              className="w-full h-11 rounded-xl border border-border bg-background text-foreground text-sm pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-11 px-6 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-(--accent-hover) active:scale-95 transition-all shrink-0"
          >
            {t("cta")}
          </button>
        </div>

        {/* Quick filter chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {QUICK_FILTERS.map(({ emoji, vibe, purpose, labelKey }) => (
            <button
              key={labelKey}
              onClick={() => handleQuickFilter({ vibe, purpose })}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-background/80 text-sm text-(--foreground-muted) hover:border-accent hover:text-accent hover:bg-(--accent-light) transition-all duration-150"
            >
              <span>{emoji}</span>
              {t(labelKey)}
            </button>
          ))}
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
