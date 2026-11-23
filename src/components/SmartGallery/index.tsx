"use client";

import GalleryImage from "./GalleryImage";
import { CafeChristmasGarland } from "@/components/seasonal/CafeChristmasDecorations";
import { MobileMainImage, GalleryLightbox } from "./parts";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Images, ZoomIn } from "lucide-react";

interface SmartGalleryProps {
  images: string[];
  orientations?: string[];
  coverImageCrop?: { x: number; y: number } | null;
  cafeName: string;
  footer?: ReactNode;
}

export default function SmartGallery({ images, orientations = [], coverImageCrop, cafeName, footer }: SmartGalleryProps) {
  const t = useTranslations("gallery");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Track which indices have been rendered so preloaded images stay mounted
  const [renderedIndices, setRenderedIndices] = useState<Set<number>>(new Set([0]));

  const getO = useCallback((i: number) => orientations[i] || "landscape", [orientations]);

  const isPortrait = useCallback((i: number) => getO(i) === "portrait", [getO]);
  const objectPosition = useCallback(
    (i: number) => (i === 0 ? `${coverImageCrop?.x ?? 50}% ${coverImageCrop?.y ?? 50}%` : isPortrait(i) ? "center 42%" : "center"),
    [coverImageCrop, isPortrait],
  );

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const moveLightbox = useCallback(
    (direction: -1 | 1) => {
      if (lightboxIndex === null) return;
      const next = (lightboxIndex + direction + images.length) % images.length;
      setLightboxIndex(next);
      setActiveIndex(next);
    },
    [images.length, lightboxIndex],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxIndex, moveLightbox]);

  // Preload current ± 1 images so navigation is instant
  useEffect(() => {
    if (lightboxIndex === null) return;
    setRenderedIndices((prev) => {
      const next = new Set(prev);
      next.add(lightboxIndex);
      next.add((lightboxIndex - 1 + images.length) % images.length);
      next.add((lightboxIndex + 1) % images.length);
      return next;
    });
  }, [lightboxIndex, images.length]);

  if (!images || images.length === 0) return null;

  const visibleImages = images.slice(0, 5);
  const overflowCount = images.length - visibleImages.length;

  function imageButton(
    url: string,
    index: number,
    className: string,
    sizes: string,
    priority = false,
    showOverflow = false,
  ) {
    return (
      <button
        key={`${url}-${index}`}
        type="button"
        onClick={() => openLightbox(index)}
        aria-label={t("viewImageOf", { index: index + 1, cafeName })}
        className={`group relative overflow-hidden bg-(--background-secondary) ${className}`}
      >
        <GalleryImage
          src={url}
          alt={`${cafeName} ${index + 1}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: objectPosition(index) }}
          priority={priority}
          quality={90}
          cloudinaryPreset="gallery"
        />
        <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/12" />
        <span className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ZoomIn size={16} />
        </span>
        {showOverflow && overflowCount > 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/48 text-sm font-semibold text-white backdrop-blur-[1px]">
            {t("morePhotos", { count: overflowCount })}
          </span>
        )}
      </button>
    );
  }

  const mobileGallery = (
    <div className="md:hidden">
      <MobileMainImage
        images={images}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        objectPosition={objectPosition}
        cafeName={cafeName}
        onTap={() => openLightbox(activeIndex)}
      />

      {images.length > 1 && (
        <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto px-0.5 pb-1">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={t("viewImage", { index: i + 1 })}
              className={`shrink-0 rounded-xl transition-all ${
                i === activeIndex ? "opacity-100" : "opacity-50 hover:opacity-75"
              }`}
              style={{
                width: isPortrait(i) ? "44px" : "60px",
                height: "44px",
                padding: i === activeIndex ? "2px" : "0",
                border: i === activeIndex ? "2px solid var(--accent)" : "2px solid transparent",
                borderRadius: "10px",
                boxSizing: "border-box",
              }}
            >
              <span className="block h-full w-full overflow-hidden" style={{ borderRadius: "8px" }}>
                <GalleryImage
                  src={url}
                  alt={`${cafeName} thumbnail ${i + 1}`}
                  width={60}
                  height={44}
                  sizes="60px"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: objectPosition(i) }}
                  quality={85}
                  cloudinaryPreset="thumb"
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const desktopShellClass = "hidden md:grid h-[460px] lg:h-[520px] overflow-hidden rounded-2xl";
  let desktopGallery;

  if (images.length === 1) {
    desktopGallery = (
      <div className={desktopShellClass}>
        {imageButton(images[0], 0, "h-full w-full", "900px", true)}
      </div>
    );
  } else if (images.length === 2) {
    desktopGallery = (
      <div className={`${desktopShellClass} grid-cols-2 gap-2`}>
        {images.map((url, i) =>
          imageButton(url, i, "h-full w-full", "(max-width: 1024px) 50vw, 450px", i === 0),
        )}
      </div>
    );
  } else {
    const useCompactTiles = images.length >= 5;
    const sideGridClass = useCompactTiles
      ? "grid grid-cols-2 grid-rows-2 gap-2"
      : images.length === 4
        ? "grid grid-rows-3 gap-2"
        : "grid grid-rows-2 gap-2";

    desktopGallery = (
      <div className={`${desktopShellClass} grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-2`}>
        {imageButton(images[0], 0, "h-full w-full", "(max-width: 1024px) 56vw, 540px", true)}
        <div className={sideGridClass}>
          {visibleImages.slice(1).map((url, idx) => {
            const imageIndex = idx + 1;
            return imageButton(
              url,
              imageIndex,
              "h-full w-full",
              useCompactTiles
                ? "(max-width: 1024px) 22vw, 220px"
                : "(max-width: 1024px) 44vw, 360px",
              false,
              imageIndex === visibleImages.length - 1,
            );
          })}
        </div>
      </div>
    );
  }


  return (
    <>
      <CafeChristmasGarland />
      {mobileGallery}
      {desktopGallery}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 px-2">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="hover:text-accent min-h-11 hidden items-center gap-2 text-xs font-medium text-(--foreground-muted) transition-colors md:inline-flex"
        >
          <Images size={16} />
          {t("viewAll", { count: images.length })}
        </button>
        {footer}
      </div>

      {lightboxIndex !== null && <GalleryLightbox images={images} lightboxIndex={lightboxIndex} cafeName={cafeName} closeLightbox={closeLightbox} moveLightbox={moveLightbox} renderedIndices={renderedIndices} setActiveIndex={setActiveIndex} setLightboxIndex={setLightboxIndex} objectPosition={objectPosition} />}
    </>
  );
}
