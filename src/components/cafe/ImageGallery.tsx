"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { X, ZoomIn } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface ImageGalleryProps {
  images: string[]
  altPrefix?: string
}

export default function ImageGallery({ images, altPrefix = "Ảnh quán" }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const openLightbox = useCallback(() => setLightbox(true), [])
  const closeLightbox = useCallback(() => setLightbox(false), [])

  if (!images || images.length === 0) {
    return (
      <div className="aspect-3/2 lg:aspect-video rounded-2xl bg-(--background-secondary) flex items-center justify-center">
        <span className="text-(--foreground-muted) text-sm">Chưa có ảnh</span>
      </div>
    )
  }

  const THUMB_VISIBLE = 4
  const extraCount = images.length - THUMB_VISIBLE

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-3/2 lg:aspect-video rounded-2xl overflow-hidden cursor-zoom-in bg-(--background-secondary) group"
        onClick={openLightbox}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${altPrefix} ${active + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={16} className="text-white" />
        </div>

        {/* Image count badge */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnail strip — only if 2+ images */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.slice(0, THUMB_VISIBLE).map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                "relative aspect-square lg:aspect-[90/68] w-18 lg:w-[90px] shrink-0 rounded-xl overflow-hidden transition-all duration-200",
                active === i
                  ? "ring-2 ring-accent ring-offset-2"
                  : "opacity-60 hover:opacity-90",
              ].join(" ")}
            >
              <Image
                src={src}
                alt={`${altPrefix} thumbnail ${i + 1}`}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}

          {/* "+N more" button */}
          {extraCount > 0 && (
            <button
              onClick={openLightbox}
              className="relative aspect-square lg:aspect-[90/68] w-18 lg:w-[90px] shrink-0 rounded-xl overflow-hidden bg-(--background-secondary) border border-border flex items-center justify-center hover:bg-(--accent-light) transition-colors"
            >
              <Image
                src={images[THUMB_VISIBLE]}
                alt="more"
                fill
                sizes="72px"
                className="object-cover opacity-40"
              />
              <span className="relative z-10 text-xs font-semibold text-foreground">
                +{extraCount}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={closeLightbox}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div
              className="flex-1 relative mx-4 mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${altPrefix} ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {images.length > 1 && (
              <div
                className="flex gap-2 justify-center pb-4 px-4 overflow-x-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={[
                      "relative aspect-square w-14 shrink-0 rounded-lg overflow-hidden transition-all",
                      active === i ? "ring-2 ring-white" : "opacity-50 hover:opacity-80",
                    ].join(" ")}
                  >
                    <Image src={src} alt={`thumb ${i + 1}`} fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
