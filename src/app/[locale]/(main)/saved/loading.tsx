export default function SavedLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
      {/* Header skeleton */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-64 animate-pulse rounded-xl bg-[#f0e8df] sm:w-80" />
          <div className="h-4 w-48 animate-pulse rounded-lg bg-[#f5ede7]" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded-lg bg-[#f5ede7]" />
      </div>

      {/* Collections row skeleton */}
      <div className="mb-10">
        <div className="mb-4 h-5 w-20 animate-pulse rounded-lg bg-[#f0e8df]" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-40 shrink-0">
              <div className="mb-3 aspect-4/3 animate-pulse rounded-2xl bg-[#f0e8df]" />
              <div className="mb-1 h-3.5 w-24 animate-pulse rounded bg-[#f5ede7]" />
              <div className="h-3 w-14 animate-pulse rounded bg-[#f5ede7]" />
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-[#f0e8df]" />
          ))}
        </div>
        <div className="h-8 w-44 animate-pulse rounded-full bg-[#f0e8df]" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-[#e6dacd] bg-white shadow-sm">
            <div className="h-52 animate-pulse bg-[#f0e8df] md:h-56" />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-36 animate-pulse rounded-lg bg-[#f0e8df]" />
                <div className="h-5 w-12 animate-pulse rounded-full bg-[#f5ede7]" />
              </div>
              <div className="h-3.5 w-28 animate-pulse rounded bg-[#f5ede7]" />
              <div className="flex gap-1.5">
                <div className="h-5 w-16 animate-pulse rounded-full bg-[#f0e8df]" />
                <div className="h-5 w-14 animate-pulse rounded-full bg-[#f0e8df]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
