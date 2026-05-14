import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserPostsSection } from '@/components/users/UserPostsSection'
import { UserTodosSection } from '@/components/users/UserTodosSection'
import type { Post } from '@/types/post'
import type { Todo } from '@/types/todo'

// ─── Test data ───────────────────────────────────────────────────────────────
const mockPosts: Post[] = [
  { userId: 1, id: 1, title: 'First Post', body: 'Body of first post' },
  { userId: 1, id: 2, title: 'Second Post', body: 'Body of second post' },
  { userId: 1, id: 3, title: 'Third Post', body: 'Body of third post' },
  { userId: 1, id: 4, title: 'Fourth Post', body: 'Body of fourth post' },
]

const mockTodos: Todo[] = [
  { userId: 1, id: 1, title: 'Buy groceries', completed: false },
  { userId: 1, id: 2, title: 'Walk the dog', completed: true },
  { userId: 1, id: 3, title: 'Write tests', completed: false },
  { userId: 1, id: 4, title: 'Read a book', completed: true },
  { userId: 1, id: 5, title: 'Clean house', completed: false },
]

// ─── Posts Section ───────────────────────────────────────────────────────────
describe('UserPostsSection', () => {
  it('renders posts with title and body preview', () => {
    render(<UserPostsSection posts={mockPosts} />)

    expect(screen.getByText('First Post')).toBeInTheDocument()
    expect(screen.getByText('Second Post')).toBeInTheDocument()
    expect(screen.getByText('Third Post')).toBeInTheDocument()
    // 4th post hidden behind "View all" (PREVIEW_COUNT = 3)
    expect(screen.queryByText('Fourth Post')).not.toBeInTheDocument()
  })

  it('shows post count badge', () => {
    render(<UserPostsSection posts={mockPosts} />)
    expect(screen.getByText('4 posts')).toBeInTheDocument()
  })

  it('expands to show all posts when "View all" is clicked', async () => {
    const user = userEvent.setup()
    render(<UserPostsSection posts={mockPosts} />)

    await user.click(screen.getByText('View all'))
    expect(screen.getByText('Fourth Post')).toBeInTheDocument()
  })

  it('shows unavailable state when posts is null', () => {
    render(<UserPostsSection posts={null} />)
    expect(
      screen.getByText('Post data is currently unavailable.')
    ).toBeInTheDocument()
  })

  it('shows empty state when posts array is empty', () => {
    render(<UserPostsSection posts={[]} />)
    expect(screen.getByText('No posts yet.')).toBeInTheDocument()
  })
})

// ─── Todos Section ───────────────────────────────────────────────────────────
describe('UserTodosSection', () => {
  it('renders todos with pending/completed badges', () => {
    render(<UserTodosSection todos={mockTodos} />)

    // Badges
    expect(screen.getByText('3 pending')).toBeInTheDocument()
    expect(screen.getByText('2 done')).toBeInTheDocument()
  })

  it('shows pending todos by default', () => {
    render(<UserTodosSection todos={mockTodos} />)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
    // Completed todos not shown in pending tab
    expect(screen.queryByText('Walk the dog')).not.toBeInTheDocument()
  })

  it('switches to completed tab', async () => {
    const user = userEvent.setup()
    render(<UserTodosSection todos={mockTodos} />)

    await user.click(screen.getByRole('button', { name: 'completed' }))

    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
    expect(screen.getByText('Read a book')).toBeInTheDocument()
  })

  it('shows unavailable state when todos is null', () => {
    render(<UserTodosSection todos={null} />)
    expect(
      screen.getByText('Todo data is currently unavailable.')
    ).toBeInTheDocument()
  })

  it('shows empty state when todos array is empty', () => {
    render(<UserTodosSection todos={[]} />)
    expect(screen.getByText('No todos yet.')).toBeInTheDocument()
  })
})

// ─── Error boundary (users/[id]/error.tsx) ───────────────────────────────────
// We test the error component directly since it's a client component
jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}))

describe('UserDetailError', () => {
  // Dynamic import to avoid module-level mock conflicts
  it('renders error state with retry button', async () => {
    const { default: UserDetailError } = await import('@/app/users/[id]/error')
    const mockReset = jest.fn()
    const error = new Error('Network failure')

    // Suppress console.error from the useEffect
    jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<UserDetailError error={error} reset={mockReset} />)

    expect(screen.getByText('Failed to load profile')).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: 'Try again' })
    await userEvent.click(retryBtn)
    expect(mockReset).toHaveBeenCalledTimes(1)

    jest.restoreAllMocks()
  })
})

// ─── Not Found (users/[id]/not-found.tsx) ────────────────────────────────────
describe('UserNotFound', () => {
  it('renders 404 page with back link', async () => {
    const { default: UserNotFound } = await import('@/app/users/[id]/not-found')
    render(<UserNotFound />)

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('User not found')).toBeInTheDocument()
    expect(screen.getByText('Back to users')).toBeInTheDocument()
  })
})

// ─── Loading state (skeleton) ────────────────────────────────────────────────
describe('UserDetailSkeleton (loading state)', () => {
  it('renders a loading skeleton with accessible status', async () => {
    const { UserDetailSkeleton } =
      await import('@/components/users/UserDetailSkeleton')
    render(<UserDetailSkeleton />)

    const skeleton = screen.getByRole('status', {
      name: 'Loading user profile',
    })
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })
})
