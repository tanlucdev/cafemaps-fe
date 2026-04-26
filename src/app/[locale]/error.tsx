"use client"

import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <p className="text-5xl mb-4">☕</p>
        <h1 className="font-display text-2xl font-bold text-[var(--foreground)] mb-2">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mb-6">
          Xin lỗi, có điều gì đó không ổn. Hãy thử lại.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Thử lại
        </button>
      </div>
    </div>
  )
}
