import { avatarColors } from '@/lib/styles'

export function Avatar({
  name,
  userId,
  size = 'sm',
}: {
  name: string
  userId?: number
  size?: 'sm' | 'lg'
}) {
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

  const sizeClass =
    size === 'lg'
      ? 'w-14 h-14 text-base font-semibold'
      : 'w-8 h-8 text-[11px] font-medium'

  return (
    <div
      className={`rounded-full ${bgColor} flex items-center justify-center flex-shrink-0 ${sizeClass}`}
    >
      <span className="text-white">{initials}</span>
    </div>
  )
}
