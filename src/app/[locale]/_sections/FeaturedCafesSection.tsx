"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, ArrowRight, Circle } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Cafe } from "@/types/cafe"

interface FeaturedCafesSectionProps {
  cafes: Cafe[]
  locale: string
}

const RANK_CONFIG = [
  { rank: 1, label: "01", heightClass: "h-64 sm:h-80", order: "order-first sm:order-none" },
  { rank: 2, label: "02", heightClass: "h-56 sm:h-64", order: "sm:order-first" },
  { rank: 3, label: "03", heightClass: "h-52 sm:h-56", order: "" },
]

function isOpenNow(openingHours?: string): boolean | null {
  if (!openingHours) return null
  const match = openingHours.match(/(\d{1,2}):(\d{2})\s*[–\-–]\s*(\d{1,2}):(\d{2})/)
  if (!match) return null
  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()
  const open = parseInt(match[1]) * 60 + parseInt(match[2])
  const close = parseInt(match[3]) * 60 + parseInt(match[4])
  return current >= open && current < close
}

interface PodiumCardProps {
  cafe: Cafe
  locale: string
  rank: number
  label: string
  heightClass: string
  delay: number
}

function PodiumCard({ cafe, locale, rank, label, heightClass, delay }: PodiumCardProps) {
  const openStatus = isOpenNow(cafe.openingHours)

  function saveReturnUrl() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cafe-return-url", window.location.href)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.33, 1, 0.68, 1] }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border card-shadow hover:-translate-y-1 transition-transform duration-200 flex-none w-64 sm:w-auto"
    >
      <Link href={`/${locale}/cafe/${cafe.slug}`} className="block" onClick={saveReturnUrl}>
        {/* Image */}
        <div className={cn("relative overflow-hidden bg-(--background-secondary)", heightClass)}>
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 256px, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={rank === 1}
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-accent to-(--accent-hover)" />
          )}

          {/* Rank badge */}
          <span className={cn(
            "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold backdrop-blur-sm",
            rank === 1
              ? "bg-yellow-400/90 text-yellow-900"
              : rank === 2
              ? "bg-slate-300/90 text-slate-700"
              : "bg-amber-600/90 text-amber-100"
          )}>
            {label}
          </span>

          {/* Open/Closed badge */}
          {openStatus !== null && (
            <span className={cn(
              "absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm",
              openStatus
                ? "bg-green-500/90 text-white"
                : "bg-black/40 text-white/80"
            )}>
              <Circle size={5} className={cn("fill-current", openStatus ? "text-white" : "text-white/60")} />
              {openStatus ? "Đang mở" : "Đã đóng"}
            </span>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />

          {/* Info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <h3 className={cn(
                  "font-display font-bold text-white leading-snug line-clamp-1",
                  rank === 1 ? "text-base sm:text-lg" : "text-sm sm:text-base"
                )}>
                  {cafe.name}
                </h3>
                <p className="flex items-center gap-1 text-white/75 text-xs mt-0.5">
                  <MapPin size={10} className="shrink-0" />
                  <span className="truncate">{cafe.district}</span>
                </p>
              </div>
              {cafe.rating && (
                <span className="flex items-center gap-0.5 shrink-0 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-lora text-xs font-medium text-white">
                    {cafe.rating.toFixed(1)}
                  </span>
                </span>
              )}
            </div>

            {/* Tagline from oneLiner */}
            {cafe.oneLiner && (
              <p className="text-white/60 text-[10px] mt-1 line-clamp-1 italic">
                {cafe.oneLiner}
              </p>
            )}

            {cafe.vibe.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-1.5">
                {cafe.vibe.slice(0, 2).map((v) => (
                  <Badge key={v} label={v} variant="vibe" className="text-[10px] px-2 py-0.5 opacity-90" />
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function FeaturedCafesSection({ cafes, locale }: FeaturedCafesSectionProps) {
  const featured = cafes.slice(0, 3)

  if (featured.length === 0) return null

  const podiumOrder =
    featured.length >= 3
      ? [featured[1], featured[0], featured[2]]
      : featured.length === 2
      ? [featured[1], featured[0]]
      : [featured[0]]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-semibold text-(--foreground-muted) uppercase tracking-widest mb-1">
            Được yêu thích tuần này
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Những quán không thể bỏ lỡ
          </h2>
        </div>
        <Link
          href={`/${locale}/search`}
          className="hidden sm:flex items-center gap-1.5 text-sm text-accent hover:text-(--accent-hover) transition-colors font-medium"
        >
          Xem tất cả
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Mobile: horizontal scroll — Desktop: 3-column podium */}
      <div className="sm:hidden -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
          {podiumOrder.map((cafe) => {
            const originalRank = featured.indexOf(cafe) + 1
            const config = RANK_CONFIG.find((c) => c.rank === originalRank) ?? RANK_CONFIG[0]
            return (
              <div key={cafe.id} className="snap-start">
                <PodiumCard
                  cafe={cafe}
                  locale={locale}
                  rank={originalRank}
                  label={config.label}
                  heightClass={config.heightClass}
                  delay={0}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop podium grid */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4 sm:items-end">
        {podiumOrder.map((cafe, displayIdx) => {
          const originalRank = featured.indexOf(cafe) + 1
          const config = RANK_CONFIG.find((c) => c.rank === originalRank) ?? RANK_CONFIG[0]
          return (
            <div key={cafe.id} className={config.order}>
              <PodiumCard
                cafe={cafe}
                locale={locale}
                rank={originalRank}
                label={config.label}
                heightClass={config.heightClass}
                delay={displayIdx * 0.08}
              />
            </div>
          )
        })}
      </div>

      {/* Mobile explore link */}
      <div className="mt-5 text-center sm:hidden">
        <Link
          href={`/${locale}/search`}
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-(--accent-hover) transition-colors font-medium"
        >
          Xem tất cả quán
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}
