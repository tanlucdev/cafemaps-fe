"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-full bg-[var(--background-secondary)]", className)} />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center",
        "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
        "bg-[var(--background-secondary)] hover:bg-[var(--accent-light)]",
        "transition-all duration-200",
        className
      )}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
