"use client"

import dynamic from "next/dynamic"
import { Camera, Coffee, Heart, Laptop, Leaf, MapPin, Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import type { ComponentType } from "react"
import type { QuizStickerId } from "@/types/quiz"
import { cn } from "@/lib/utils"

const QuizLottie = dynamic(() => import("./QuizLottie"), { ssr: false })

const STICKERS: Record<QuizStickerId, {
  src: string
  icon: ComponentType<{ className?: string }>
  className: string
  ring: string
}> = {
  steam: { src: "/quiz/steam.lottie", icon: Coffee, className: "bg-[#fff3df] text-[#9b5c20]", ring: "shadow-[#d99543]/25" },
  sparkle: { src: "/quiz/sparkle.lottie", icon: Sparkles, className: "bg-[#fff4ca] text-[#a66d00]", ring: "shadow-[#e5b83f]/25" },
  leaf: { src: "/quiz/leaf.lottie", icon: Leaf, className: "bg-[#e8f3df] text-[#4f7d46]", ring: "shadow-[#7a9e7e]/25" },
  desk: { src: "/quiz/desk.lottie", icon: Laptop, className: "bg-[#edf0ff] text-[#53618f]", ring: "shadow-[#7380c2]/25" },
  "date-light": { src: "/quiz/date-light.lottie", icon: Heart, className: "bg-[#ffeaf0] text-[#b84f6e]", ring: "shadow-[#d66f8f]/25" },
  "city-walk": { src: "/quiz/city-walk.lottie", icon: MapPin, className: "bg-[#eaf5f5] text-[#3f7775]", ring: "shadow-[#4f8f8a]/25" },
}

interface QuizStickerProps {
  id: QuizStickerId
  size?: "sm" | "md" | "lg"
  className?: string
  animated?: boolean
}

export default function QuizSticker({ id, size = "md", className, animated = true }: QuizStickerProps) {
  const reduceMotion = useReducedMotion()
  const sticker = STICKERS[id]
  const Icon = sticker.icon
  const sizeClass = size === "lg" ? "size-28" : size === "sm" ? "size-14" : "size-20"
  const useLottie = animated && process.env.NODE_ENV !== "development"

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "relative inline-grid place-items-center rounded-[8px] border border-white/80 shadow-[0_12px_32px_rgba(93,57,20,0.12)]",
        sticker.className,
        sticker.ring,
        sizeClass,
        className
      )}
      animate={reduceMotion ? undefined : { rotate: [0, -2, 2, 0], y: [0, -3, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {useLottie ? (
        <QuizLottie
          src={sticker.src}
          active={!reduceMotion}
          className="absolute inset-0 z-10 h-full w-full"
        />
      ) : null}
      <span className="absolute inset-2 rounded-[8px] bg-white/50" />
      <StickerScene id={id} Icon={Icon} />
      <span className="absolute -right-1 -top-1 z-20 size-3 rounded-full border border-white/80 bg-[#c8842a]" />
    </motion.div>
  )
}

function StickerScene({ id, Icon }: { id: QuizStickerId; Icon: ComponentType<{ className?: string }> }) {
  if (id === "steam") {
    return (
      <span className="relative z-0 grid h-16 w-16 place-items-center">
        <span className="absolute top-1 left-5 h-8 w-1.5 animate-[quiz-steam_2.4s_ease-in-out_infinite] rounded-full bg-[#c8842a]/35" />
        <span className="absolute top-0 right-5 h-9 w-1.5 animate-[quiz-steam_2.8s_ease-in-out_infinite] rounded-full bg-[#c8842a]/25" />
        <span className="absolute bottom-4 h-8 w-11 rounded-b-2xl rounded-t-lg border-2 border-[#9b5c20] bg-white/70" />
        <span className="absolute right-1 bottom-6 h-5 w-4 rounded-full border-2 border-[#9b5c20]" />
        <span className="absolute bottom-2 h-2 w-14 rounded-full bg-[#9b5c20]/25" />
      </span>
    )
  }

  if (id === "leaf") {
    return (
      <span className="relative z-0 grid h-16 w-16 place-items-center">
        <Leaf className="absolute left-3 top-2 size-9 -rotate-[35deg] fill-[#a9c98f]/45 text-[#4f7d46]" />
        <Leaf className="absolute right-2 top-4 size-8 rotate-[35deg] fill-[#c9dfae]/55 text-[#5b8a50]" />
        <span className="absolute bottom-3 h-8 w-10 rounded-b-xl rounded-t-sm bg-[#d69b65]" />
        <span className="absolute bottom-9 h-2 w-12 rounded-full bg-[#b87442]" />
        <span className="absolute bottom-11 h-8 w-1 rounded-full bg-[#5f8d52]" />
      </span>
    )
  }

  if (id === "desk") {
    return (
      <span className="relative z-0 grid h-16 w-16 place-items-center">
        <Laptop className="absolute top-5 left-4 size-9 text-[#53618f]" />
        <span className="absolute right-2 bottom-4 h-6 w-4 rounded-b-lg rounded-t-sm border border-[#c8842a] bg-[#fff3df]" />
        <span className="absolute left-2 bottom-3 h-3 w-10 -rotate-6 rounded-sm bg-[#f5b7a5]" />
        <span className="absolute bottom-2 h-1.5 w-14 rounded-full bg-[#53618f]/20" />
      </span>
    )
  }

  if (id === "date-light") {
    return (
      <span className="relative z-0 grid h-16 w-16 place-items-center">
        <span className="absolute top-2 h-8 w-10 rounded-t-full bg-[#ffd08a]" />
        <span className="absolute top-9 h-7 w-1.5 rounded-full bg-[#a56a3a]" />
        <span className="absolute bottom-3 h-2 w-10 rounded-full bg-[#a56a3a]/25" />
        <Heart className="absolute bottom-5 right-2 size-6 fill-[#d66f8f]/35 text-[#b84f6e]" />
      </span>
    )
  }

  if (id === "city-walk") {
    return (
      <span className="relative z-0 grid h-16 w-16 place-items-center">
        <span className="absolute bottom-2 left-2 h-11 w-4 rounded-t-sm bg-[#90c6c3]" />
        <span className="absolute bottom-2 left-8 h-14 w-5 rounded-t-sm bg-[#f0c987]" />
        <span className="absolute bottom-2 right-2 h-9 w-4 rounded-t-sm bg-[#86a9cf]" />
        <MapPin className="absolute top-3 right-5 size-6 fill-white/45 text-[#3f7775]" />
        <span className="absolute bottom-1 h-1.5 w-14 rounded-full bg-[#3f7775]/25" />
      </span>
    )
  }

  return (
    <span className="relative z-0 grid h-16 w-16 place-items-center">
      <Camera className="absolute bottom-4 left-3 size-9 text-[#8b5f21]" />
      <Sparkles className="absolute right-2 top-2 size-7 fill-[#e7b86d]/35 text-[#a66d00]" />
      <Icon className="absolute bottom-2 right-3 size-5 text-[#d66f8f]" />
    </span>
  )
}
