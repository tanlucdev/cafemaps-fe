"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";

interface ImageGalleryProps {
  images: string[];
  altPrefix?: string;
}

export default function ImageGallery({ images, altPrefix = "Ảnh quán" }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const openLightbox = useCallback(() => setLightbox(true), []);
  const closeLightbox = useCallback(() => setLightbox(false), []);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-3/2 items-center justify-center rounded-2xl bg-(--background-secondary) lg:aspect-video">
        <span className="text-sm text-(--foreground-muted)">Chưa có ảnh</span>
      </div>
    );
  }

  const THUMB_VISIBLE = 4;
  const extraCount = images.length - THUMB_VISIBLE;

  return (
    <>
      {/* Main image */}
      <div
        className="group relative aspect-3/2 cursor-zoom-in overflow-hidden rounded-2xl bg-(--background-secondary) lg:aspect-video"
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
              src={cloudinaryImageUrl(images[active], "gallery")}
              alt={`${altPrefix} ${active + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority={active === 0}
              quality={90}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 rounded-lg bg-black/30 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ZoomIn size={16} className="text-white" />
        </div>

        {/* Image count badge */}
        {images.length > 1 && (
          <span className="absolute right-3 bottom-3 rounded-lg bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnail strip — only if 2+ images */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.slice(0, THUMB_VISIBLE).map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                "relative aspect-square w-18 shrink-0 overflow-hidden rounded-xl transition-all duration-200 lg:aspect-[90/68] lg:w-[90px]",
                active === i ? "ring-accent ring-2 ring-offset-2" : "opacity-60 hover:opacity-90",
              ].join(" ")}
            >
              <Image
                src={cloudinaryImageUrl(src, "thumb")}
                alt={`${altPrefix} thumbnail ${i + 1}`}
                fill
                sizes="72px"
                className="object-cover"
                quality={85}
              />
            </button>
          ))}

          {/* "+N more" button */}
          {extraCount > 0 && (
            <button
              onClick={openLightbox}
              className="border-border relative flex aspect-square w-18 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-(--background-secondary) transition-colors hover:bg-(--accent-light) lg:aspect-[90/68] lg:w-[90px]"
            >
              <Image
                src={cloudinaryImageUrl(images[THUMB_VISIBLE], "thumb")}
                alt={`${altPrefix} thumbnail ${THUMB_VISIBLE + 1}`}
                fill
                sizes="72px"
                className="object-cover opacity-40"
                quality={85}
              />
              <span className="text-foreground relative z-10 text-xs font-semibold">
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
            className="fixed inset-0 z-50 flex flex-col bg-black/95"
            onClick={closeLightbox}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={closeLightbox}
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="relative mx-4 mb-4 flex-1" onClick={(e) => e.stopPropagation()}>
              <Image
                src={cloudinaryImageUrl(images[active], "lightbox")}
                alt={`${altPrefix} ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {images.length > 1 && (
              <div
                className="flex justify-center gap-2 overflow-x-auto px-4 pb-4"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={[
                      "relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg transition-all",
                      active === i ? "ring-2 ring-white" : "opacity-50 hover:opacity-80",
                    ].join(" ")}
                  >
                    <Image
                      src={cloudinaryImageUrl(src, "thumb")}
                      alt={`${altPrefix} thumbnail ${i + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
