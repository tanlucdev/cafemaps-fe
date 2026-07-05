"use client";

import {
  BookOpen,
  Camera,
  Coffee,
  Heart,
  LampDesk,
  Laptop,
  Leaf,
  MapPin,
  Palette,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ComponentType } from "react";
import type { QuizStickerId } from "@/types/quiz";
import { cn } from "@/lib/utils";

const STICKERS: Record<
  QuizStickerId,
  {
    Icon: ComponentType<{ className?: string }>;
    Accent: ComponentType<{ className?: string }>;
    className: string;
    ring: string;
    glow: string;
  }
> = {
  steam: {
    Icon: Coffee,
    Accent: BookOpen,
    className: "bg-[#fff3df] text-[#9b5c20]",
    ring: "shadow-[#d99543]/25",
    glow: "bg-[#f5b86d]",
  },
  sparkle: {
    Icon: Camera,
    Accent: Palette,
    className: "bg-[#fff4ca] text-[#a66d00]",
    ring: "shadow-[#e5b83f]/25",
    glow: "bg-[#f2c84e]",
  },
  leaf: {
    Icon: Leaf,
    Accent: Sparkles,
    className: "bg-[#e8f3df] text-[#4f7d46]",
    ring: "shadow-[#7a9e7e]/25",
    glow: "bg-[#94bd75]",
  },
  desk: {
    Icon: Laptop,
    Accent: Coffee,
    className: "bg-[#edf0ff] text-[#53618f]",
    ring: "shadow-[#7380c2]/25",
    glow: "bg-[#94a0dd]",
  },
  "date-light": {
    Icon: Heart,
    Accent: LampDesk,
    className: "bg-[#ffeaf0] text-[#b84f6e]",
    ring: "shadow-[#d66f8f]/25",
    glow: "bg-[#f19ab1]",
  },
  "city-walk": {
    Icon: MapPin,
    Accent: Coffee,
    className: "bg-[#eaf5f5] text-[#3f7775]",
    ring: "shadow-[#4f8f8a]/25",
    glow: "bg-[#84c6c2]",
  },
};

interface QuizStickerProps {
  id: QuizStickerId;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

export default function QuizSticker({
  id,
  size = "md",
  className,
  animated = true,
}: QuizStickerProps) {
  const reduceMotion = useReducedMotion();
  const sticker = STICKERS[id];
  const sizeClass = size === "lg" ? "size-28" : size === "sm" ? "size-14" : "size-20";

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "relative inline-grid place-items-center overflow-hidden rounded-[8px] border border-white/80 shadow-[0_12px_32px_rgba(93,57,20,0.12)]",
        sticker.className,
        sticker.ring,
        sizeClass,
        className,
      )}
      animate={reduceMotion || !animated ? undefined : { rotate: [0, -2, 2, 0], y: [0, -3, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <StickerScene Icon={sticker.Icon} Accent={sticker.Accent} glow={sticker.glow} />
      <span className="absolute -top-1 -right-1 z-20 size-3 rounded-full border border-white/80 bg-[#c8842a]" />
    </motion.div>
  );
}

function StickerScene({
  Icon,
  Accent,
  glow,
}: {
  Icon: ComponentType<{ className?: string }>;
  Accent: ComponentType<{ className?: string }>;
  glow: string;
}) {
  return (
    <span className="relative z-0 grid size-[82%] place-items-center">
      <span className={cn("absolute inset-0 rounded-full opacity-30 blur-sm", glow)} />
      <span className="absolute inset-[12%] rounded-full bg-white/60" />
      <span className="absolute bottom-[8%] -left-[2%] size-[34%] rounded-full bg-white/55" />
      <Accent className="absolute bottom-[13%] left-[10%] size-[26%] rotate-[-10deg] opacity-70" />
      <Sparkles className="absolute top-[7%] right-[9%] size-[26%] fill-current opacity-60" />
      <Icon className="relative size-[48%] stroke-[2.4]" />
    </span>
  );
}
