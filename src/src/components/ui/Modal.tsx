"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "full"
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  full: "max-w-full mx-4",
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            className={cn(
              "relative z-10 w-full bg-[var(--card)] rounded-t-2xl sm:rounded-2xl",
              "border border-[var(--border)] shadow-2xl overflow-hidden",
              "max-h-[90vh] flex flex-col",
              sizeMap[size],
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
