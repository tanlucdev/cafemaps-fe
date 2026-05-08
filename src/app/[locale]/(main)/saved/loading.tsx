export default function SavedLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[320px] animate-pulse rounded-[32px] border border-[#e6dacd] bg-[#fff2e8]" />
        <div className="grid gap-4">
          <div className="h-[160px] animate-pulse rounded-[28px] border border-[#e6dacd] bg-[#fff8f2]" />
          <div className="h-[140px] animate-pulse rounded-[28px] border border-[#e6dacd] bg-[#fff8f2]" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[320px] animate-pulse rounded-[28px] border border-[#e6dacd] bg-[#fff8f2]"
          />
        ))}
      </div>
    </div>
  )
}
