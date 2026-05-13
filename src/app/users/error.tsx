'use client'

import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            Failed to Load Users  
          </CardTitle>
          <CardDescription>
            We encountered a problem while fetching the directory data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-md">
            An unexpected error occurred. Please try again.
          </p>
        </CardContent>
        <CardFooter>
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Try again
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
