"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Clock } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { formatPrice, formatOpeningHours } from "@/lib/utils"
import type { Cafe } from "@/types/cafe"

interface CafeListProps {
  cafes: Cafe[]
  locale: string
  animationType?: "slide" | "fade"
}

export default function CafeList({ cafes, locale, animationType = "slide" }: CafeListProps) {
  if (cafes.length === 0) {
    return (
      <div className="py-16 text-center text-(--foreground-muted) text-sm">
        Không tìm thấy quán nào
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {cafes.map((cafe, index) => (
        <motion.article
          key={cafe.id}
          initial={animationType === "slide" ? { opacity: 0, y: 8 } : { opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationType === "slide" ? 0.25 : 0.15, delay: animationType === "slide" ? (index % 6) * 0.04 : 0, ease: [0.33, 1, 0.68, 1] }}
          className="group rounded-2xl overflow-hidden bg-card border border-border card-shadow hover:-translate-y-0.5"
        >
          <Link href={`/${locale}/cafe/${cafe.slug}`} className="flex gap-0 h-full">
            {/* Image */}
            <div className="relative w-28 sm:w-36 md:w-44 shrink-0 overflow-hidden bg-(--background-secondary)">
              {cafe.coverImage ? (
                <Image
                  src={cafe.coverImage}
                  alt={cafe.name}
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 176px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-accent to-(--accent-hover)" />
              )}
              {formatPrice(cafe.priceMin, cafe.priceMax) && (
                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium">
                  {formatPrice(cafe.priceMin, cafe.priceMax)}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-3.5 flex flex-col justify-between min-w-0">
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-sm sm:text-base text-foreground leading-snug line-clamp-1">
                    {cafe.name}
                  </h3>
                </div>

                <p className="flex items-center gap-1 text-xs text-(--foreground-muted)">
                  <MapPin size={10} className="shrink-0" />
                  <span className="truncate">{cafe.address}, {cafe.district}</span>
                </p>

                {formatOpeningHours(cafe.openingTime, cafe.closingTime) && (
                  <p className="flex items-center gap-1 text-xs text-(--foreground-muted)">
                    <Clock size={10} className="shrink-0" />
                    <span>{formatOpeningHours(cafe.openingTime, cafe.closingTime)}</span>
                  </p>
                )}
              </div>

              {cafe.vibes.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mt-2.5">
                  {cafe.vibes.slice(0, 3).map((v) => (
                    <Badge key={v} label={v} variant="vibe" />
                  ))}
                </div>
              )}
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}
