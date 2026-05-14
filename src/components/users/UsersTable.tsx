'use client'
import { useMemo, useTransition, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { UserRow } from '@/types/user'
import type { UserActivity } from '@/lib/todos'
import { toWebsiteUrl } from '@/lib/todos'
import { Avatar } from '@/components/ui/UserDetail'
import { badgeVariants } from '@/lib/styles'

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 5

interface UsersTableProps {
  rows: UserRow[]
  todosAvailable: boolean
  postsAvailable: boolean
}

type SortOrder = 'asc' | 'desc'
type WorkloadFilter = 'all' | 'high' | 'medium' | 'low'

const VALID_WORKLOAD_VALUES: WorkloadFilter[] = ['all', 'high', 'medium', 'low']

function parseWorkloadParam(value: string | null): WorkloadFilter {
  if (value && (VALID_WORKLOAD_VALUES as string[]).includes(value)) {
    return value as WorkloadFilter
  }
  return 'all'
}

function applyWorkloadFilter(rows: UserRow[], workload: WorkloadFilter): UserRow[] {
  if (workload === 'all') return rows
  return rows.filter((row) => {
    if (row.activity === null) return true
    const p = row.activity.pending
    switch (workload) {
      case 'high':   return p > 10
      case 'medium': return p > 5 && p <= 10
      case 'low':    return p <= 5
      default:       return true
    }
  })
}

function getFilteredSortedRows(
  rows: UserRow[],
  workload: WorkloadFilter,
  search: string,
  sort: SortOrder,
  pendingSort: SortOrder | null
) {
  let filtered = applyWorkloadFilter(rows, workload)

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.user.name.toLowerCase().includes(q) ||
        r.user.email.toLowerCase().includes(q)
    )
  }

  if (pendingSort !== null) {
    return [...filtered].sort((a, b) => {
      const ap = a.activity?.pending ?? 0
      const bp = b.activity?.pending ?? 0
      return pendingSort === 'desc' ? bp - ap : ap - bp
    })
  }

  return [...filtered].sort((a, b) =>
    sort === 'asc'
      ? a.user.name.localeCompare(b.user.name)
      : b.user.name.localeCompare(a.user.name)
  )
}

// ─── Todos badges ─────────────────────────────────────────────────────────────
function TodosBadges({ activity }: { activity: UserActivity | null }) {
  if (activity === null) return <span className="text-slate-400 text-sm">—</span>

  const { pending, completed } = activity
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {completed > 0 && (
        <span className={badgeVariants.green}>{completed} done</span>
      )}
      {pending > 0 && (
        <span className={badgeVariants.amber}>{pending} pending</span>
      )}
      {completed === 0 && pending === 0 && (
        <span className={badgeVariants.slate}>no todos</span>
      )}
    </div>
  )
}

// ─── Posts badge ──────────────────────────────────────────────────────────────
function PostsBadge({ count }: { count: number | null }) {
  if (count === null) return <span className="text-slate-400 text-sm">—</span>
  if (count === 0) return <span className={badgeVariants.slate}>0 posts</span>
  return <span className={badgeVariants.blue}>{count} posts</span>
}

// ─── Pagination controls ──────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  totalRows,
  pageSize,
  onPrev,
  onNext,
}: {
  page: number
  totalPages: number
  totalRows: number
  pageSize: number
  onPrev: () => void
  onNext: () => void
}) {
  const from = totalRows === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}–{to}</span> of{' '}
        <span className="font-medium text-slate-700">{totalRows}</span> users
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          aria-label="Previous page"
          className="btn btn-secondary px-2.5 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <span className="text-xs text-slate-500 px-1">
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="btn btn-secondary px-2.5 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function UsersTable({
  rows,
  todosAvailable,
  postsAvailable: _postsAvailable,
}: UsersTableProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)

  const sort = (searchParams.get('sort') as SortOrder) || 'asc'
  const workload = parseWorkloadParam(searchParams.get('workload'))

  const pendingSortParam = searchParams.get('psort')
  const pendingSort: SortOrder | null =
    pendingSortParam === 'asc' || pendingSortParam === 'desc'
      ? pendingSortParam
      : null

  const filteredRows = useMemo(
    () => getFilteredSortedRows(rows, workload, inputValue, sort, pendingSort),
    [rows, workload, inputValue, sort, pendingSort]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1) }, [workload, inputValue, sort, pendingSort])

  const pagedRows = useMemo(
    () => filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredRows, page]
  )

  // Detect if any filter is active
  const hasActiveFilters =
    inputValue !== '' || workload !== 'all' || pendingSort !== null

  // Debounce q URL update to 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || ''
      if (currentQ !== inputValue) {
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        if (inputValue) {
          params.set('q', inputValue)
        } else {
          params.delete('q')
        }
        startTransition(() => { router.replace(`?${params.toString()}`) })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, router, searchParams])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  function handleSortToggle() {
    const newSort = sort === 'asc' ? 'desc' : 'asc'
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('sort', newSort)
    params.delete('psort')
    startTransition(() => { router.replace(`?${params.toString()}`) })
  }

  function handleWorkloadChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as WorkloadFilter
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (val === 'all') { params.delete('workload') } else { params.set('workload', val) }
    startTransition(() => { router.replace(`?${params.toString()}`) })
  }

  function handlePendingSortToggle() {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (pendingSort === 'desc') {
      params.set('psort', 'asc')
    } else if (pendingSort === 'asc') {
      params.delete('psort')
    } else {
      params.set('psort', 'desc')
    }
    startTransition(() => { router.replace(`?${params.toString()}`) })
  }

  function handleClearFilters() {
    setInputValue('')
    const params = new URLSearchParams()
    if (sort !== 'asc') params.set('sort', sort)
    startTransition(() => { router.replace(`?${params.toString()}`) })
  }

  const pendingSortIcon =
    pendingSort === 'desc' ? '↓' : pendingSort === 'asc' ? '↑' : '↕'
  const pendingSortLabel =
    pendingSort === 'desc'
      ? 'Most pending first'
      : pendingSort === 'asc'
        ? 'Least pending first'
        : 'Sort by workload'

  return (
    <div>
      {/* ── Controls bar ─────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            className="input pl-10"
            value={inputValue}
            onChange={handleSearch}
            aria-label="Search users"
          />
        </div>

        {/* Workload filter */}
        <label htmlFor="workload-filter" className="sr-only">
          Filter by workload
        </label>
        <select
          id="workload-filter"
          value={workload}
          onChange={handleWorkloadChange}
          disabled={!todosAvailable}
          className="select w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">All workloads</option>
          <option value="high">High (&gt;10 pending)</option>
          <option value="medium">Medium (6–10 pending)</option>
          <option value="low">Low (≤5 pending)</option>
        </select>

        {/* Workload sort */}
        {todosAvailable && (
          <button
            onClick={handlePendingSortToggle}
            aria-label={pendingSortLabel}
            title={pendingSortLabel}
            className={
              pendingSort !== null
                ? 'btn btn-primary w-full sm:w-auto'
                : 'btn btn-secondary w-full sm:w-auto'
            }
          >
            Workload {pendingSortIcon}
          </button>
        )}

        {/* Clear filters — only shown when something is active */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="btn btn-tinted w-full sm:w-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Empty state — inside the table container ──────────────────────── */}
      {filteredRows.length === 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <svg
              className="w-8 h-8 text-slate-300 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-sm font-medium text-slate-700 mb-1">No users found</p>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search or filter
            </p>
            <button onClick={handleClearFilters} className="btn btn-tinted">
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Mobile card list (< sm) ──────────────────────────────────── */}
          <ul className="sm:hidden divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            {pagedRows.map((row) => (
              <li
                key={row.user.id}
                onClick={() => router.push(`/users/${row.user.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push(`/users/${row.user.id}`)
                  }
                }}
                tabIndex={0}
                aria-label={`View profile for ${row.user.name}`}
                className="px-4 py-4 hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {/* Name + avatar row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={row.user.name} userId={row.user.id} />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {row.user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {row.user.email}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-300 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>

                {/* Badges row */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <PostsBadge count={row.postCount} />
                  <TodosBadges activity={row.activity} />
                </div>
              </li>
            ))}
          </ul>

          {/* ── Desktop table (≥ sm) ─────────────────────────────────────── */}
          <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th
                      scope="col"
                      className="table-header cursor-pointer hover:bg-slate-100 transition-colors select-none group w-[28%]"
                      onClick={handleSortToggle}
                    >
                      <div className="flex items-center gap-1.5">
                        Name
                        <span
                          className="text-slate-400 group-hover:text-slate-600"
                          aria-hidden="true"
                        >
                          {sort === 'asc' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                          )}
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="table-header w-[26%]">Email</th>
                    <th scope="col" className="table-header w-[18%]">Website</th>
                    <th scope="col" className="table-header w-[18%]">Todos</th>
                    <th scope="col" className="table-header w-[10%]">Posts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedRows.map((row) => (
                    <tr
                      key={row.user.id}
                      onClick={() => router.push(`/users/${row.user.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          router.push(`/users/${row.user.id}`)
                        }
                      }}
                      tabIndex={0}
                      aria-label={`View profile for ${row.user.name}`}
                      className="hover:bg-blue-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={row.user.name} userId={row.user.id} />
                          <span className="font-medium text-slate-900 truncate">
                            {row.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-0">
                        {row.user.email}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={toWebsiteUrl(row.user.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.user.website}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <TodosBadges activity={row.activity} />
                      </td>
                      <td className="px-4 py-3">
                        <PostsBadge count={row.postCount} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Pagination ───────────────────────────────────────────────── */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalRows={filteredRows.length}
            pageSize={PAGE_SIZE}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}
    </div>
  )
}
