'use client'
import { useState } from 'react'
import type { Post } from '@/types/post'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface Props {
  posts: Post[] | null
}

export function UserPostsSection({ posts }: Props) {
  const [listExpanded, setListExpanded] = useState(false)
  // Fix 1 & 7: first post open by default — signals interactivity, rest collapsed
  const [expanded, setExpanded] = useState<Set<number>>(
    () => new Set(posts && posts.length > 0 ? [posts[0].id] : [])
  )

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Null branch ────────────────────────────────────────────────────────────
  if (posts === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 text-gray-400"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Post data is currently unavailable.
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Empty branch ───────────────────────────────────────────────────────────
  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300 mb-2"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p className="text-sm text-gray-400">No posts yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── List branch ────────────────────────────────────────────────────────────
  const total = posts.length
  const visiblePosts = listExpanded ? posts : posts.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Posts
          </CardTitle>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {total}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="divide-y divide-gray-100">
          {visiblePosts.map((post) => {
            const isExpanded = expanded.has(post.id)
            const bodyId = `post-body-${post.id}`
            return (
              <li key={post.id}>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={bodyId}
                  onClick={() => toggle(post.id)}
                  className="w-full flex items-start justify-between gap-3 py-3 px-3 -mx-3 text-left hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-gray-900 break-words line-clamp-2">
                      {post.title}
                    </span>
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isExpanded && (
                  <div id={bodyId} role="region">
                    <p className="mt-1.5 mb-3 whitespace-pre-line break-words text-sm text-slate-500 leading-relaxed pl-3 border-l-2 border-slate-100">
                      {post.body}
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {total > 3 && (
          <button
            type="button"
            onClick={() => setListExpanded((prev) => !prev)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${listExpanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {listExpanded ? 'Show fewer' : `Show ${total - 3} more posts`}
          </button>
        )}
      </CardContent>
    </Card>
  )
}
