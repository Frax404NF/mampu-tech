import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
        Welcome to Mampu Tech
      </h1>
      <p className="text-lg text-gray-500 max-w-2xl mb-6">
        The central hub for our organization. Manage team members, view contact
        information, and keep our directory up to date.
      </p>
      <Link
        href="/users"
        className="rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium px-8 py-3"
      >
        User Repository
      </Link>
    </div>
  )
}
