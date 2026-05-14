"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Star } from "lucide-react"
import type { Cafe } from "@/types/cafe"
import { cn, formatPrice } from "@/lib/utils"

const POPUP_WIDTH = 280
const POPUP_GAP = 12

const VIBE_TAG_CLASSES: Record<string, string> = {
  "yên tĩnh": "bg-[#E0F2F1]/90 text-[#00695C]",
  "nhộn nhịp": "bg-[#FFF3E0]/90 text-[#E65100]",
  vintage: "bg-[#FCE4EC]/90 text-[#C2185B]",
  "hiện đại": "bg-[#E1F5FE]/90 text-[#0277BD]",
  "thiên nhiên": "bg-[#E8F5E9]/90 text-[#2E7D32]",
  "sáng tạo": "bg-[#F3E5F5]/90 text-[#7B1FA2]",
  "lãng mạn": "bg-[#FCE4EC]/90 text-[#AD1457]",
  minimalist: "bg-[#F5F5F5]/90 text-[#424242]",
}

interface CafePreviewPopupProps {
  cafe: Cafe
  anchorRect: DOMRect
  locale: string
  visible: boolean
}

function computePosition(rect: DOMRect): { left: number; top: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight

  let left = rect.right + POPUP_GAP + window.scrollX
  if (rect.right + POPUP_GAP + POPUP_WIDTH > vw) {
    left = rect.left - POPUP_GAP - POPUP_WIDTH + window.scrollX
  }

  const estimatedHeight = 360
  let top = rect.top + window.scrollY
  if (rect.top + estimatedHeight > vh) {
    top = Math.max(8 + window.scrollY, rect.bottom + window.scrollY - estimatedHeight)
  }

  return { left: Math.max(8, left), top: Math.max(8, top) }
}

function buildGallery(cafe: Cafe): string[] {
  const all: string[] = []
  if (cafe.coverImage) all.push(cafe.coverImage)
  for (const img of cafe.images ?? []) {
    if (!all.includes(img)) all.push(img)
  }
  return all.slice(0, 3)
}

function ratingFor(index: number) {
  return (4.5 + (index % 5) * 0.1).toFixed(1)
}

function PopupContent({ cafe, anchorRect }: Omit<CafePreviewPopupProps, "visible">) {
  const pos = computePosition(anchorRect)
  const gallery = buildGallery(cafe)
  const [cover, ...thumbs] = gallery
  const price = formatPrice(cafe.priceMin, cafe.priceMax)
  const tags = cafe.vibes.length > 0 ? cafe.vibes.slice(0, 2) : cafe.purposes.slice(0, 2)
  const location = cafe.district || cafe.address || ""

  return (
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 6 }}
      transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        width: POPUP_WIDTH,
        zIndex: 9999,
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
      className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(41,23,12,0.18)] ring-1 ring-[#D7C3B1]/40"
    >
      {/* Cover image */}
      <div className="relative w-full overflow-hidden" style={{ height: 160 }}>
        {cover ? (
          <Image
            src={cover}
            alt={cafe.name}
            fill
            sizes="280px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFEADF] via-[#F7DFC6] to-[#DDE9D8]" />
        )}
        {/* Price badge */}
        {price && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-[#402C1F]/80 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            {price}
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {thumbs.length > 0 && (
        <div className="flex gap-px bg-[#D7C3B1]/30" style={{ height: 72 }}>
          {thumbs.map((src, i) => (
            <div key={i} className="relative overflow-hidden" style={{ flex: 1 }}>
              <Image
                src={src}
                alt={`${cafe.name} ${i + 2}`}
                fill
                sizes="140px"
                className="object-cover"
                priority={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Info section */}
      <div className="px-3.5 py-3 bg-white">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-sm font-bold text-[#29170C] leading-tight line-clamp-1 flex-1">
            {cafe.name}
          </h4>
          <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-[#FFEADF] px-1.5 py-0.5">
            <Star size={10} className="fill-[#BB885A] text-[#BB885A]" />
            <span className="text-[10px] font-semibold text-[#29170C]">
              {ratingFor(0)}
            </span>
          </div>
        </div>

        {/* Location */}
        {location && (
          <p className="flex items-center gap-1 text-xs text-[#847465] mb-2">
            <MapPin size={11} className="shrink-0 text-[#875200]" />
            <span className="truncate">{location}</span>
          </p>
        )}

        {/* Vibe tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                  VIBE_TAG_CLASSES[tag] ?? "bg-[#F0E8DC] text-[#524437]",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function CafePreviewPopup(props: CafePreviewPopupProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {props.visible && (
        <PopupContent
          cafe={props.cafe}
          anchorRect={props.anchorRect}
          locale={props.locale}
        />
      )}
    </AnimatePresence>,
    document.body,
  )
}
