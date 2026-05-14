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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Tech Team Directory
        </h1>
        <p className="mt-2 text-gray-500">
          Manage and view all users of your organization.
        </p>
      </div>

      <Suspense fallback={<UserTableSkeleton />}>
        <UsersDataFetcher />
      </Suspense>
    </div>
  )
}
