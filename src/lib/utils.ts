import { ApiError } from '@/lib/api'

/**
 * Groups an array of items into a Map keyed by each item's `userId` field.
 * Generic — works for any type with a `userId: number` property.
 */
export function groupByUserId<T extends { userId: number }>(
  items: T[]
): Map<number, T[]> {
  const map = new Map<number, T[]>()
  for (const item of items) {
    const bucket = map.get(item.userId)
    if (bucket) {
      bucket.push(item)
    } else {
      map.set(item.userId, [item])
    }
  }
  return map
}

/**
 * Wraps an async fetch call with ApiError-only catch.
 * Returns null on ApiError (graceful degrade), re-throws any other error.
 */
export async function withApiErrorFallback<T>(
  fn: () => Promise<T>
): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof ApiError) return null
    throw err
  }
}

/**
 * Normalises a bare hostname to an https:// URL.
 * Leaves values that already start with http(s):// unchanged.
 */
export function toWebsiteUrl(website: string): string {
  return website.startsWith('http') ? website : `https://${website}`
}
