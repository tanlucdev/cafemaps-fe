"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bookmark, ChevronRight, Heart, Lock, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Cafe } from "@/types/cafe"
import { getCurrentAccessToken } from "@/lib/auth-client"
import { getSavedCafes } from "@/lib/api"
import CafeCard from "@/components/cafe/CafeCard"
import { formatPrice } from "@/lib/utils"
import type { ReactNode } from "react"

interface SavedCafesClientProps {
  locale: string
  initialIsLoggedIn: boolean
  initialCafes: Cafe[]
  previewMode?: boolean
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[28px] border border-[#e6dacd] bg-white p-6 shadow-[0_18px_40px_rgba(44,26,14,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6f58]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#6b5a4a]">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function AuthGate({
  locale,
  title,
  subtitle,
  loginCta,
  registerCta,
}: {
  locale: string
  title: string
  subtitle: string
  loginCta: string
  registerCta: string
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[28px] border border-[#e6dacd] bg-[#fff8f2] p-7 shadow-[0_18px_40px_rgba(44,26,14,0.06)]">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0e0cf] text-[#875200]">
          <Lock size={24} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#2C1A0E] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#6b5a4a]">
          {subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center justify-center rounded-full bg-[#C8842A] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {loginCta}
          </Link>
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center justify-center rounded-full border border-[#d6c4b3] bg-white px-5 py-3 text-sm font-medium text-[#2C1A0E] transition-colors hover:bg-[#fff2e7]"
          >
            {registerCta}
          </Link>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#e6dacd] bg-[#fff2e8] p-7 shadow-[0_18px_40px_rgba(44,26,14,0.06)]">
        <div className="mb-4 flex items-center gap-2 text-[#875200]">
          <Sparkles size={18} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            Collection
          </span>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/70 p-4">
            <p className="text-sm font-medium text-[#2C1A0E]">
              Warm minimalism
            </p>
            <p className="mt-1 text-xs leading-5 text-[#6b5a4a]">
              Soft cream surfaces, warm shadows, generous radius.
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4">
            <p className="text-sm font-medium text-[#2C1A0E]">
              Saved cafés flow
            </p>
            <p className="mt-1 text-xs leading-5 text-[#6b5a4a]">
              Card-first layout, clear saved-state, calm spacing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  locale,
  title,
  subtitle,
  cta,
}: {
  locale: string
  title: string
  subtitle: string
  cta: string
}) {
  return (
    <div className="rounded-[28px] border border-[#e6dacd] bg-[#fff8f2] p-6 shadow-[0_18px_40px_rgba(44,26,14,0.06)] sm:p-8">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0e0cf] text-[#875200]">
          <Bookmark size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#2C1A0E]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6b5a4a]">{subtitle}</p>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C8842A] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {cta}
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  )
}

export default function SavedCafesClient({
  locale,
  initialIsLoggedIn,
  initialCafes,
  previewMode = false,
}: SavedCafesClientProps) {
  const t = useTranslations("saved")
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [cafes, setCafes] = useState(initialCafes)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (previewMode) return

    let alive = true

    const syncAuth = async () => {
      const token = await getCurrentAccessToken()
      if (alive) setIsLoggedIn(Boolean(token))
    }

    void syncAuth()
    window.addEventListener("cafe-auth-change", syncAuth)
    return () => {
      alive = false
      window.removeEventListener("cafe-auth-change", syncAuth)
    }
  }, [previewMode])

  useEffect(() => {
    if (previewMode) return
    if (!isLoggedIn) return

    let alive = true
    setRefreshing(true)

    ;(async () => {
      const token = await getCurrentAccessToken()
      if (!token) {
        if (alive) setCafes([])
        return
      }

      const nextCafes = await getSavedCafes(token)
      if (alive) setCafes(nextCafes)
    })().finally(() => {
      if (alive) setRefreshing(false)
    })

    return () => {
      alive = false
    }
  }, [isLoggedIn, previewMode])

  const stats = useMemo(
    () => ({
      total: cafes.length,
      warm: cafes.filter((cafe) => formatPrice(cafe.priceMin, cafe.priceMax)).length,
      quiet: cafes.filter(
        (cafe) => cafe.vibes.includes("yên tĩnh") || cafe.vibes.includes("minimalist")
      ).length,
    }),
    [cafes]
  )

  function removeSavedCafe(cafeId: string, saved: boolean) {
    if (!saved) {
      setCafes((current) => current.filter((cafe) => cafe.id !== cafeId))
    }
  }

  if (!previewMode && !isLoggedIn) {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <AuthGate
          locale={locale}
          title={t("title")}
          subtitle={t("loginRequired")}
          loginCta={t("loginCta")}
          registerCta={t("registerCta")}
        />
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pt-32">
      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-[#e6dacd] bg-[linear-gradient(135deg,#fff8f2_0%,#fff1e4_55%,#f7e0cc_100%)] p-6 shadow-[0_22px_48px_rgba(44,26,14,0.08)] sm:rounded-[32px] sm:p-8 lg:p-9"
        >
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#C8842A]/10 blur-2xl" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#6b5a4a]">
              <Heart size={14} className="text-[#C8842A]" />
              {t("collection")}
            </div>
            <h1 className="max-w-2xl text-[2.4rem] leading-none font-bold tracking-tight text-[#2C1A0E] sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6b5a4a]">
              {cafes.length ? t("heroSubtitle") : t("emptySubtitle")}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <div className="rounded-2xl bg-white/75 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b6f58]">
                  {t("total")}
                </p>
                <p className="mt-1 text-xl font-semibold text-[#2C1A0E]">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-2xl bg-white/75 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b6f58]">
                  {t("warmPicks")}
                </p>
                <p className="mt-1 text-xl font-semibold text-[#2C1A0E]">
                  {stats.warm}
                </p>
              </div>
              <div className="col-span-2 rounded-2xl bg-white/75 px-4 py-3 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b6f58]">
                  {t("quiet")}
                </p>
                <p className="mt-1 text-xl font-semibold text-[#2C1A0E]">
                  {stats.quiet}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <SectionCard title={t("title")} subtitle={t("emptySubtitle")}>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#fff8f2] px-4 py-3">
              <span className="text-sm text-[#2C1A0E]">{t("currentMode")}</span>
              <span className="text-sm font-medium text-[#875200]">
                {previewMode ? "Preview" : refreshing ? t("updating") : t("live")}
              </span>
            </div>
          </SectionCard>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              t("warmMinimalismTitle"),
              t("savedFlowTitle"),
            ].map((label, index) => (
              <div
                key={label}
                className="rounded-[28px] border border-[#e6dacd] bg-[#fffaf6] p-5 shadow-[0_18px_40px_rgba(44,26,14,0.05)]"
              >
                <p className="text-sm font-medium text-[#2C1A0E]">{label}</p>
                <p className="mt-1 text-xs leading-5 text-[#6b5a4a]">
                  {index === 0 ? t("warmMinimalismDesc") : t("savedFlowDesc")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {cafes.length === 0 ? (
        <EmptyState
          locale={locale}
          title={t("empty")}
          subtitle={t("emptySubtitle")}
          cta={t("explore")}
        />
      ) : (
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cafes.map((cafe, index) => (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
              locale={locale}
              index={index}
              animationType="slide"
              initialSaved
              onSavedChange={(saved) => removeSavedCafe(cafe.id, saved)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
