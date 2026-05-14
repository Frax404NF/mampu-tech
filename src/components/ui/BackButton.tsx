'use client'
import { useRouter } from 'next/navigation'
import { BackIcon } from '@/components/ui/icons'

interface Props {
  fallbackHref?: string
  label?: string
}

/**
 * Navigates back using router.back() to preserve URL state (search, filters).
 * Falls back to a hard href if there is no history (e.g. direct link).
 */
export function BackButton({
  fallbackHref = '/users',
  label = 'Back to users',
}: Props) {
  const router = useRouter()

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors mb-6 group focus:outline-none"
    >
      <BackIcon />
      {label}
    </button>
  )
}
