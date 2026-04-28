"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Star } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { formatPriceRange } from "@/lib/utils"
import type { Cafe } from "@/types/cafe"

interface CafeCardProps {
  cafe: Cafe
  locale: string
  index?: number
  animationType?: "slide" | "fade"
}

export default function CafeCard({ cafe, locale, index = 0, animationType = "fade" }: CafeCardProps) {
  const isSlide = animationType === "slide"

  function saveReturnUrl() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cafe-return-url", window.location.href)
    }
  }

  return (
    <motion.article
      {...(isSlide ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.25,
          delay: Math.min(index, 2) * 0.05,
          ease: [0.33, 1, 0.68, 1],
        },
      } : {})}
      className="group rounded-2xl overflow-hidden bg-card border border-border card-shadow hover:-translate-y-1"
    >
      <Link href={`/${locale}/cafe/${cafe.slug}`} className="block" onClick={saveReturnUrl}>
        {/* Image — 3:2 ratio */}
        <div className="relative aspect-3/2 overflow-hidden bg-(--background-secondary)">
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-104"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-accent to-(--accent-hover) flex items-end p-4">
              <span className="font-display text-2xl font-bold text-white/90 leading-tight">
                {cafe.name}
              </span>
            </div>
          )}
          {cafe.priceRange && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/35 backdrop-blur-sm text-white text-xs font-medium">
              {formatPriceRange(cafe.priceRange)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-1">
              {cafe.name}
            </h3>
            {cafe.rating && (
              <span className="flex items-center gap-0.5 shrink-0">
                <Star size={11} className="text-accent fill-accent" />
                <span className="font-lora text-xs font-medium text-foreground">
                  {cafe.rating.toFixed(1)}
                </span>
              </span>
            )}
          </div>

          <p className="flex items-center gap-1 text-xs text-(--foreground-muted)">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{cafe.district}, {cafe.city}</span>
          </p>

          {cafe.vibe.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {cafe.vibe.slice(0, 2).map((v) => (
                <Badge key={v} label={v} variant="vibe" />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}
