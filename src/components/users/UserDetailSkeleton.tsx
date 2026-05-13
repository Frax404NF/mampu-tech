export function UserDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading user profile"
      className="space-y-5 animate-pulse"
    >
      {/* Back link placeholder */}
      <div className="h-4 w-32 bg-gray-200 rounded-full" />

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="space-y-2 flex-1 pt-1">
            <div className="h-5 w-48 bg-gray-200 rounded-full" />
            <div className="h-3.5 w-28 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>

      {/* Contact section */}
      <SkeletonSection rows={3} />

      {/* Company section */}
      <SkeletonSection rows={2} />

      {/* Address section */}
      <SkeletonSection rows={2} />
    </div>
  );
}

function SkeletonSection({ rows }: { rows: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Section title */}
      <div className="h-3 w-20 bg-gray-200 rounded-full mb-5" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-baseline gap-4 text-sm">
            <div className="w-16 h-3 bg-gray-100 rounded-full flex-shrink-0" />
            <div
              className="h-3 bg-gray-200 rounded-full"
              style={{ width: `${55 + (i % 3) * 15}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}