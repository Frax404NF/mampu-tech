/** Section label (formerly "overline") — small uppercase tracking label */
export const sectionLabel = 'section-label'


/**
 * Badge variant → combined CSS class string for runtime variant selection.
 * Each value composes the base `.badge` class with a variant modifier.
 * Usage: `<span className={badgeVariants.green}>5 done</span>`
 */
export const badgeVariants = {
  blue:  'badge badge-blue',
  green: 'badge badge-green',
  amber: 'badge badge-amber',
  slate: 'badge badge-slate',
  red:   'badge badge-red',
} as const

export type BadgeVariant = keyof typeof badgeVariants

/**
 * Avatar background colors — deterministic selection via `userId % length`.
 * Usage: `avatarColors[user.id % avatarColors.length]`
 */
export const avatarColors = [
  'bg-blue-500',
  'bg-sky-700',
  'bg-emerald-700',
  'bg-amber-600',
  'bg-rose-600',
] as const

export type AvatarColor = (typeof avatarColors)[number]
