import Link from 'next/link'

export default function UserNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
      {/* Back link — consistent with detail and error pages */}
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to users
      </Link>

      {/* 404 card */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-12 text-center">
        <p className="text-5xl font-semibold text-slate-200 mb-3">404</p>
        <p className="text-sm font-medium text-slate-700 mb-1">User not found</p>
        <p className="text-xs text-slate-500">
          No user exists with that ID.
        </p>
      </div>
    </div>
  )
}
