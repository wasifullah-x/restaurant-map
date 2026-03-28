function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-xl border border-[#d1ddd1] bg-white p-3 shadow-lg dark:border-app-border dark:bg-app-elevated">
      <div className="h-36 w-full animate-pulse rounded-lg bg-[#e0e9e0] dark:bg-gray-700" />
      <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-[#e0e9e0] dark:bg-gray-700" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-[#f0f4f0] dark:bg-gray-700" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-24 animate-pulse rounded-full bg-[#e0e9e0] dark:bg-gray-700" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-[#e0e9e0] dark:bg-gray-700" />
      </div>
    </article>
  )
}

export default SkeletonCard