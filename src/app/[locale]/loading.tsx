import { CafeCardSkeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="h-8 w-48 rounded-xl bg-[var(--background-secondary)] animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CafeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
