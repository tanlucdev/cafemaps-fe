export default function SearchLoading() {
  return (
    <div className="pt-16">
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl bg-(--background-secondary)"
              style={{ height: 220, animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
