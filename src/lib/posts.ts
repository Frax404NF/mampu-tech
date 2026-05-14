import type { Post } from "@/types/post";
import { fetchPosts, ApiError } from "@/lib/api";

/**
 * Groups a flat posts array into a Map keyed by userId.
 * Every post appears in exactly one bucket (the one matching its userId).
 */
export function groupPostsByUser(posts: Post[]): Map<number, Post[]> {
  const map = new Map<number, Post[]>();
  for (const post of posts) {
    const bucket = map.get(post.userId);
    if (bucket) {
      bucket.push(post);
    } else {
      map.set(post.userId, [post]);
    }
  }
  return map;
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
 * Returns [] when the user has no posts.
 */
export async function fetchPostsForUser(userId: number): Promise<Post[] | null> {
  try {
    const all = await fetchPosts();
    return groupPostsByUser(all).get(userId) ?? [];
  } catch (err) {
    if (err instanceof ApiError) return null;
    throw err;
  }
}
