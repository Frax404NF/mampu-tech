export function UserDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading user profile"
      className="space-y-5 animate-pulse"
    >
      {/* Back link shimmer */}
      <div className="h-4 w-32 bg-gray-200 rounded-full" />

      {/* Avatar + name card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="space-y-2 flex-1 pt-1">
            <div className="h-5 w-48 bg-gray-200 rounded-full" />
            <div className="h-3.5 w-28 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
      
      <SkeletonSection variant="contact" rows={3} />
      <SkeletonSection variant="company" rows={2} />
      <SkeletonSection variant="address" rows={2} />
      <SkeletonSection variant="todos" rows={5} />
      <SkeletonSection variant="posts" rows={4} />
    </div>
  );
}

interface SkeletonSectionProps {
  rows: number;
  variant?: "contact" | "company" | "address" | "todos" | "posts";
}

function SkeletonSection({ rows, variant = "contact" }: SkeletonSectionProps) {
  const isDetailRow = variant === "contact" || variant === "company" || variant === "address";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-3 w-20 bg-gray-200 rounded-full" />
        {(variant === "todos" || variant === "posts") && (
          <div className="h-3 w-12 bg-gray-100 rounded-full" />
        )}
      </div>

      {isDetailRow && (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-baseline gap-4">
              <div className="w-16 h-3 bg-gray-100 rounded-full flex-shrink-0" />
              <div
                className="h-3 bg-gray-200 rounded-full"
                style={{ width: `${55 + (i % 3) * 15}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {variant === "todos" && (
        <>
          {/* Progress summary shimmer */}
          <div className="h-3 w-48 bg-gray-100 rounded-full mb-4" />
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 py-1">
                <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0 mt-0.5" />
                <div
                  className="h-3 bg-gray-200 rounded-full"
                  style={{ width: `${60 + (i % 3) * 12}%` }}
                />
              </div>
            ))}
          </div>
          <div className="h-3 w-24 bg-gray-100 rounded-full mt-4" />
        </>
      )}

      {variant === "posts" && (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-3">
              <div
                className="h-3 bg-gray-200 rounded-full"
                style={{ width: `${55 + (i % 3) * 12}%` }}
              />
              <div className="w-3 h-3 bg-gray-100 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
