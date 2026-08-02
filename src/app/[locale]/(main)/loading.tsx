import { Coffee, LoaderCircle } from "lucide-react"

export default function MainLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 pt-24 pb-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="relative flex size-14 items-center justify-center">
          <LoaderCircle className="absolute size-14 animate-spin text-[var(--accent)]" aria-hidden="true" />
          <Coffee className="size-6 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-36 animate-pulse rounded-full bg-[var(--accent)]/50" />
          <div className="h-2 w-24 animate-pulse rounded-full bg-[#7a9e7e]/45" />
        </div>
      </div>
      <div className="h-8 w-40 animate-pulse rounded-full bg-(--background-secondary)" />
      <div className="h-44 animate-pulse rounded-2xl bg-(--background-secondary)" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-(--background-secondary)"
          />
        ))}
      </div>
    </div>
  )
}
