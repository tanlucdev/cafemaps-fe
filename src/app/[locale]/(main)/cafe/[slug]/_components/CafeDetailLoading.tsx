import type { CSSProperties } from "react"

function SkeletonBlock({
  className,
  style,
}: {
  className: string
  style?: CSSProperties
}) {
  return (
    <div className={`animate-pulse ${className}`} style={style} />
  )
}

export default function CafeDetailLoading() {
  return (
    <article className="cafe-detail-page relative isolate overflow-hidden bg-[var(--background)] pt-16 !pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+1rem)] md:!pb-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,var(--background)_0%,#fff8ee_36%,var(--background-secondary)_100%)] dark:bg-[linear-gradient(180deg,var(--background)_0%,#251b13_42%,#1a1714_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.74%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.45%22/%3E%3C/svg%3E')] dark:mix-blend-screen" />

      <div className="mx-auto flex w-full max-w-2xl min-w-0 items-center justify-between px-4 pt-5 pb-3 sm:px-6 lg:max-w-[960px] lg:px-10">
        <SkeletonBlock className="h-9 w-24 rounded-full border border-[var(--border)] bg-white/62 shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[var(--card)]/72" />
        <SkeletonBlock className="h-9 w-24 rounded-full border border-[var(--border)] bg-white/62 shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[var(--card)]/72" />
      </div>

      <div className="mx-auto w-full max-w-2xl min-w-0 space-y-5 px-4 pb-4 sm:px-6 lg:max-w-[960px] lg:px-10">
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[24px] border border-[#ffe3b7]/38 bg-white/48 p-1.5 shadow-[0_22px_62px_rgba(44,26,14,0.10)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/48 dark:shadow-[0_22px_62px_rgba(0,0,0,0.28)]">
          <div className="aspect-4/5 w-full animate-pulse rounded-2xl bg-[linear-gradient(135deg,var(--background-secondary),#fff4df_48%,var(--accent-light))] md:aspect-auto md:h-[460px] lg:h-[520px] dark:bg-[linear-gradient(135deg,var(--card),#2b2118_48%,#3a2414)]" />
          <div className="mt-3 flex gap-2 overflow-hidden px-0.5 pb-1 md:hidden">
            {[60, 44, 60, 44].map((width, index) => (
              <SkeletonBlock
                key={`${width}-${index}`}
                className="h-11 shrink-0 rounded-xl bg-[var(--background-secondary)]"
                style={{ width }}
              />
            ))}
          </div>
        </div>

        <section className="mx-auto w-full max-w-[720px] min-w-0 space-y-5 rounded-[28px] border border-[#ffe3b7]/38 bg-[#fffaf2]/76 px-4 py-5 shadow-[0_18px_54px_rgba(44,26,14,0.08)] backdrop-blur-md sm:px-6 sm:py-6 dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/54 dark:shadow-[0_18px_54px_rgba(0,0,0,0.26)]">
          <div className="space-y-3">
            <SkeletonBlock className="h-9 w-3/4 max-w-[420px] rounded-full bg-[var(--background-secondary)] sm:h-11" />
            <SkeletonBlock className="h-5 w-44 rounded-full bg-[var(--background-secondary)]" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SkeletonBlock className="h-7 w-24 rounded-full bg-[#e6f6ef]/78 dark:bg-[#123028]/72" />
            <SkeletonBlock className="h-7 w-28 rounded-full bg-[var(--background-secondary)]" />
            <SkeletonBlock className="h-7 w-20 rounded-full bg-[var(--background-secondary)]" />
          </div>

          <div className="space-y-2.5">
            <SkeletonBlock className="h-5 w-full max-w-[560px] rounded-full bg-[var(--background-secondary)]" />
            <SkeletonBlock className="h-5 w-2/3 max-w-[380px] rounded-full bg-[var(--background-secondary)]" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:hidden">
            {[0, 1, 2, 3].map((item) => (
              <SkeletonBlock key={item} className="h-11 rounded-2xl bg-[var(--background-secondary)]" />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[88, 112, 76, 132, 96, 104].map((width) => (
              <SkeletonBlock
                key={width}
                className="h-8 rounded-full bg-[var(--background-secondary)]"
                style={{ width }}
              />
            ))}
          </div>

          <div className="h-px w-full bg-[var(--border)]/70" />

          <div className="space-y-2.5">
            <SkeletonBlock className="h-4 w-full rounded-lg bg-[var(--background-secondary)]" />
            <SkeletonBlock className="h-4 w-11/12 rounded-lg bg-[var(--background-secondary)]" />
            <SkeletonBlock className="h-4 w-4/5 rounded-lg bg-[var(--background-secondary)]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SkeletonBlock className="h-20 rounded-2xl bg-[var(--background-secondary)]" />
            <SkeletonBlock className="h-20 rounded-2xl bg-[var(--background-secondary)]" />
          </div>
        </section>
      </div>
    </article>
  )
}
