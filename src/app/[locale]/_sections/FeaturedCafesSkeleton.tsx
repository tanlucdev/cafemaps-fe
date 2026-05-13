export default function FeaturedCafesSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Section header */}
      <div className="flex items-end justify-between mb-6 sm:mb-7">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-(--background-secondary) animate-pulse" />
          <div className="h-7 w-56 rounded-lg bg-(--background-secondary) animate-pulse" />
        </div>
      </div>

      {/* Mobile skeleton: 3 horizontal cards */}
      <div className="sm:hidden -mx-4 px-4">
        <div className="flex gap-3 overflow-hidden pb-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-none w-[72vw] max-w-[280px] rounded-2xl overflow-hidden bg-(--background-secondary) animate-pulse"
              style={{ height: 256, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-full bg-(--background-secondary) animate-pulse ${i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop skeleton: 3-column podium */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4 lg:gap-5 sm:items-end">
        {/* Rank 2 */}
        <div
          className="rounded-2xl bg-(--background-secondary) animate-pulse"
          style={{ height: 320, animationDelay: "80ms" }}
        />
        {/* Rank 1 */}
        <div
          className="rounded-2xl bg-(--background-secondary) animate-pulse"
          style={{ height: 320 }}
        />
        {/* Rank 3 */}
        <div
          className="rounded-2xl bg-(--background-secondary) animate-pulse"
          style={{ height: 320, animationDelay: "160ms" }}
        />
      </div>
    </section>
  )
}
