import type { Post } from "@/types/post";
import { fetchPosts } from "@/lib/api";
import { groupByUserId, withApiErrorFallback } from "@/lib/utils";

/**
 * Groups a flat posts array into a Map keyed by userId.
 */
export function groupPostsByUser(posts: Post[]): Map<number, Post[]> {
  return groupByUserId(posts);
}

/**
 * Returns 0 for undefined or empty arrays, otherwise returns posts.length.
 */
export function postCountFor(posts: Post[] | undefined): number {
  if (!posts || posts.length === 0) return 0;
  return posts.length;
}

/**
 * Fetches all posts and returns the slice for a specific user.
 * Returns null on ApiError (graceful degrade), re-throws other errors.
 */
export async function fetchPostsForUser(userId: number): Promise<Post[] | null> {
  return withApiErrorFallback(async () => {
    const all = await fetchPosts();
    return groupPostsByUser(all).get(userId) ?? [];
  });
}
