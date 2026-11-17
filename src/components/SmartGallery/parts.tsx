"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface MobileMainImageProps {
  images: string[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  objectPosition: (i: number) => string;
  cafeName: string;
  onTap: () => void;
}

export function MobileMainImage({
  images,
  activeIndex,
  setActiveIndex,
  objectPosition,
  cafeName,
  onTap,
}: MobileMainImageProps) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      onTap();
      return;
    }
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 40) return;
    if (dx < 0) {
      setActiveIndex((activeIndex + 1) % images.length);
    } else {
      setActiveIndex((activeIndex - 1 + images.length) % images.length);
    }
  }

  const prevIndex = (activeIndex - 1 + images.length) % images.length;
  const nextIndex = (activeIndex + 1) % images.length;
  const preloadIndices = new Set([prevIndex, activeIndex, nextIndex]);

  return (
    <div
      className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-(--background-secondary) select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((src, i) => {
        if (!preloadIndices.has(i)) return null;
        const isActive = i === activeIndex;
        return (
          <Image
            key={i}
            src={src}
            alt={`${cafeName} ${i + 1}`}
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-200 ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
            style={{ objectPosition: objectPosition(i) }}
            priority={i === 0}
            quality={90}
            aria-hidden={!isActive}
          />
        );
      })}
      {images.length > 1 && (
        <div className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export function GalleryLightbox({ images, lightboxIndex, cafeName, closeLightbox, moveLightbox, renderedIndices, setActiveIndex, setLightboxIndex, objectPosition }: {
  images: string[];
  lightboxIndex: number;
  cafeName: string;
  closeLightbox: () => void;
  moveLightbox: (direction: -1 | 1) => void;
  renderedIndices: Set<number>;
  setActiveIndex: (index: number) => void;
  setLightboxIndex: (index: number) => void;
  objectPosition: (index: number) => string;
}) {
  const t = useTranslations("gallery");
  const lightboxTouchX = useRef<number | null>(null);
  return typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[2147483647] h-[100dvh] overflow-hidden bg-[#120b06] text-white md:grid md:place-items-center md:bg-[#2c1a0e]/54 md:px-3 md:pt-[max(0.75rem,env(safe-area-inset-top))] md:pb-[max(0.75rem,env(safe-area-inset-bottom))] md:backdrop-blur-md lg:p-5"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={t("imageOf", { index: lightboxIndex + 1, cafeName })}
          >
            <div className="flex h-full min-h-0 w-full items-center justify-center">
              <div
                className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#120b06]/92 md:max-h-[860px] md:max-w-5xl md:rounded-[28px] md:border md:border-[#ffe3b7]/28 md:shadow-[0_28px_90px_rgba(18,10,5,0.46),inset_0_1px_0_rgba(255,255,255,0.08)] md:ring-1 md:ring-white/10 lg:rounded-[34px]"
                onClick={(event) => event.stopPropagation()}
              >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#ffe3b7]/12 bg-[#fff8ed]/6 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 text-white sm:px-5 md:pt-3">
                  <span className="rounded-full bg-black/24 px-3 py-1 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {lightboxIndex + 1} / {images.length}
                  </span>
                  <button
                    type="button"
                    onClick={closeLightbox}
                    aria-label={t("close")}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff8ed]/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-colors hover:bg-[#fff8ed]/20"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Main image — fills remaining space between header and thumbnails */}
                <div
                  className="relative min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,#3a2415_0%,#120b06_54%,#080503_100%)] p-3 sm:p-5"
                  onTouchStart={(e) => {
                    lightboxTouchX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    if (lightboxTouchX.current === null) return;
                    const dx = e.changedTouches[0].clientX - lightboxTouchX.current;
                    lightboxTouchX.current = null;
                    if (Math.abs(dx) < 40) return;
                    moveLightbox(dx < 0 ? 1 : -1);
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-black/20 ring-1 ring-[#ffe3b7]/12">
                    {images.map((url, index) => {
                      if (!renderedIndices.has(index)) return null;
                      const isActive = index === lightboxIndex;
                      return (
                        <Image
                          key={index}
                          src={url}
                          alt={`${cafeName} ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 960px"
                          className={`object-contain transition-opacity duration-200 ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
                          aria-hidden={!isActive}
                          priority={isActive && index === 0}
                          quality={90}
                        />
                      );
                    })}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveLightbox(-1)}
                        aria-label={t("previous")}
                        className="absolute top-1/2 left-5 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff8ed]/12 text-white backdrop-blur-sm transition-colors hover:bg-[#fff8ed]/22 md:inline-flex"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveLightbox(1)}
                        aria-label={t("next")}
                        className="absolute top-1/2 right-5 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff8ed]/12 text-white backdrop-blur-sm transition-colors hover:bg-[#fff8ed]/22 md:inline-flex"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip — always anchored to bottom */}
                {images.length > 1 && (
                  <div className="scrollbar-hide flex shrink-0 gap-2 overflow-x-auto border-t border-[#ffe3b7]/12 bg-[#fff8ed]/6 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
                    {images.map((url, index) => (
                      <button
                        key={`${url}-lightbox-${index}`}
                        type="button"
                        onClick={() => {
                          setActiveIndex(index);
                          setLightboxIndex(index);
                        }}
                        aria-label={t("goTo", { index: index + 1 })}
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all ${
                          index === lightboxIndex
                            ? "opacity-100 ring-2 ring-[var(--accent)]"
                            : "opacity-55 hover:opacity-85"
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`${cafeName} thumbnail ${index + 1}`}
                          fill
                          sizes="56px"
                          className="object-cover"
                          style={{ objectPosition: objectPosition(index) }}
                          quality={85}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

}
