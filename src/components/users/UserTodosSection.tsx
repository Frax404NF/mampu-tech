'use client'
import { useState } from 'react'
import type { Todo } from '@/types/todo'
import { badgeVariants } from '@/lib/styles'

const PREVIEW_COUNT = 3

interface Props {
  todos: Todo[] | null
}

type Tab = 'pending' | 'completed'

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
        checked
          ? 'bg-emerald-500 border-emerald-500'
          : 'border-slate-300 bg-white'
      }`}
      aria-hidden="true"
    >
      {checked && (
        <svg
          className="w-2.5 h-2.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  )
}

export function UserTodosSection({ todos }: Props) {
  const [tab, setTab] = useState<Tab>('pending')
  const [expanded, setExpanded] = useState(false)

  // ── Unavailable ────────────────────────────────────────────────────────────
  if (todos === null) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
        <p className="section-label mb-3">Todos</p>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500">
          <svg
            className="w-4 h-4 text-slate-400 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Todo data is currently unavailable.
        </div>
      </div>
    )
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (todos.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
        <p className="section-label mb-3">Todos</p>
        <div className="flex flex-col items-center py-8 text-center">
          <svg
            className="w-8 h-8 text-slate-300 mb-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="12" y2="13" />
          </svg>
          <p className="text-sm text-slate-400">No todos yet.</p>
        </div>
      </div>
    )
  }

  // ── Normal ─────────────────────────────────────────────────────────────────
  const pending = todos.filter((t) => !t.completed)
  const completed = todos.filter((t) => t.completed)
  const activeList = tab === 'pending' ? pending : completed
  const visible = expanded ? activeList : activeList.slice(0, PREVIEW_COUNT)
  const remaining = activeList.length - PREVIEW_COUNT

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
      {/* Header — title + badges + view all toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-slate-900">Todos</p>
          {completed.length > 0 && (
            <span className={badgeVariants.green}>{completed.length} done</span>
          )}
          {pending.length > 0 && (
            <span className={badgeVariants.amber}>
              {pending.length} pending
            </span>
          )}
        </div>
        {/* Always reserve space — invisible when not applicable to prevent reflow */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className={`text-xs text-slate-400 hover:text-slate-600 transition-colors focus:outline-none flex-shrink-0 ${
            activeList.length > PREVIEW_COUNT ? 'visible' : 'invisible'
          }`}
        >
          {expanded ? 'Show less' : 'View all'}
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-4 border-b border-slate-100 mb-4">
        {(['pending', 'completed'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t)
              setExpanded(false)
            }}
            className={`pb-2 text-sm font-medium capitalize transition-colors focus:outline-none border-b-2 -mb-px ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Todo list */}
      {visible.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">
          No {tab} todos.
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((todo) => (
            <li key={todo.id} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex-shrink-0">
                <Checkbox checked={todo.completed} />
              </span>
              <span
                className={`text-sm leading-snug min-w-0 break-words ${
                  todo.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-700'
                }`}
              >
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Expand / collapse footer — always rendered to prevent height jump */}
      <div
        className={`mt-3 pt-3 border-t border-slate-100 ${activeList.length > PREVIEW_COUNT ? 'block' : 'hidden'}`}
      >
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full text-center text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          {expanded ? 'Show less' : `+ ${remaining} more ${tab}`}
        </button>
      </div>
    </div>
  )
}
