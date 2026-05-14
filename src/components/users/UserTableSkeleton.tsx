const SKELETON_ROW_COUNT = 6

export function UserTableSkeleton() {
  return (
    <div role="status" aria-label="Loading users" className="animate-pulse">
      {/* Controls bar shimmer */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="h-10 w-full sm:w-80 bg-gray-200 rounded-lg" />
        <div className="h-10 w-full sm:w-44 bg-gray-200 rounded-lg" />
        <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Mobile card shimmer — visible below sm */}
      <div className="sm:hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <div key={index} className="px-4 py-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/5" />
            <div className="h-3 bg-gray-200 rounded w-3/5" />
            <div className="h-3 bg-gray-200 rounded w-2/5" />
            {/* Todos progress shimmer */}
            <div className="pt-1 space-y-1">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-1.5 bg-gray-200 rounded-full w-full" />
            </div>
            {/* Posts shimmer */}
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* Desktop table shimmer — visible at sm and above */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header row skeleton — 5 columns */}
        <div className="grid grid-cols-[repeat(5,1fr)] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded" />
        </div>
        {/* Row skeletons */}
        <div className="divide-y divide-gray-100">
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[repeat(5,1fr)] gap-4 px-6 py-4 items-center"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              {/* Todos progress shimmer */}
              <div className="space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-1.5 bg-gray-200 rounded-full w-full" />
              </div>
              {/* Posts shimmer */}
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
