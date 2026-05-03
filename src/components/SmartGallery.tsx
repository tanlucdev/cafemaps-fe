"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from "lucide-react"

interface SmartGalleryProps {
  images: string[]
  orientations?: string[]
  cafeName: string
}

export default function SmartGallery({
  images,
  orientations = [],
  cafeName,
}: SmartGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const getO = useCallback(
    (i: number) => orientations[i] || "landscape",
    [orientations]
  )

  const isPortrait = useCallback((i: number) => getO(i) === "portrait", [getO])

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index)
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const moveLightbox = useCallback(
    (direction: -1 | 1) => {
      if (lightboxIndex === null) return
      const next = (lightboxIndex + direction + images.length) % images.length
      setLightboxIndex(next)
      setActiveIndex(next)
    },
    [images.length, lightboxIndex]
  )

  useEffect(() => {
    if (lightboxIndex === null) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox()
      if (event.key === "ArrowLeft") moveLightbox(-1)
      if (event.key === "ArrowRight") moveLightbox(1)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [closeLightbox, lightboxIndex, moveLightbox])

  if (!images || images.length === 0) return null

  const visibleImages = images.slice(0, 5)
  const overflowCount = images.length - visibleImages.length

  function imageButton(
    url: string,
    index: number,
    className: string,
    sizes: string,
    priority = false,
    showOverflow = false
  ) {
    return (
      <button
        key={`${url}-${index}`}
        type="button"
        onClick={() => openLightbox(index)}
        aria-label={`Xem ảnh ${index + 1} của ${cafeName}`}
        className={`group relative overflow-hidden bg-(--background-secondary) ${className}`}
      >
        <Image
          src={url}
          alt={`${cafeName} ${index + 1}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: isPortrait(index) ? "center 42%" : "center" }}
          priority={priority}
        />
        <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/12" />
        <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ZoomIn size={16} />
        </span>
        {showOverflow && overflowCount > 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/48 text-sm font-semibold text-white backdrop-blur-[1px]">
            +{overflowCount} ảnh
          </span>
        )}
      </button>
    )
  }

  const mobileGallery = (
    <div className="md:hidden">
      <button
        type="button"
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-(--background-secondary)"
        onClick={() => openLightbox(activeIndex)}
        aria-label={`Xem rõ ảnh ${activeIndex + 1} của ${cafeName}`}
      >
        <Image
          src={images[activeIndex]}
          alt={`${cafeName} ${activeIndex + 1}`}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: isPortrait(activeIndex) ? "center 42%" : "center" }}
          priority={activeIndex === 0}
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </button>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                i === activeIndex
                  ? "ring-2 ring-amber-500 opacity-100"
                  : "opacity-55 hover:opacity-80"
              }`}
              style={{
                width: isPortrait(i) ? "40px" : "56px",
                height: "40px",
              }}
            >
              <Image
                src={url}
                alt=""
                width={56}
                height={40}
                sizes="56px"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const desktopShellClass = "hidden md:grid h-[460px] lg:h-[520px] overflow-hidden rounded-2xl"
  let desktopGallery

  if (images.length === 1) {
    desktopGallery = (
      <div className={desktopShellClass}>
        {imageButton(images[0], 0, "h-full w-full", "900px", true)}
      </div>
    )
  } else if (images.length === 2) {
    desktopGallery = (
      <div className={`${desktopShellClass} grid-cols-2 gap-2`}>
        {images.map((url, i) =>
          imageButton(url, i, "h-full w-full", "(max-width: 1024px) 50vw, 450px", i === 0)
        )}
      </div>
    )
  } else {
    const useCompactTiles = images.length >= 5
    const sideGridClass = useCompactTiles
      ? "grid grid-cols-2 grid-rows-2 gap-2"
      : images.length === 4
        ? "grid grid-rows-3 gap-2"
        : "grid grid-rows-2 gap-2"

    desktopGallery = (
      <div className={`${desktopShellClass} grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-2`}>
        {imageButton(images[0], 0, "h-full w-full", "(max-width: 1024px) 56vw, 540px", true)}
        <div className={sideGridClass}>
          {visibleImages.slice(1).map((url, idx) => {
            const imageIndex = idx + 1
            return imageButton(
              url,
              imageIndex,
              "h-full w-full",
              useCompactTiles ? "(max-width: 1024px) 22vw, 220px" : "(max-width: 1024px) 44vw, 360px",
              false,
              imageIndex === visibleImages.length - 1
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      {mobileGallery}
      {desktopGallery}
      <button
        type="button"
        onClick={() => openLightbox(0)}
        className="mt-3 hidden items-center gap-2 text-sm font-medium text-(--foreground-muted) transition-colors hover:text-accent md:inline-flex"
      >
        <Images size={16} />
        Xem tất cả {images.length} ảnh
      </button>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh ${lightboxIndex + 1} của ${cafeName}`}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-medium">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Đóng ảnh"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 px-4 pb-4" onClick={(event) => event.stopPropagation()}>
            <Image
              src={images[lightboxIndex]}
              alt={`${cafeName} ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => moveLightbox(-1)}
                  aria-label="Ảnh trước"
                  className="absolute left-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:inline-flex"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => moveLightbox(1)}
                  aria-label="Ảnh sau"
                  className="absolute right-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:inline-flex"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto px-4 pb-4"
              onClick={(event) => event.stopPropagation()}
            >
              {images.map((url, index) => (
                <button
                  key={`${url}-lightbox-${index}`}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index)
                    setLightboxIndex(index)
                  }}
                  aria-label={`Chuyển tới ảnh ${index + 1}`}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all ${
                    index === lightboxIndex ? "ring-2 ring-white opacity-100" : "opacity-55 hover:opacity-85"
                  }`}
                >
                  <Image src={url} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
