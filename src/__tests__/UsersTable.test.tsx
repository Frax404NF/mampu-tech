import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersTable } from '@/components/users/UsersTable'
import { UserTableSkeleton } from '@/components/users/UserTableSkeleton'
import type { UserRow } from '@/types/user'

// ─── Mock next/navigation ────────────────────────────────────────────────────
const mockPush = jest.fn()
const mockReplace = jest.fn()
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}))

// ─── Test data ───────────────────────────────────────────────────────────────
function makeUser(overrides: Partial<UserRow['user']> = {}): UserRow['user'] {
  return {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@example.com',
    phone: '1-770-736-8031',
    website: 'hildegard.org',
    company: { name: 'Romaguera', catchPhrase: 'Multi-layered', bs: 'synergize' },
    address: { street: 'Kulas', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998', geo: { lat: '-37.3159', lng: '81.1496' } },
    ...overrides,
  }
}

const rows: UserRow[] = [
  { user: makeUser({ id: 1, name: 'Alice Smith', email: 'alice@test.com' }), activity: { completed: 5, pending: 12, total: 17 }, postCount: 3 },
  { user: makeUser({ id: 2, name: 'Bob Jones', email: 'bob@test.com' }), activity: { completed: 8, pending: 3, total: 11 }, postCount: 7 },
  { user: makeUser({ id: 3, name: 'Charlie Brown', email: 'charlie@test.com' }), activity: { completed: 2, pending: 7, total: 9 }, postCount: 0 },
  { user: makeUser({ id: 4, name: 'Diana Prince', email: 'diana@test.com' }), activity: { completed: 0, pending: 0, total: 0 }, postCount: null },
  { user: makeUser({ id: 5, name: 'Eve Adams', email: 'eve@test.com' }), activity: null, postCount: 5 },
  { user: makeUser({ id: 6, name: 'Frank Castle', email: 'frank@test.com' }), activity: { completed: 1, pending: 4, total: 5 }, postCount: 2 },
]

beforeEach(() => {
  jest.clearAllMocks()
  mockSearchParams = new URLSearchParams()
})

describe('UsersTable', () => {
  it('renders users with activity signals (todos badges and post counts)', () => {
    render(<UsersTable rows={rows} todosAvailable postsAvailable />)

    // Users visible on first page (rendered in both mobile + desktop views)
    expect(screen.getAllByText('Alice Smith').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Bob Jones').length).toBeGreaterThanOrEqual(1)

    // Activity badges (appear in both views)
    expect(screen.getAllByText('12 pending').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('5 done').length).toBeGreaterThanOrEqual(1)

    // Post counts
    expect(screen.getAllByText('3 posts').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('7 posts').length).toBeGreaterThanOrEqual(1)
  })

  it('filters users by search input (name or email)', async () => {
    const user = userEvent.setup()
    render(<UsersTable rows={rows} todosAvailable postsAvailable />)

    const searchInput = screen.getByLabelText('Search users')
    await user.type(searchInput, 'bob')

    // Only Bob should be visible (mobile + desktop = 2 instances)
    expect(screen.getAllByText('Bob Jones').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument()
  })

  it('filters by workload level (high/medium/low)', async () => {
    const user = userEvent.setup()
    // Start with workload=low already in URL so the component filters immediately
    mockSearchParams = new URLSearchParams('workload=low')
    render(<UsersTable rows={rows} todosAvailable postsAvailable />)

    // Low = pending <= 5: Bob (3), Diana (0), Eve (null → shown), Frank (4)
    expect(screen.getAllByText('Bob Jones').length).toBeGreaterThanOrEqual(1)
    // Alice has 12 pending (high) — should be filtered out
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument()
    // Charlie has 7 pending (medium) — should be filtered out
    expect(screen.queryByText('Charlie Brown')).not.toBeInTheDocument()
  })

  it('sorts users by name ascending/descending', async () => {
    const user = userEvent.setup()
    render(<UsersTable rows={rows} todosAvailable postsAvailable />)

    // Default is asc — first user alphabetically is Alice
    const table = screen.getByRole('table')
    const firstRow = within(table).getAllByRole('row')[1] // skip header
    expect(within(firstRow).getByText('Alice Smith')).toBeInTheDocument()

    // Click name header to toggle to desc
    const nameHeader = screen.getByText('Name')
    await user.click(nameHeader)

    expect(mockReplace).toHaveBeenCalled()
  })

  it('shows empty state when no users match filters', async () => {
    const user = userEvent.setup()
    render(<UsersTable rows={rows} todosAvailable postsAvailable />)

    const searchInput = screen.getByLabelText('Search users')
    await user.type(searchInput, 'zzzznonexistent')

    expect(screen.getByText('No users found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filter')).toBeInTheDocument()
  })

  it('shows dash when activity data is null (todos unavailable for a user)', () => {
    const nullRows: UserRow[] = [
      { user: makeUser({ id: 1, name: 'Test User', email: 'test@test.com' }), activity: null, postCount: null },
    ]
    render(<UsersTable rows={nullRows} todosAvailable={false} postsAvailable={false} />)

    // Dashes for unavailable data
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThan(0)
  })

  it('disables workload filter when todos are not available', () => {
    render(<UsersTable rows={rows} todosAvailable={false} postsAvailable />)

    const select = screen.getByLabelText('Filter by workload')
    expect(select).toBeDisabled()
  })
})

// ─── Loading state (skeleton) ────────────────────────────────────────────────
describe('UserTableSkeleton (loading state)', () => {
  it('renders a loading skeleton with accessible status', () => {
    render(<UserTableSkeleton />)

    const skeleton = screen.getByRole('status', { name: 'Loading users' })
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })
})

// ─── Error state (error boundary) ────────────────────────────────────────────
describe('UsersError (error state)', () => {
  it('renders error UI with retry button', async () => {
    const { default: UsersError } = await import('@/app/users/error')
    const mockReset = jest.fn()
    const error = new Error('API failure')

    jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<UsersError error={error} reset={mockReset} />)

    expect(screen.getByText('Failed to Load Users')).toBeInTheDocument()
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: 'Try again' })
    await userEvent.click(retryBtn)
    expect(mockReset).toHaveBeenCalledTimes(1)

    jest.restoreAllMocks()
  })
})

// ─── Network mock test (fetchUsers) ──────────────────────────────────────────
describe('API layer (mocked network)', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('fetchUsers returns parsed user data on success', async () => {
    const mockUsers = [
      { id: 1, name: 'Test User', username: 'tuser', email: 'test@test.com', phone: '123', website: 'test.com', company: { name: 'Co', catchPhrase: 'x', bs: 'y' }, address: { street: 'St', suite: 'A', city: 'City', zipcode: '00000', geo: { lat: '0', lng: '0' } } },
    ]

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    })

    const { fetchUsers } = await import('@/lib/api')
    const result = await fetchUsers()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      expect.any(Object)
    )
    expect(result).toEqual(mockUsers)
    expect(result[0].name).toBe('Test User')
  })

  it('fetchUsers throws ApiError on non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })

    const { fetchUsers, ApiError } = await import('@/lib/api')

    await expect(fetchUsers()).rejects.toThrow(ApiError)
    await expect(fetchUsers()).rejects.toMatchObject({ status: 500 })
  })
})
