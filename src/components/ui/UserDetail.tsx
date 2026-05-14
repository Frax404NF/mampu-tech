import React from 'react'
import { avatarColors } from '@/lib/styles'

export function Avatar({ name, userId }: { name: string; userId?: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const bgColor =
    userId !== undefined
      ? avatarColors[userId % avatarColors.length]
      : avatarColors[0]

  return (
    <div
      className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-[11px] font-medium text-white">{initials}</span>
    </div>
  )
}

export function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-baseline gap-4 text-sm">
      <span className="w-16 flex-shrink-0">{label}</span>
      <div>{children}</div>
    </div>
  )
}

export function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
