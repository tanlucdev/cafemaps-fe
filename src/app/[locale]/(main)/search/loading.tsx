import { Coffee, LoaderCircle } from "lucide-react";
import { CafeCardSkeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="pt-16">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative flex size-14 items-center justify-center">
          <LoaderCircle className="absolute size-14 animate-spin text-[var(--accent)]" aria-hidden="true" />
          <Coffee className="size-6 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-36 animate-pulse rounded-full bg-[var(--accent)]/50" />
          <div className="h-2 w-24 animate-pulse rounded-full bg-[#7a9e7e]/45" />
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="border-border border-b bg-(--background-secondary)">
        <div className="mx-auto max-w-7xl px-4 pt-2 pb-4 sm:px-6 lg:px-8">
          <div className="flex max-w-xl gap-2">
            <div className="h-10 flex-1 animate-pulse rounded-xl bg-(--background-secondary)" />
            <div className="h-10 w-20 animate-pulse rounded-xl bg-(--background-secondary)" />
          </div>
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="border-border bg-background border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-hidden">
            {[80, 96, 72, 88, 64, 80].map((w, i) => (
              <div
                key={i}
                className="h-8 shrink-0 animate-pulse rounded-full bg-(--background-secondary)"
                style={{ width: w, animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="h-4 w-20 animate-pulse rounded bg-(--background-secondary)" />
          <div className="h-8 w-32 animate-pulse rounded-lg bg-(--background-secondary)" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <CafeCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
