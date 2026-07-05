"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface QuizLottieProps {
  src: string
  active: boolean
  className?: string
}

export default function QuizLottie({ src, active, className }: QuizLottieProps) {
  return (
    <DotLottieReact
      src={src}
      loop={active}
      autoplay={active}
      className={className}
      renderConfig={{ autoResize: true }}
    />
  )
}
