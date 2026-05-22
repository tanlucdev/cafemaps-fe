export default function CafeDetailLoading() {
  return (
    <article className="pt-16 pb-24 lg:pb-8">
      <div className="max-w-2xl lg:max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4 flex items-center justify-between">
        <div className="h-6 w-24 rounded-lg bg-(--background-secondary) animate-pulse" />
        <div className="h-9 w-24 rounded-lg bg-(--background-secondary) animate-pulse" />
      </div>

      <div className="max-w-2xl lg:max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 pb-4 space-y-6">
        <div className="aspect-[4/5] md:aspect-auto md:h-[520px] rounded-2xl bg-(--background-secondary) animate-pulse" />

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="h-10 w-2/3 rounded-xl bg-(--background-secondary) animate-pulse" />
            <div className="h-12 w-12 rounded-full bg-(--background-secondary) animate-pulse" />
          </div>
          <div className="h-8 w-28 rounded-full bg-(--background-secondary) animate-pulse" />
          <div className="h-5 w-full rounded-lg bg-(--background-secondary) animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-full bg-(--background-secondary) animate-pulse" />
            <div className="h-8 w-24 rounded-full bg-(--background-secondary) animate-pulse" />
            <div className="h-8 w-28 rounded-full bg-(--background-secondary) animate-pulse" />
          </div>
          <div className="h-px bg-border" />
          <div className="space-y-2">
            <div className="h-6 w-28 rounded-lg bg-(--background-secondary) animate-pulse" />
            <div className="h-5 w-full rounded-lg bg-(--background-secondary) animate-pulse" />
            <div className="h-5 w-5/6 rounded-lg bg-(--background-secondary) animate-pulse" />
          </div>
        </div>
      </div>
    </article>
  )
}
