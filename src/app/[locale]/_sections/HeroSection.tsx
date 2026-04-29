"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  locale: string
}

const KEYWORD_TO_FILTER: Array<{ keywords: string[]; vibe?: string; purpose?: string }> = [
  { keywords: ["làm việc", "work", "workspace"],  purpose: "làm việc" },
  { keywords: ["học tập", "học", "study"],         purpose: "học tập" },
  { keywords: ["hẹn hò", "date", "romantic"],      purpose: "hẹn hò" },
  { keywords: ["họp nhóm", "meeting", "group"],    purpose: "họp nhóm" },
  { keywords: ["chill", "một mình"],               purpose: "chill một mình" },
  { keywords: ["bạn bè", "gặp bạn", "friend"],     purpose: "gặp bạn bè" },
  { keywords: ["yên tĩnh", "quiet", "yên"],        vibe: "yên tĩnh" },
  { keywords: ["vintage", "cổ điển"],              vibe: "vintage" },
  { keywords: ["thiên nhiên", "nature", "cây"],    vibe: "thiên nhiên" },
  { keywords: ["hiện đại", "modern"],              vibe: "hiện đại" },
  { keywords: ["minimalist", "tối giản"],          vibe: "minimalist" },
  { keywords: ["lãng mạn", "romantic"],            vibe: "lãng mạn" },
  { keywords: ["sáng tạo", "creative"],            vibe: "sáng tạo" },
  { keywords: ["nhộn nhịp", "vibrant", "náo nhiệt"], vibe: "nhộn nhịp" },
]

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

function ChibiWalkAnimation() {
  return (
    <div className="relative mx-auto mb-6 h-28 w-64 overflow-hidden" aria-hidden>
      {/* Ground line */}
      <div className="absolute bottom-3 left-0 right-0 h-px bg-accent opacity-20" />

      {/* Coffee cup — static, centered background element */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3">
        <svg width="36" height="44" viewBox="0 0 72 88" fill="none" className="text-accent opacity-70">
          <path className="steam-1" d="M26 28 Q22 20 26 12 Q30 4 26 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path className="steam-2" d="M36 26 Q32 18 36 10 Q40 2 36 -2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path className="steam-3" d="M46 28 Q42 20 46 12 Q50 4 46 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <ellipse cx="36" cy="80" rx="30" ry="6" fill="currentColor" opacity="0.18" />
          <path d="M14 42 L18 76 Q18 80 22 80 L50 80 Q54 80 54 76 L58 42 Z" fill="currentColor" opacity="0.85" />
          <rect x="12" y="36" width="48" height="10" rx="5" fill="currentColor" />
          <path d="M58 48 Q72 50 72 60 Q72 70 58 70" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="36" cy="41" rx="19" ry="3.5" fill="currentColor" opacity="0.35" />
        </svg>
      </div>

      {/* Chibi character walking back and forth */}
      <motion.div
        className="absolute bottom-3"
        animate={{ x: [0, 160, 0], y: [0, -4, 0] }}
        transition={{
          x: { duration: 5, repeat: Infinity, ease: "linear", times: [0, 0.5, 1] },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Flip direction when going right→left */}
        <motion.div
          animate={{ scaleX: [1, 1, -1, -1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", times: [0, 0.49, 0.5, 0.99, 1] }}
          style={{ originX: "50%" }}
        >
          <svg width="38" height="62" viewBox="0 0 32 52" fill="none">
            {/* Head */}
            <circle cx="16" cy="11" r="9" fill="#C8842A" />
            {/* Eyes */}
            <circle cx="12.5" cy="10" r="1.5" fill="white" />
            <circle cx="19.5" cy="10" r="1.5" fill="white" />
            <circle cx="13" cy="10.5" r="0.8" fill="#3D2510" />
            <circle cx="20" cy="10.5" r="0.8" fill="#3D2510" />
            {/* Smile */}
            <path d="M12.5 14 Q16 17 19.5 14" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            {/* Body */}
            <rect x="10" y="20" width="12" height="14" rx="4" fill="#E8A84E" />
            {/* Arms — left holding cup */}
            <path d="M10 24 Q4 26 5 30" stroke="#C8842A" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Mini coffee cup in hand */}
            <rect x="2" y="27" width="6" height="5" rx="1.5" fill="#C8842A" />
            <path d="M8 29 Q10 29.5 10 31 Q10 32.5 8 32.5" stroke="#C8842A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Right arm */}
            <path d="M22 24 Q27 26 26 30" stroke="#C8842A" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Legs — alternating walk cycle */}
            <motion.path
              d="M13 34 Q12 40 10 46"
              stroke="#C8842A" strokeWidth="3.5" strokeLinecap="round" fill="none"
              animate={{ d: ["M13 34 Q12 40 10 46", "M13 34 Q14 40 16 46", "M13 34 Q12 40 10 46"] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M19 34 Q20 40 22 46"
              stroke="#C8842A" strokeWidth="3.5" strokeLinecap="round" fill="none"
              animate={{ d: ["M19 34 Q20 40 22 46", "M19 34 Q18 40 16 46", "M19 34 Q20 40 22 46"] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            />
            {/* Shoes */}
            <motion.ellipse
              cx="10" cy="47" rx="4" ry="2.5" fill="#3D2510"
              animate={{ cx: [10, 16, 10] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="22" cy="47" rx="4" ry="2.5" fill="#3D2510"
              animate={{ cx: [22, 16, 22] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            />
            {/* Hair tuft */}
            <path d="M16 2 Q18 -1 20 2" stroke="#3D2510" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Floating coffee beans */}
      <motion.div
        className="absolute text-accent opacity-40"
        style={{ right: "24px", bottom: "28px" }}
        animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="10" height="14" viewBox="0 0 14 20" fill="currentColor">
          <ellipse cx="7" cy="10" rx="6" ry="9" />
          <path d="M7 2 Q4 10 7 18" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute text-accent opacity-30"
        style={{ left: "18px", bottom: "32px" }}
        animate={{ y: [0, -4, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <svg width="8" height="11" viewBox="0 0 14 20" fill="currentColor">
          <ellipse cx="7" cy="10" rx="6" ry="9" />
          <path d="M7 2 Q4 10 7 18" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
        </svg>
      </motion.div>
    </div>
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
    const q = search.trim().toLowerCase()
    const params = new URLSearchParams()

    let matched = false
    for (const mapping of KEYWORD_TO_FILTER) {
      if (mapping.keywords.some((k) => q.includes(k))) {
        if (mapping.vibe) params.append("vibe", mapping.vibe)
        if (mapping.purpose) params.append("purpose", mapping.purpose)
        matched = true
      }
    }

    if (q.includes("gần")) params.set("nearMe", "true")
    if (!matched && q) params.set("search", q)

    router.push(`/${locale}/search${params.size ? `?${params}` : ""}`)
  }

  function handleQuickFilter({ vibe, purpose }: { vibe?: string; purpose?: string }) {
    const params = new URLSearchParams()
    if (vibe) params.set("vibe", vibe)
    if (purpose) params.set("purpose", purpose)
    router.push(`/${locale}/search?${params.toString()}`)
  }

  return (
    <section className="bg-(--background-secondary) border-b border-border pt-16 relative overflow-hidden">
      {/* Leaf accent — top left */}
      <svg
        className="leaf-1 absolute top-6 left-4 sm:left-10 text-accent opacity-[0.18] pointer-events-none"
        width="28" height="36" viewBox="0 0 28 36"
        fill="currentColor" aria-hidden
      >
        <path d="M14 2 C6 8 2 18 6 28 C8 34 14 36 14 36 C14 36 20 34 22 28 C26 18 22 8 14 2Z" />
        <path d="M14 4 L14 34" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
      </svg>
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
        {/* Chibi walking animation */}
        <ChibiWalkAnimation />

        {/* Time-based greeting */}
        <p className="text-sm font-semibold text-accent mb-3 tracking-wide uppercase">
          {t(greetingKey)}
        </p>

        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 tracking-tight leading-tight">
          {t("headlineCompact")}
        </h1>
        <p className="text-(--foreground-muted) text-base mb-5 max-w-xl mx-auto">
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
