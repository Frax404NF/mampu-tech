export default function UserTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-10 w-full sm:w-64 bg-gray-200 rounded-md" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header row skeleton */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-5 sm:col-span-4 h-4 bg-gray-300 rounded" />
          <div className="hidden sm:block sm:col-span-5 h-4 bg-gray-300 rounded" />
          <div className="col-span-7 sm:col-span-3 h-4 bg-gray-300 rounded" />
        </div>
        {/* Issue row skeletons */}
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center"
            >
              <div className="col-span-5 sm:col-span-4 h-4 bg-gray-200 rounded w-3/4" />
              <div className="hidden sm:block sm:col-span-5 h-4 bg-gray-200 rounded w-2/3" />
              <div className="col-span-7 sm:col-span-3 h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
