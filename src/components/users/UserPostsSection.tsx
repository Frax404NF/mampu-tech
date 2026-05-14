'use client'
import { useState } from 'react'
import type { Post } from '@/types/post'
import { badgeVariants } from '@/lib/styles'
import { ChevronDownIcon } from '@/components/ui/icons'

const PREVIEW_COUNT = 3

interface Props {
  posts: Post[] | null
}

export function UserPostsSection({ posts }: Props) {
  const [listExpanded, setListExpanded] = useState(false)
  const [openPost, setOpenPost] = useState<number | null>(null)

  // ── Unavailable ────────────────────────────────────────────────────────────
  if (posts === null) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
        <p className="section-label mb-3">Posts</p>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Post data is currently unavailable.
        </div>
      </div>
    )
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (posts.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
        <p className="section-label mb-3">Posts</p>
        <div className="flex flex-col items-center py-8 text-center">
          <svg className="w-8 h-8 text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p className="text-sm text-slate-400">No posts yet.</p>
        </div>
      </div>
    )
  }

  // ── List ───────────────────────────────────────────────────────────────────
  const total = posts.length
  const visible = listExpanded ? posts : posts.slice(0, PREVIEW_COUNT)
  const remaining = total - PREVIEW_COUNT

  function togglePost(id: number) {
    setOpenPost((prev) => (prev === id ? null : id))
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-900">Posts</p>
          <span className={badgeVariants.blue}>{total} posts</span>
        </div>
        {/* Always reserve space to prevent reflow */}
        <button
          onClick={() => setListExpanded((p) => !p)}
          className={`text-xs text-slate-400 hover:text-slate-600 transition-colors focus:outline-none flex-shrink-0 ${
            total > PREVIEW_COUNT ? 'visible' : 'invisible'
          }`}
        >
          {listExpanded ? 'Show less' : 'View all'}
        </button>
      </div>

      {/* Post list — each row is an accordion */}
      <ul className="divide-y divide-slate-100">
        {visible.map((post) => {
          const isOpen = openPost === post.id
          return (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => togglePost(post.id)}
                aria-expanded={isOpen}
                className="w-full flex items-start justify-between gap-3 py-3 first:pt-0 text-left group focus:outline-none"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </p>
                  {/* Preview — hidden when expanded */}
                  {!isOpen && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {post.body}
                    </p>
                  )}
                </div>
                <ChevronDownIcon
                  size={14}
                  className={`flex-shrink-0 mt-0.5 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Full body — shown when expanded */}
              {isOpen && (
                <p className="text-sm text-slate-600 leading-relaxed pb-3 border-l-2 border-slate-100 pl-3">
                  {post.body}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {/* Expand list footer — always rendered to prevent height jump */}
      <div className={`mt-3 pt-3 border-t border-slate-100 ${total > PREVIEW_COUNT ? 'block' : 'hidden'}`}>
        <button
          onClick={() => setListExpanded((p) => !p)}
          className="w-full text-center text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          {listExpanded ? 'Show less' : `+ ${remaining} more ${remaining === 1 ? 'post' : 'posts'}`}
        </button>
      </div>
    </div>
  )
}
