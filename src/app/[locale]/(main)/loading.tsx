export default function MainLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 pt-24 pb-10 sm:px-6 lg:px-8">
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
