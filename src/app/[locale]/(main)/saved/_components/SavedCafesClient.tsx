"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Bookmark,
  Car,
  Filter,
  FolderPlus,
  MapPin,
  Star,
} from "lucide-react"
import { useTranslations } from "next-intl"
import type { Cafe, SavedCafeEntry } from "@/types/cafe"
import { getCurrentAccessToken } from "@/lib/auth-client"
import { getSavedCafeEntries } from "@/lib/api"
import SaveButton from "@/components/cafe/SaveButton"
import { formatPrice } from "@/lib/utils"

interface SavedCafesClientProps {
  locale: string
  initialIsLoggedIn: boolean
  initialEntries: SavedCafeEntry[]
  previewMode?: boolean
}

type FilterKey = "all" | "district-1" | "district-3" | "open" | "parking"

interface CollectionGroup {
  name: string
  cafes: Cafe[]
}

const FILTER_ORDER: FilterKey[] = [
  "all",
  "district-1",
  "district-3",
  "open",
  "parking",
]

function isOpenNow(cafe: Cafe) {
  if (!cafe.openingTime || !cafe.closingTime) return false

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const [openHour, openMinute] = cafe.openingTime.slice(0, 5).split(":").map(Number)
  const [closeHour, closeMinute] = cafe.closingTime.slice(0, 5).split(":").map(Number)

  const openMinutes = openHour * 60 + openMinute
  const closeMinutes = closeHour * 60 + closeMinute

  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}

function FolderCard({
  group,
  active,
  onClick,
}: {
  group: CollectionGroup
  active: boolean
  onClick: () => void
}) {
  const previewCafes = group.cafes.slice(0, 4)
  const remainder = Math.max(group.cafes.length - 3, 0)

  return (
    <button
      onClick={onClick}
      className="group min-w-[180px] flex-shrink-0 text-left"
      type="button"
    >
      <div
        className={`relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl border transition-all ${
          active
            ? "border-[#c8842a] shadow-[0_12px_30px_rgba(41,23,12,0.12)]"
            : "border-[#d7c3b1] shadow-[0_10px_24px_rgba(41,23,12,0.06)]"
        }`}
      >
        {previewCafes.length >= 3 ? (
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-[2px] bg-[#d7c3b1]">
            {previewCafes.slice(0, 3).map((cafe) => (
              <div key={cafe.id} className="relative h-full w-full bg-[#ffeadf]">
                {cafe.coverImage && (
                  <Image
                    src={cafe.coverImage}
                    alt={cafe.name}
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                )}
              </div>
            ))}
            <div className="flex items-center justify-center bg-[#c8842a] text-white">
              <span className="text-lg font-bold">
                +{remainder > 0 ? remainder : 1}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full bg-[#ffeadf]">
            {group.cafes[0]?.coverImage ? (
              <Image
                src={group.cafes[0].coverImage}
                alt={group.name}
                fill
                sizes="180px"
                className="object-cover"
              />
            ) : null}
          </div>
        )}
      </div>
      <span className="block text-sm font-semibold text-[#29170c]">{group.name}</span>
      <span className="block text-xs text-[#6b5a4a]">{group.cafes.length} quán</span>
    </button>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-[#875200] bg-[#875200] text-white"
          : "border-[#d7c3b1] bg-[#fff1ea] text-[#29170c] hover:bg-[#ffeadf]"
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function SavedGridCard({
  cafe,
  locale,
  featured = false,
  badge,
  onSavedChange,
}: {
  cafe: Cafe
  locale: string
  featured?: boolean
  badge?: string
  onSavedChange: (saved: boolean) => void
}) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-[#d7c3b1] bg-[#fff1ea] shadow-[0_10px_24px_rgba(41,23,12,0.06)] transition-all hover:-translate-y-1 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <div className={`flex h-full ${featured ? "flex-col md:flex-row" : "flex-col"}`}>
        <div className={`relative ${featured ? "md:w-1/2" : ""} aspect-[4/3] overflow-hidden`}>
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 33vw"}
              className="object-cover"
            />
          ) : null}

          <div className="absolute right-4 top-4">
            <SaveButton
              cafeId={cafe.id}
              locale={locale}
              initialSaved
              onSavedChange={onSavedChange}
              className="bg-white/90 text-[#875200] shadow-sm hover:bg-white"
            />
          </div>

          {featured && badge ? (
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {badge}
            </div>
          ) : null}
        </div>

        <div className={`flex flex-1 flex-col ${featured ? "justify-between p-6" : "p-4"}`}>
          <div>
            <div className="mb-2 flex items-center gap-1 text-sm">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-[#29170c]">4.7</span>
              {featured ? (
                <span className="text-xs text-[#6b5a4a]">(124 đánh giá)</span>
              ) : null}
            </div>

            <h3 className={`text-[#29170c] ${featured ? "text-2xl font-bold" : "text-lg font-semibold"}`}>
              {cafe.name}
            </h3>

            <div className="mt-2 flex items-center gap-1 text-sm text-[#6b5a4a]">
              <MapPin size={16} />
              <span>{cafe.district ? `${cafe.district}, TP.HCM` : cafe.address}</span>
            </div>

            {cafe.vibes.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {cafe.vibes.slice(0, featured ? 2 : 1).map((vibe) => (
                  <span
                    key={vibe}
                    className="rounded-lg bg-[#ffdcc1] px-2.5 py-1 text-xs text-[#653e17]"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`mt-5 flex items-center justify-between ${featured ? "pt-6" : ""}`}>
            <span className={`font-medium ${featured ? "text-[#875200]" : "text-sm text-[#6b5a4a]"}`}>
              {formatPrice(cafe.priceMin, cafe.priceMax)}
            </span>
            <Link
              href={`/${locale}/cafe/${cafe.slug}`}
              className={`${featured ? "text-sm font-medium text-[#875200]" : "text-sm text-red-600 opacity-0 transition-opacity group-hover:opacity-100"}`}
            >
              {featured ? "Xem chi tiết" : "Gỡ"}
            </Link>
          </div>
        </div>
      </div>
    </article>
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
    <section className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-44 w-44 items-center justify-center rounded-full bg-[#ffeadf]">
        <Bookmark size={72} className="text-[#847465]" />
      </div>
      <h2 className="text-2xl font-bold text-[#29170c]">{title}</h2>
      <p className="mt-2 max-w-sm text-[#6b5a4a]">{subtitle}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 rounded-xl bg-[#875200] px-6 py-3 text-sm font-medium text-white"
      >
        {cta}
      </Link>
    </section>
  )
}

export default function SavedCafesClient({
  locale,
  initialIsLoggedIn,
  initialEntries,
  previewMode = false,
}: SavedCafesClientProps) {
  const t = useTranslations("saved")
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [entries, setEntries] = useState(initialEntries)
  const [activeCollection, setActiveCollection] = useState<string>("all")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

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
    if (previewMode || !isLoggedIn) return

    let alive = true
    ;(async () => {
      const token = await getCurrentAccessToken()
      if (!token) {
        if (alive) setEntries([])
        return
      }

      const nextEntries = await getSavedCafeEntries(token)
      if (alive) setEntries(nextEntries)
    })()

    return () => {
      alive = false
    }
  }, [isLoggedIn, previewMode])

  const collections = useMemo<CollectionGroup[]>(() => {
    const map = new Map<string, Cafe[]>()
    for (const entry of entries) {
      const key = entry.collectionName?.trim() || "Yeu thich"
      const current = map.get(key) ?? []
      current.push(entry.cafe)
      map.set(key, current)
    }
    return Array.from(map.entries()).map(([name, cafes]) => ({ name, cafes }))
  }, [entries])

  useEffect(() => {
    if (collections.length === 0) {
      setActiveCollection("all")
      return
    }

    if (activeCollection === "all") return
    if (!collections.some((collection) => collection.name === activeCollection)) {
      setActiveCollection(collections[0].name)
    }
  }, [activeCollection, collections])

  const visibleCafes = useMemo(() => {
    const selectedCollection =
      activeCollection === "all"
        ? entries.map((entry) => entry.cafe)
        : collections.find((collection) => collection.name === activeCollection)?.cafes ?? []

    switch (activeFilter) {
      case "district-1":
        return selectedCollection.filter((cafe) => cafe.district === "Quận 1")
      case "district-3":
        return selectedCollection.filter((cafe) => cafe.district === "Quận 3")
      case "open":
        return selectedCollection.filter(isOpenNow)
      case "parking":
        return selectedCollection.filter((cafe) =>
          cafe.amenities.some((amenity) => amenity.toLowerCase().includes("đậu xe"))
        )
      default:
        return selectedCollection
    }
  }, [activeCollection, activeFilter, collections, entries])

  function handleSavedChange(cafeId: string, saved: boolean) {
    if (!saved) {
      setEntries((current) => current.filter((entry) => entry.cafe.id !== cafeId))
    }
  }

  if (!previewMode && !isLoggedIn) {
    return (
      <section className="mx-auto max-w-[1280px] px-6 pb-12 pt-24">
        <div className="rounded-2xl border border-[#d7c3b1] bg-[#fff1ea] p-8 text-[#29170c] shadow-[0_10px_40px_rgba(41,23,12,0.06)]">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-3 max-w-xl text-[#6b5a4a]">{t("loginRequired")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/login`}
              className="rounded-xl bg-[#875200] px-5 py-3 text-sm font-medium text-white"
            >
              {t("loginCta")}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="rounded-xl border border-[#d7c3b1] bg-white px-5 py-3 text-sm font-medium text-[#29170c]"
            >
              {t("registerCta")}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-6 lg:pt-32">
      <section className="mb-10">
        <h1 className="mb-4 text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-[#29170c] sm:text-[3.5rem]">
          Bộ sưu tập của bạn
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-[#524437]">
          Lưu lại những không gian yêu thích để dễ dàng ghé thăm sau này. Mỗi quán cafe là một câu chuyện chờ bạn khám phá.
        </p>
      </section>

      <section className="mb-10 overflow-hidden">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[#29170c]">Thư mục đã lưu</h2>
          <button
            type="button"
            className="hidden items-center gap-2 text-sm font-medium text-[#875200] transition-all hover:underline sm:inline-flex"
          >
            <FolderPlus size={18} />
            Tạo thư mục mới
          </button>
        </div>

        <div className="-mx-1 flex gap-5 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FolderCard
            group={{ name: "Tất cả", cafes: entries.map((entry) => entry.cafe) }}
            active={activeCollection === "all"}
            onClick={() => setActiveCollection("all")}
          />
          {collections.map((collection) => (
            <FolderCard
              key={collection.name}
              group={collection}
              active={activeCollection === collection.name}
              onClick={() => setActiveCollection(collection.name)}
            />
          ))}
        </div>
      </section>

      <section className="mb-6 flex flex-wrap items-center gap-2">
        {FILTER_ORDER.map((filter) => {
          if (filter === "all") {
            return (
              <FilterChip
                key={filter}
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                icon={<Filter size={16} />}
              >
                Tất cả
              </FilterChip>
            )
          }

          if (filter === "district-1") {
            return (
              <FilterChip
                key={filter}
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                Quận 1
              </FilterChip>
            )
          }

          if (filter === "district-3") {
            return (
              <FilterChip
                key={filter}
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                Quận 3
              </FilterChip>
            )
          }

          if (filter === "open") {
            return (
              <FilterChip
                key={filter}
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                icon={<span className="h-2 w-2 rounded-full bg-emerald-500" />}
              >
                Mở cửa
              </FilterChip>
            )
          }

          return (
            <FilterChip
              key={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              icon={<Car size={16} />}
            >
              Có chỗ đậu xe
            </FilterChip>
          )
        })}
      </section>

      {visibleCafes.length === 0 ? (
        <EmptyState
          locale={locale}
          title={t("empty")}
          subtitle={t("emptySubtitle")}
          cta={t("explore")}
        />
      ) : (
        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCafes.map((cafe, index) => (
            <SavedGridCard
              key={cafe.id}
              cafe={cafe}
              locale={locale}
              featured={index === 0}
              badge={index === 0 ? "Sáng nay đi đâu?" : undefined}
              onSavedChange={(saved) => handleSavedChange(cafe.id, saved)}
            />
          ))}
        </section>
      )}
    </section>
  )
}
