import { CafeCardSkeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 pt-24 pb-16">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-xl bg-[var(--background-secondary)]" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CafeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
