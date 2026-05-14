import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchUser, ApiError } from '@/lib/api'
import { fetchTodosForUser } from '@/lib/todos'
import { fetchPostsForUser } from '@/lib/posts'
import { toWebsiteUrl } from '@/lib/utils'
import { Avatar } from '@/components/ui/UserDetail'
import { BackButton } from '@/components/ui/BackButton'
import { UserTodosSection } from '@/components/users/UserTodosSection'
import { UserPostsSection } from '@/components/users/UserPostsSection'
import { error } from 'console'

function parseUserId(id: string): number | null {
  const n = Number(id)
  return Number.isInteger(n) && n > 0 ? n : null
}

export async function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }))
}

async function getUserOr404(id: number) {
  try {
    return await fetchUser(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = parseUserId(id)
  if (numericId === null) return { title: 'User Not Found' }
  try {
    const user = await getUserOr404(numericId)
    return {
      title: user.name,
      description: `Profile for ${user.name} — ${user.email}`,
    }
  } catch {
    return { title: 'User Not Found' }
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numericId = parseUserId(id)
  if (numericId === null) notFound()

  const user = await getUserOr404(numericId)
  const { name, username, email, phone, website, company, address } = user

  const [todos, posts] = await Promise.all([
    fetchTodosForUser(numericId),
    fetchPostsForUser(numericId),
  ])

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
      {/* ── Back link — uses router.back() to restore filter/search state ── */}
      <BackButton label="Back to users" fallbackHref="/users" />

      {/* ── Hero card — avatar + name + 3-col meta grid ────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-6 mb-4">
        {/* Name row */}
        <div className="flex items-start gap-4 mb-5">
          <Avatar name={name} userId={numericId} size="lg" />
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-900 break-words">{name}</h1>
            <p className="text-sm text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-1">
              <span className="text-slate-400">@{username}</span>
              <span className="text-slate-300">·</span>
              <a
                href={toWebsiteUrl(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {website}
              </a>
            </p>
          </div>
        </div>

        {/* 3-col meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Contact */}
          <div className="pt-4 border-t border-slate-100">
            <p className="section-label mb-2">Contact</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-700 hover:underline truncate">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{phone}</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="pt-4 border-t border-slate-100">
            <p className="section-label mb-2">Company</p>
            <p className="text-sm font-medium text-slate-900">{company.name}</p>
            <p className="text-xs text-slate-500 italic mt-1">
              {company.catchPhrase}
            </p>
          </div>

          {/* Address */}
          <div className="pt-4 border-t border-slate-100">
            <p className="section-label mb-2">Address</p>
            <div className="text-sm text-slate-600 space-y-0.5">
              <p>{address.street}, {address.suite}</p>
              <p>{address.city}, {address.zipcode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Posts + Todos — 2-col at lg, stacked below ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserPostsSection posts={posts} />
        <UserTodosSection todos={todos} />
      </div>
    </div>
  )
}
