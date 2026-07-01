import { CafeCardSkeleton } from "@/components/ui/Skeleton"

export default function SavedLoading() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--background)] px-4 pb-[calc(var(--mobile-bottom-nav-height)+28px)] pt-[72px] text-[var(--foreground)] sm:px-6 sm:pt-[104px] lg:px-8 lg:pb-20 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-5 rounded-[28px] border border-[#ffe3b7]/60 bg-[#fffaf2]/72 p-4 shadow-[0_18px_58px_rgba(44,26,14,0.1)] backdrop-blur sm:p-6 lg:p-7">
          <div className="h-7 w-36 animate-pulse rounded-full bg-[var(--background-secondary)]" />
          <div className="mt-5 h-12 w-full max-w-md animate-pulse rounded-2xl bg-[var(--background-secondary)] sm:h-16" />
          <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-full bg-[var(--background-secondary)]" />
        </div>
        <div className="rounded-[28px] border border-[#ffe3b7]/60 bg-[#fffaf2]/64 p-3 shadow-[0_20px_70px_rgba(44,26,14,0.09)] backdrop-blur sm:p-5">
          <div className="mb-5 flex flex-wrap gap-2">
            {[88, 104, 120, 96].map((width) => (
              <div
                key={width}
                className="h-10 animate-pulse rounded-full bg-[var(--background-secondary)]"
                style={{ width }}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CafeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
