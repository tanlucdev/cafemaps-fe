"use client"

import { useState } from "react"
import { Navigation } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { getNearbyCafes } from "@/lib/api"
import type { Cafe } from "@/types/cafe"

interface NearbyButtonProps {
  onResults: (cafes: Cafe[]) => void
}

export default function NearbyButton({ onResults }: NearbyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị")
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
          setError("Không thể tải quán gần đây")
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError("Không thể lấy vị trí của bạn")
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
      >
        <Navigation size={14} />
        Gần đây
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
