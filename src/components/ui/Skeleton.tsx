import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--background-secondary)]",
        className
      )}
    />
  )
}

export function CafeCardSkeleton({ mobileCompact = false }: { mobileCompact?: boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)]">
      <Skeleton
        className={cn(
          "w-full rounded-none",
          mobileCompact ? "aspect-[4/3] sm:aspect-[8/5] md:aspect-cafe" : "aspect-cafe",
        )}
      />
      <div className={cn("space-y-3", mobileCompact ? "p-2.5 sm:p-3 md:p-4" : "p-4")}>
        <Skeleton className={cn(mobileCompact ? "h-10 w-3/4 md:h-5" : "h-5 w-3/4")} />
        <Skeleton className={cn(mobileCompact ? "h-5 w-2/3 md:h-4 md:w-1/2" : "h-4 w-1/2")} />
        <div className={cn("flex gap-2", mobileCompact && "hidden md:flex")}>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}
