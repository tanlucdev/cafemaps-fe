"use client"

import { useState } from "react"
import { Navigation } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { getNearbyCafes } from "@/lib/api"
import type { Cafe } from "@/types/cafe"
import { useTranslations } from "next-intl"

interface NearbyButtonProps {
  onResults: (cafes: Cafe[]) => void
}

export default function NearbyButton({ onResults }: NearbyButtonProps) {
  const t = useTranslations("nearby")
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (!navigator.geolocation) {
      setError(t("noSupport"))
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const cafes = await getNearbyCafes(
            coords.latitude,
            coords.longitude,
            2
          )
          onResults(cafes)
        } catch {
          setError(t("loadError"))
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError(t("locationError"))
        setLoading(false)
      }
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
      >
        <Navigation size={14} />
        {t("button")}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
