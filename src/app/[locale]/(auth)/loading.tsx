export default function AuthLoading() {
  return (
    <div className="space-y-3.5" aria-hidden="true">
      <div>
        <div className="mb-1.5 h-5 w-28 animate-pulse rounded-full bg-[#E0D3C0] dark:bg-[#4a4035]" />
        <div className="h-11 animate-pulse rounded-xl bg-[#FAF6F1] ring-1 ring-[#E0D3C0] dark:bg-[#302b25] dark:ring-[#4a4035]" />
      </div>
      <div>
        <div className="mb-1.5 h-5 w-24 animate-pulse rounded-full bg-[#E0D3C0] dark:bg-[#4a4035]" />
        <div className="h-11 animate-pulse rounded-xl bg-[#FAF6F1] ring-1 ring-[#E0D3C0] dark:bg-[#302b25] dark:ring-[#4a4035]" />
      </div>
      <div className="h-12 animate-pulse rounded-xl bg-[#D9A341] dark:bg-[#8E6115]" />
    </div>
  )
}
