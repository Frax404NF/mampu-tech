import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mampu Tech | Team Directory',
  description: 'Manage and view all users of the Mampu Tech organization.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-lg tracking-tight text-gray-900"
            >
              Mampu Tech
            </Link>
            <nav>
              <Link
                href="/users"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                User Repository
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          <div className="container mx-auto px-4">
            &copy; 2026. Built for Mampu IO Take Home Test.
          </div>
        </footer>
      </body>
    </html>
  )
}
