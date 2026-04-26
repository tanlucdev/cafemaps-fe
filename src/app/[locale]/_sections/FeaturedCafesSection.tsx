"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, ArrowRight } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Cafe } from "@/types/cafe"

interface FeaturedCafesSectionProps {
  cafes: Cafe[]
  locale: string
}

const RANK_CONFIG = [
  { rank: 1, label: "01", heightClass: "h-72 sm:h-80", order: "order-first sm:order-none col-span-2 sm:col-span-1" },
  { rank: 2, label: "02", heightClass: "h-60 sm:h-64", order: "sm:order-first" },
  { rank: 3, label: "03", heightClass: "h-52 sm:h-56", order: "" },
]

interface PodiumCardProps {
  cafe: Cafe
  locale: string
  rank: number
  label: string
  heightClass: string
  delay: number
}

function PodiumCard({ cafe, locale, rank, label, heightClass, delay }: PodiumCardProps) {
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
      className="group relative rounded-2xl overflow-hidden bg-card border border-border card-shadow hover:-translate-y-1 transition-transform duration-200"
    >
      <Link href={`/${locale}/cafe/${cafe.slug}`} className="block" onClick={saveReturnUrl}>
        {/* Image */}
        <div className={cn("relative overflow-hidden bg-(--background-secondary)", heightClass)}>
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
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

          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

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
  // TODO: replace with API call for weekly featured cafes
  const featured = cafes.slice(0, 3)

  if (featured.length === 0) return null

  // Podium order: display as #2 | #1 | #3 on desktop
  const podiumOrder =
    featured.length >= 3
      ? [featured[1], featured[0], featured[2]]
      : featured.length === 2
      ? [featured[1], featured[0]]
      : [featured[0]]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
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

      {/* Podium grid: mobile = stack, desktop = 3 columns items-end */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:items-end">
        {podiumOrder.map((cafe, displayIdx) => {
          // Map display position back to original rank
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
      <div className="mt-6 text-center sm:hidden">
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
