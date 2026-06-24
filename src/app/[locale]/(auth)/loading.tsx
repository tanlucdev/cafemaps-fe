export default function AuthLoading() {
  return (
    <div className="space-y-3.5" aria-hidden="true">
      <div>
        <div className="mb-1.5 h-4 w-28 animate-pulse rounded-full bg-[#e0d0b3] dark:bg-white/14" />
        <div className="h-12 animate-pulse rounded-2xl bg-[#fffaf2]/82 ring-1 ring-[#e2cda8] dark:bg-white/7 dark:ring-[#ffe3b7]/14" />
      </div>
      <div>
        <div className="mb-1.5 h-4 w-24 animate-pulse rounded-full bg-[#e0d0b3] dark:bg-white/14" />
        <div className="h-12 animate-pulse rounded-2xl bg-[#fffaf2]/82 ring-1 ring-[#e2cda8] dark:bg-white/7 dark:ring-[#ffe3b7]/14" />
      </div>
      <div className="h-12 animate-pulse rounded-full bg-[var(--accent)]" />
    </div>
  )
}
