import type { Todo } from "@/types/todo";
import { fetchTodos, ApiError } from "@/lib/api";

export interface UserActivity {
  completed: number;
  pending: number;
  total: number;
}

/**
 * Groups a flat todos array into a Map keyed by userId.
 * Every todo appears in exactly one bucket (the one matching its userId).
 */
export function groupTodosByUser(todos: Todo[]): Map<number, Todo[]> {
  const map = new Map<number, Todo[]>();
  for (const todo of todos) {
    const bucket = map.get(todo.userId);
    if (bucket) {
      bucket.push(todo);
    } else {
      map.set(todo.userId, [todo]);
    }
  }
  return map;
}

/**
 * Computes completed / pending / total counts for a slice of todos.
 * Both `activityFor(undefined)` and `activityFor([])` return `{ 0, 0, 0 }`.
 */
export function activityFor(todos: Todo[] | undefined): UserActivity {
  if (!todos || todos.length === 0) {
    return { completed: 0, pending: 0, total: 0 };
  }
  let completed = 0;
  let pending = 0;
  for (const todo of todos) {
    if (todo.completed) {
      completed++;
    } else {
      pending++;
    }
  }
  return { completed, pending, total: completed + pending };
}

/**
 * Fetches all todos and returns the slice for a specific user.
 * Returns null on ApiError (graceful degrade), re-throws other errors.
 * Returns [] when the user has no todos.
 */
export async function fetchTodosForUser(userId: number): Promise<Todo[] | null> {
  try {
    const all = await fetchTodos();
    return groupTodosByUser(all).get(userId) ?? [];
  } catch (err) {
    if (err instanceof ApiError) return null;
    throw err;
  }
}

/**
 * Normalises a bare hostname to an https:// URL.
 * Leaves values that already start with http(s):// unchanged.
 */
export function toWebsiteUrl(website: string): string {
  return website.startsWith("http") ? website : `https://${website}`;
}
