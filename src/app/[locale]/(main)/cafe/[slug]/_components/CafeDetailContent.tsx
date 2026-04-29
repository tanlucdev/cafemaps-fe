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
  Share2,
  Heart,
  Wifi,
  AirVent,
  Car,
  TreePine,
  Zap,
  PawPrint,
} from "lucide-react"
import ImageGallery from "@/components/cafe/ImageGallery"
import Badge from "@/components/ui/Badge"
import { formatPriceRange } from "@/lib/utils"
import type { Cafe } from "@/types/cafe"
import { useTranslations } from "next-intl"
import { toggleSaveCafe } from "@/lib/api"

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
  const [saved, setSaved] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cafe.lat},${cafe.lng}`

  async function handleSave() {
    setLoadingSave(true)
    const prev = saved
    setSaved((s) => !s)
    try {
      const result = await toggleSaveCafe(cafe.id, "")
      setSaved(result.saved)
    } catch {
      setSaved(prev)
    } finally {
      setLoadingSave(false)
    }
  }

  return (
    <article className="min-h-screen pt-16 pb-36 md:pb-24">
      {/* Top bar */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
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
        <button className="inline-flex items-center gap-1.5 text-sm text-(--foreground-muted) hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-accent">
          <Share2 size={14} />
          {t("share")}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-4 space-y-6">
        {/* 1. Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageGallery images={cafe.images} altPrefix={cafe.name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* 2. Name + Save */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {cafe.name}
            </h1>
            <button
              onClick={handleSave}
              disabled={loadingSave}
              aria-label={saved ? "Bỏ lưu" : "Lưu quán"}
              className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-200 ${
                saved
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-border bg-(--background-secondary) text-(--foreground-muted) hover:text-accent hover:border-accent hover:bg-(--accent-light)"
              }`}
            >
              <Heart size={20} className={saved ? "fill-white" : ""} />
            </button>
          </div>

          {/* 3. Rating + open status badge */}
          <div className="flex flex-wrap items-center gap-3">
            {cafe.rating && (
              <span className="flex items-center gap-1.5">
                <Star size={14} className="text-accent fill-accent" />
                <span className="font-lora font-medium text-foreground">
                  {cafe.rating.toFixed(1)}
                </span>
                {cafe.reviewCount && (
                  <span className="text-(--foreground-muted) text-sm">
                    ({cafe.reviewCount} {t("reviews")})
                  </span>
                )}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-green-700 dark:text-green-400 font-medium text-xs">
                {t("openNow")}
              </span>
            </span>
          </div>

          {/* 4. Address + Hours — same row */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-2 gap-x-5 text-sm text-(--foreground-muted)">
            <span className="flex items-start gap-1.5">
              <MapPin size={14} className="shrink-0 mt-0.5 text-accent" />
              {cafe.address}
            </span>
            {cafe.openingHours && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="shrink-0 text-accent" />
                {cafe.openingHours}
              </span>
            )}
          </div>

          {/* 5. Vibe + Purpose tags */}
          {(cafe.vibe.length > 0 || cafe.purpose.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {cafe.vibe.map((v) => <Badge key={v} label={v} variant="vibe" />)}
              {cafe.purpose.map((p) => <Badge key={p} label={p} />)}
            </div>
          )}

          <hr className="border-border" />

          {/* 6. About */}
          {cafe.description && (
            <div>
              <h2 className="font-semibold text-foreground mb-2">{t("about")}</h2>
              <p className="text-(--foreground-muted) leading-relaxed text-sm">
                {cafe.description}
              </p>
            </div>
          )}

          {/* 7. Amenities as icon chips */}
          {cafe.amenities && cafe.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cafe.amenities.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-(--background-secondary) text-sm text-(--foreground-muted)"
                >
                  <span className="text-accent">{getAmenityIcon(a)}</span>
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* 8. Signature drink highlight card */}
          {cafe.signatureDrink && (
            <div className="flex items-center gap-3 rounded-xl p-3 bg-[#F0E8DC] dark:bg-[#3D2510] border border-[#E8D8C0] dark:border-[#4A2E14]">
              <Coffee size={18} className="text-accent shrink-0" />
              <div>
                <p className="text-xs text-(--foreground-muted) mb-0.5">{t("signatureDrink")}</p>
                <p className="text-sm font-semibold text-foreground">{cafe.signatureDrink}</p>
              </div>
            </div>
          )}

          {/* 9. Price range */}
          {cafe.priceRange && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-(--foreground-muted)">Khoảng giá:</span>
              <span className="px-3 py-1 rounded-full bg-(--accent-light) text-accent font-medium">
                {formatPriceRange(cafe.priceRange)}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* 10. Sticky bottom CTA — above mobile bottom nav */}
      <div
        className="fixed bottom-14 md:bottom-0 left-0 right-0 z-30 bg-(--background)/95 backdrop-blur-md border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
          <button
            onClick={handleSave}
            disabled={loadingSave}
            aria-label={saved ? "Bỏ lưu" : "Lưu quán"}
            className={`flex items-center gap-2 h-12 px-5 rounded-xl border font-medium text-sm transition-all duration-200 ${
              saved
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
            }`}
          >
            <Heart size={16} className={saved ? "fill-white" : ""} />
            Lưu
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-(--accent-hover) transition-colors"
          >
            <MapPin size={16} />
            Chỉ đường
          </a>
        </div>
      </div>
    </article>
  )
}
