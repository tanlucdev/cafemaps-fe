"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  MapPin,
  Clock,
  Star,
  Coffee,
  ChevronLeft,
  ExternalLink,
  Wifi,
  AirVent,
  Car,
  TreePine,
  Zap,
  PawPrint,
  ChevronDown,
  Share2,
} from "lucide-react"
import ImageGallery from "@/components/cafe/ImageGallery"
import SaveButton from "@/components/cafe/SaveButton"
import Badge from "@/components/ui/Badge"
import { formatPriceRange } from "@/lib/utils"
import type { Cafe } from "@/types/cafe"
import { useTranslations } from "next-intl"

interface CafeDetailContentProps {
  cafe: Cafe
  locale: string
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  "điều hoà": <AirVent size={14} />,
  "đậu xe": <Car size={14} />,
  "ngoài trời": <TreePine size={14} />,
  "ổ cắm": <Zap size={14} />,
  "thú cưng": <PawPrint size={14} />,
}

function getAmenityIcon(amenity: string) {
  const key = Object.keys(AMENITY_ICONS).find((k) =>
    amenity.toLowerCase().includes(k)
  )
  return key ? AMENITY_ICONS[key] : <Wifi size={14} />
}

export default function CafeDetailContent({ cafe }: CafeDetailContentProps) {
  const t = useTranslations("cafe")
  const tc = useTranslations("common")
  const router = useRouter()
  const [hoursExpanded, setHoursExpanded] = useState(false)

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cafe.lat},${cafe.lng}`

  return (
    <article className="min-h-screen pt-16">
      {/* Top bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={() => {
            const returnUrl = typeof window !== "undefined"
              ? sessionStorage.getItem("cafe-return-url")
              : null
            if (returnUrl) {
              sessionStorage.removeItem("cafe-return-url")
              router.push(returnUrl)
            } else {
              router.back()
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm text-(--foreground-muted) hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          {tc("back")}
        </button>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm text-(--foreground-muted) hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-accent">
            <Share2 size={14} />
            {t("share")}
          </button>
          <SaveButton cafeId={cafe.id} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {/* Hero gallery — full width */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ImageGallery images={cafe.images} altPrefix={cafe.name} />
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left — main info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 min-w-0 space-y-6"
          >
            {/* Name + rating */}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
                {cafe.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                {cafe.rating && (
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-accent fill-accent" />
                    <span className="font-lora font-medium text-foreground text-base">
                      {cafe.rating.toFixed(1)}
                    </span>
                    {cafe.reviewCount && (
                      <span className="text-(--foreground-muted)">
                        ({cafe.reviewCount} {t("reviews")})
                      </span>
                    )}
                  </span>
                )}
                <span className="flex items-center gap-1 text-(--foreground-muted)">
                  <MapPin size={13} />
                  {cafe.district}
                </span>
                {cafe.priceRange && (
                  <span className="px-2.5 py-0.5 rounded-full bg-(--accent-light) text-accent text-xs font-medium">
                    {formatPriceRange(cafe.priceRange)}
                  </span>
                )}
              </div>
            </div>

            {/* Vibe + purpose tags */}
            <div className="flex flex-wrap gap-2">
              {cafe.vibe.map((v) => <Badge key={v} label={v} variant="vibe" />)}
              {cafe.purpose.map((p) => <Badge key={p} label={p} />)}
            </div>

            <hr className="border-border" />

            {/* Description */}
            {cafe.description && (
              <div>
                <h2 className="font-semibold text-foreground mb-2">{t("about")}</h2>
                <p className="text-(--foreground-muted) leading-relaxed text-sm">
                  {cafe.description}
                </p>
              </div>
            )}

            {/* Signature drink */}
            {cafe.signatureDrink && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-(--background-secondary) border border-border">
                <Coffee size={16} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-(--foreground-muted) mb-0.5">{t("signatureDrink")}</p>
                  <p className="text-sm font-medium text-foreground">{cafe.signatureDrink}</p>
                </div>
              </div>
            )}

            {/* Address full */}
            <div className="flex items-start gap-3 text-sm text-(--foreground-muted)">
              <MapPin size={15} className="shrink-0 mt-0.5" />
              <span>{cafe.address}</span>
            </div>
          </motion.div>

          {/* Right — sticky action card */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-72 xl:w-80 shrink-0"
          >
            <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Open status */}
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-foreground">{t("openNow")}</span>
                </div>
                {cafe.openingHours && (
                  <p className="text-sm text-(--foreground-muted) mb-2">
                    <Clock size={12} className="inline mr-1" />
                    {cafe.openingHours}
                  </p>
                )}
                <button
                  onClick={() => setHoursExpanded(!hoursExpanded)}
                  className="flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  {hoursExpanded ? t("detail.collapseHours") : t("detail.seeFullHours")}
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${hoursExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {hoursExpanded && (
                  <div className="mt-3 space-y-1 text-xs text-(--foreground-muted)">
                    {["mon","tue","wed","thu","fri","sat","sun"].map((day) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{t(`detail.days.${day}`)}</span>
                        <span>{cafe.openingHours ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              {cafe.priceRange && (
                <div className="px-5 py-3 border-b border-border text-sm">
                  <span className="text-(--foreground-muted) mr-2">Giá:</span>
                  <span className="font-medium text-foreground">{formatPriceRange(cafe.priceRange)}</span>
                </div>
              )}

              {/* Amenities with icons */}
              {cafe.amenities && cafe.amenities.length > 0 && (
                <div className="px-5 py-4 border-b border-border space-y-2.5">
                  {cafe.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 text-sm text-(--foreground-muted)">
                      <span className="text-accent">{getAmenityIcon(a)}</span>
                      {a}
                    </div>
                  ))}
                </div>
              )}

              {/* CTA buttons */}
              <div className="px-5 py-4 space-y-2.5">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-accent text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors"
                >
                  {t("detail.goNow")}
                  <ExternalLink size={14} />
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-border text-sm font-medium text-(--foreground-muted) hover:border-accent hover:text-accent transition-all"
                >
                  <MapPin size={14} />
                  {t("detail.viewOnMap")}
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </article>
  )
}
