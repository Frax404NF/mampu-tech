/**
 * Skeleton loader for the user detail page.
 * Structure mirrors UserDetailPage exactly to prevent layout shift on load.
 */
export function UserDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading user profile"
      className="animate-pulse"
    >
      {/* Back button shimmer */}
      <div className="h-4 w-28 bg-slate-200 rounded mb-6" />

      {/* ── Hero card ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-6 mb-4">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0" />
          <div className="space-y-2 pt-1 min-w-0 flex-1">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-3.5 w-36 bg-slate-100 rounded" />
          </div>
        </div>

        {/* 3-col meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Contact */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="h-2.5 w-14 bg-slate-200 rounded" />
            <div className="h-3 w-40 bg-slate-100 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
          {/* Company */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="h-2.5 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-36 bg-slate-100 rounded" />
            <div className="h-3 w-44 bg-slate-100 rounded" />
          </div>
          {/* Address */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="h-2.5 w-14 bg-slate-200 rounded" />
            <div className="h-3 w-40 bg-slate-100 rounded" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      {/* ── Posts + Todos — 2-col grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Posts skeleton */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-10 bg-slate-200 rounded" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>
            <div className="h-3 w-12 bg-slate-100 rounded" />
          </div>
          {/* Post rows */}
          <div className="divide-y divide-slate-100">
            {[70, 55, 80].map((w, i) => (
              <div key={i} className="py-3 first:pt-0 space-y-1.5">
                <div
                  className={`h-3.5 bg-slate-200 rounded`}
                  style={{ width: `${w}%` }}
                />
                <div className="h-2.5 w-full bg-slate-100 rounded" />
                <div className="h-2.5 w-4/5 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="h-6 w-full bg-slate-100 rounded-lg" />
          </div>
        </div>

        {/* Todos skeleton */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-10 bg-slate-200 rounded" />
              <div className="h-5 w-14 bg-slate-100 rounded-full" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>
            <div className="h-3 w-12 bg-slate-100 rounded" />
          </div>
          {/* Tab bar */}
          <div className="flex gap-4 border-b border-slate-100 mb-4 pb-2">
            <div className="h-3 w-14 bg-slate-200 rounded" />
            <div className="h-3 w-18 bg-slate-100 rounded" />
          </div>
          {/* Todo rows */}
          <div className="space-y-3">
            {[65, 80, 55].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded bg-slate-200 flex-shrink-0" />
                <div
                  className="h-3 bg-slate-200 rounded"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="h-6 w-full bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
