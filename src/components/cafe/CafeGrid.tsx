import CafeCard from "./CafeCard"
import { CafeCardSkeleton } from "@/components/ui/Skeleton"
import type { Cafe } from "@/types/cafe"

interface CafeGridProps {
  cafes: Cafe[]
  locale: string
  loading?: boolean
  animationType?: "slide" | "fade"
}

export default function CafeGrid({
  cafes,
  locale,
  loading = false,
  animationType = "slide",
}: CafeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CafeCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (cafes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">☕</p>
        <p className="text-[var(--foreground-muted)] text-sm">
          Không tìm thấy quán nào phù hợp
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cafes.map((cafe, i) => (
        <CafeCard key={cafe.id} cafe={cafe} locale={locale} index={i} animationType={animationType} />
      ))}
    </div>
  )
}
