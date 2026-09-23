"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Cafe } from "@/types/cafe";
import { coverObjectPosition } from "@/lib/cover-image";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";

const POPUP_WIDTH = 320;
const IMG_H = 220;
const POPUP_GAP = 12;

interface CafePreviewPopupProps {
  cafe: Cafe;
  anchorRect: DOMRect;
  locale: string;
  visible: boolean;
}

function computePosition(rect: DOMRect): { left: number; top: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const totalH = IMG_H + 88;

  // prefer right, fall back left
  let left = rect.right + POPUP_GAP;
  if (left + POPUP_WIDTH > vw - POPUP_GAP) {
    left = rect.left - POPUP_WIDTH - POPUP_GAP;
  }
  left = Math.max(POPUP_GAP, Math.min(left, vw - POPUP_WIDTH - POPUP_GAP));

  // align top of card, clamp vertically
  const top = Math.max(POPUP_GAP, Math.min(rect.top, vh - totalH - POPUP_GAP));

  return { left, top };
}

function PopupContent({ cafe, anchorRect }: Omit<CafePreviewPopupProps, "visible">) {
  const pos = computePosition(anchorRect);

  return (
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, scale: 0.93, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: 8 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: POPUP_WIDTH,
        zIndex: 300,
        pointerEvents: "none",
      }}
      className="overflow-hidden rounded-[22px] border border-[#ECE4D6] bg-white shadow-[0_16px_48px_rgba(40,22,4,0.16)]"
    >
      {/* Cover image */}
      <div className="relative w-full overflow-hidden" style={{ height: IMG_H }}>
        {cafe.coverImage ? (
          <Image
            src={cloudinaryImageUrl(cafe.coverImage, "card")}
            alt={cafe.name}
            fill
            sizes="320px"
            className="object-cover"
            style={{ objectPosition: coverObjectPosition(cafe) }}
            priority={false}
            quality={90}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFEADF] via-[#F7DFC6] to-[#DDE9D8]" />
        )}

        {/* Bottom gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,5,1,0.55) 0%, transparent 55%)" }}
        />
      </div>

      {/* Info */}
      <div className="px-4 py-3.5">
        <p className="mb-1.5 line-clamp-1 text-[13.5px] leading-snug font-bold text-[#1C1209]">
          {cafe.name}
        </p>
        {cafe.oneLiner && (
          <p className="line-clamp-2 text-[12px] leading-[1.65] text-[#5C4A2F] italic">
            &ldquo;{cafe.oneLiner}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function CafePreviewPopup(props: CafePreviewPopupProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {props.visible && (
        <PopupContent cafe={props.cafe} anchorRect={props.anchorRect} locale={props.locale} />
      )}
    </AnimatePresence>,
    document.body,
  );
}
