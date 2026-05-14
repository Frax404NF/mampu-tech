// Matches the exact layout of UsersTable — 5 rows, PAGE_SIZE = 5
const SKELETON_ROW_COUNT = 5

export function UserTableSkeleton() {
  return (
    <div role="status" aria-label="Loading users" className="animate-pulse">
      {/* ── Controls bar shimmer ─────────────────────────────────────────── */}
      {/* search | workload select | workload sort btn — mirrors toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="h-9 w-full sm:w-72 bg-slate-200 rounded-lg" />
        <div className="h-9 w-full sm:w-40 bg-slate-200 rounded-lg" />
        <div className="h-9 w-full sm:w-32 bg-slate-200 rounded-lg" />
      </div>

      {/* ── Mobile card shimmer (< sm) ───────────────────────────────────── */}
      <div className="sm:hidden overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm divide-y divide-slate-100">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
          <div key={i} className="px-4 py-4">
            {/* Avatar + name/email row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {/* Avatar circle */}
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-slate-200 rounded" />
                  <div className="h-2.5 w-40 bg-slate-100 rounded" />
                </div>
              </div>
              {/* Chevron placeholder */}
              <div className="w-4 h-4 bg-slate-100 rounded flex-shrink-0" />
            </div>
            {/* Badges row: posts + done + pending */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="h-5 w-14 bg-slate-100 rounded-full" />
              <div className="h-5 w-14 bg-slate-100 rounded-full" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table shimmer (≥ sm) ─────────────────────────────────── */}
      {/* Uses a real <table> so column widths match the actual table exactly */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-sm" aria-hidden="true">
          {/* Column width hints — mirrors UsersTable th widths */}
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[26%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[10%]" />
          </colgroup>

          {/* Header shimmer */}
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['w-10', 'w-12', 'w-14', 'w-10', 'w-8'].map((w, i) => (
                <th key={i} className="px-4 py-2.5">
                  <div className={`h-2.5 bg-slate-200 rounded ${w}`} />
                </th>
              ))}
            </tr>
          </thead>

          {/* Row shimmers */}
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <tr key={i}>
                {/* Name cell — avatar circle + name bar */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                  </div>
                </td>
                {/* Email */}
                <td className="px-4 py-3">
                  <div className="h-3 w-36 bg-slate-200 rounded" />
                </td>
                {/* Website */}
                <td className="px-4 py-3">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </td>
                {/* Todos — two badge shimmers */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-14 bg-slate-100 rounded-full" />
                    <div className="h-5 w-16 bg-slate-100 rounded-full" />
                  </div>
                </td>
                {/* Posts — one badge shimmer */}
                <td className="px-4 py-3">
                  <div className="h-5 w-14 bg-slate-100 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination shimmer ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1 pt-4">
        <div className="h-3 w-32 bg-slate-200 rounded" />
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-16 bg-slate-200 rounded-lg" />
          <div className="h-3 w-8 bg-slate-100 rounded" />
          <div className="h-7 w-16 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
