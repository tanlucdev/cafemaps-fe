export default function CafeDetailLoading() {
  return (
    <article className="cafe-detail-page relative isolate overflow-hidden bg-[var(--background)] pt-16 lg:pb-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,var(--background)_0%,#fff8ee_36%,var(--background-secondary)_100%)] dark:bg-[linear-gradient(180deg,var(--background)_0%,#251b13_42%,#1a1714_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.74%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.45%22/%3E%3C/svg%3E')] dark:mix-blend-screen" />

      <div className="mx-auto flex w-full max-w-2xl min-w-0 items-center justify-between px-4 pt-5 pb-3 sm:px-6 lg:max-w-[960px] lg:px-10">
        <div className="h-9 w-24 animate-pulse rounded-full border border-[var(--border)] bg-white/62 shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[var(--card)]/72" />
        <div className="h-9 w-24 animate-pulse rounded-full border border-[var(--border)] bg-white/62 shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[var(--card)]/72" />
      </div>

      <div className="mx-auto w-full max-w-2xl min-w-0 space-y-5 px-4 pb-4 sm:px-6 lg:max-w-[960px] lg:px-10">
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[24px] border border-[#ffe3b7]/38 bg-white/48 p-1.5 shadow-[0_22px_62px_rgba(44,26,14,0.10)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/48">
          <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-[var(--background-secondary)] md:aspect-auto md:h-[520px]" />
        </div>

        <div className="mx-auto w-full max-w-[720px] min-w-0 space-y-4 rounded-[28px] border border-[#ffe3b7]/38 bg-[#fffaf2]/76 px-4 py-5 shadow-[0_18px_54px_rgba(44,26,14,0.08)] backdrop-blur-md sm:px-6 sm:py-6 dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/54">
          <div className="flex items-start justify-between gap-3">
            <div className="h-10 w-2/3 animate-pulse rounded-xl bg-[var(--background-secondary)]" />
            <div className="h-11 w-28 animate-pulse rounded-full bg-[#fff0dc] dark:bg-[#33270A]" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-full bg-[#fff0dc] dark:bg-[#33270A]" />
          <div className="h-5 w-full animate-pulse rounded-lg bg-[var(--background-secondary)]" />
          <div className="flex gap-2">
            <div className="h-8 w-24 animate-pulse rounded-full bg-white/58 dark:bg-[#fff1d6]/8" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-white/58 dark:bg-[#fff1d6]/8" />
            <div className="h-8 w-28 animate-pulse rounded-full bg-white/58 dark:bg-[#fff1d6]/8" />
          </div>
          <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(200,132,42,0.22),transparent)]" />
          <div className="space-y-2">
            <div className="h-6 w-28 animate-pulse rounded-lg bg-[var(--background-secondary)]" />
            <div className="h-5 w-full animate-pulse rounded-lg bg-[var(--background-secondary)]" />
            <div className="h-5 w-5/6 animate-pulse rounded-lg bg-[var(--background-secondary)]" />
          </div>
        </div>
      </div>
    </article>
  )
}
