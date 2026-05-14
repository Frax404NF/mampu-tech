'use client'

import { useEffect } from 'react'
import { BackButton } from '@/components/ui/BackButton'

export default function UserDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[UserDetail] Error:', error)
  }, [error])

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
      <BackButton label="Back to users" fallbackHref="/users" />
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <svg
          className="w-8 h-8 text-red-400 mx-auto mb-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-sm font-medium text-red-800 mb-1">
          Failed to load profile
        </p>
        <p className="text-xs text-red-600 mb-5">
          We couldn&apos;t fetch this user&apos;s data. This is likely
          temporary.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn btn-primary text-xs px-4 py-2">
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
