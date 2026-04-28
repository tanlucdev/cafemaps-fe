"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { toggleSaveCafe } from "@/lib/api"

interface SaveButtonProps {
  cafeId: string
  initialSaved?: boolean
  token?: string
  className?: string
}

export default function SaveButton({
  cafeId,
  initialSaved = false,
  token,
  className,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (!token) {
      // TODO: open auth modal
      return
    }
    setLoading(true)
    const prev = saved
    setSaved((s) => !s) // optimistic
    try {
      const result = await toggleSaveCafe(cafeId, token)
      setSaved(result.saved)
    } catch {
      setSaved(prev) // rollback
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? "Bỏ lưu" : "Lưu quán"}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
        saved
          ? "bg-[var(--accent)] text-white"
          : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]",
        className
      )}
    >
      <Bookmark size={16} className={saved ? "fill-white" : ""} />
    </motion.button>
  )
}
