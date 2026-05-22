"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("common")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[100svh] items-center justify-center px-4 text-center">
      <div>
        <p className="text-5xl mb-4">☕</p>
        <h1 className="font-display text-2xl font-bold text-[var(--foreground)] mb-2">
          {t("error")}
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mb-6">
          {t("errorDescription")}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t("retry")}
        </button>
      </div>
    </div>
  )
}
