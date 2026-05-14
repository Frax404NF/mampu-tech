# Mampu Tech — Team Directory

A team directory web application built with Next.js 15 (App Router) and React 19. Users can browse, search, filter, and view detailed profiles of team members, including their posts and todos activity.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript 5 (strict mode) |
| Testing | Jest 30, React Testing Library, user-event |
| Linting | ESLint 9, Prettier 3 |
| Package Manager | pnpm |

---

## Features

### User Directory (`/users`)
- Server-side data fetching with 60s revalidation
- Searchable by name or email (debounced, URL-synced)
- Sortable by name (asc/desc)
- Filterable by workload level (high/medium/low pending todos)
- Sortable by pending workload count
- Pagination (5 per page)
- Responsive layout: table on desktop, card list on mobile
- Skeleton loading state with accessible `role="status"`
- Error boundary with retry action
- Empty state with clear-filters prompt
- Derived activity signals: todo completion badges, post count badges

### User Detail (`/users/[id]`)
- Full profile: contact info, company, address
- Posts section with accordion expand and "view all" toggle
- Todos section with pending/completed tabs
- Graceful degradation when posts or todos API fails (shows "unavailable" instead of crashing)
- 404 handling for invalid or non-existent user IDs
- Error boundary with retry
- Skeleton loading state
- Back button preserves previous filter/search state via `router.back()`

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                # Home
│   └── users/
│       ├── page.tsx            # User directory (server component)
│       ├── error.tsx           # Error boundary
│       └── [id]/
│           ├── page.tsx        # User detail (server component)
│           ├── loading.tsx     # Suspense fallback
│           ├── error.tsx       # Error boundary
│           └── not-found.tsx   # 404 page
├── components/
│   ├── ui/                     # Reusable primitives (Card, Avatar, BackButton)
│   └── users/                  # Feature components (UsersTable, PostsSection, TodosSection)
├── lib/
│   ├── api.ts                  # Centralised fetch helpers, ApiError class
│   ├── todos.ts                # Todo grouping and activity computation
│   ├── posts.ts                # Post grouping and count helpers
│   └── utils.ts                # Shared utilities (groupByUserId, toWebsiteUrl)
├── types/                      # TypeScript interfaces
└── __tests__/                  # Jest test files
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install and Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm test         # Run Jest (single pass)
pnpm test:watch   # Run Jest in watch mode
```

---

## Testing

Tests are located in `src/__tests__/` and use Jest with React Testing Library.

```bash
pnpm test
```

### Test Coverage

**Users List (`UsersTable.test.tsx`)**
- Renders users with derived activity signals (todo badges, post counts)
- Filters by search input (name/email)
- Filters by workload level (high/medium/low)
- Sorts by name (asc/desc toggle)
- Shows empty state when no results match
- Shows dash placeholders when data is unavailable
- Disables workload filter when todos API failed
- Loading state (skeleton with accessible role)
- Error state (error boundary with retry button)
- Mocked `fetch` for API success and error responses

**User Detail (`UserDetail.test.tsx`)**
- Posts section: renders titles, count badge, expand/collapse, null state, empty state
- Todos section: renders badges, pending/completed tabs, null state, empty state
- Error boundary: renders error message with retry
- Not Found: renders 404 with back link
- Loading state (skeleton with accessible role)

---

## Design Decisions

- **Server Components by default** — pages fetch data on the server; only interactive components use `"use client"`.
- **Graceful degradation** — if the todos or posts API fails, the app still renders user data with "unavailable" indicators rather than crashing.
- **URL-synced state** — search, sort, and filter params are stored in the URL so users can share or bookmark filtered views.
- **Accessible loading states** — skeletons use `role="status"` and `aria-label` for screen reader support.
---

## Data Source

All data is fetched from [JSONPlaceholder](https://jsonplaceholder.typicode.com) (`/users`, `/todos`, `/posts` endpoints).

Developer: Frax404NF