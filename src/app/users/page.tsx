import { Suspense } from 'react'
import { ApiError, fetchUsers, fetchTodos, fetchPosts } from '@/lib/api'
import { activityFor, groupTodosByUser } from '@/lib/todos'
import { groupPostsByUser, postCountFor } from '@/lib/posts'
import type { UserRow } from '@/types/user'
import { UsersTable } from '@/components/users/UsersTable'
import { UserTableSkeleton } from '@/components/users/UserTableSkeleton'

async function fetchTodosOrNull() {
  try {
    return await fetchTodos()
  } catch (err) {
    if (err instanceof ApiError) return null
    throw err
  }
}

async function fetchPostsOrNull() {
  try {
    return await fetchPosts()
  } catch (err) {
    if (err instanceof ApiError) return null
    throw err
  }
}

async function UsersDataFetcher() {
  const [users, todos, posts] = await Promise.all([
    fetchUsers(),
    fetchTodosOrNull(),
    fetchPostsOrNull(),
  ])

  const todosAvailable = todos !== null
  const todosByUser = todosAvailable ? groupTodosByUser(todos) : null

  const postsAvailable = posts !== null
  const postsByUser = postsAvailable ? groupPostsByUser(posts) : null

  const rows: UserRow[] = users.map((user) => ({
    user,
    activity: todosByUser ? activityFor(todosByUser.get(user.id)) : null,
    postCount: postsByUser ? postCountFor(postsByUser.get(user.id)) : null,
  }))

  return (
    <UsersTable
      rows={rows}
      todosAvailable={todosAvailable}
      postsAvailable={postsAvailable}
    />
  )
}

export default function UsersPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">Browse and search your team.</p>
      </div>

      <Suspense fallback={<UserTableSkeleton />}>
        <UsersDataFetcher />
      </Suspense>
    </div>
  )
}
