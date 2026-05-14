import type { Todo } from "@/types/todo";
import type { UserActivity } from "@/types/activity";
import { fetchTodos } from "@/lib/api";
import { groupByUserId, withApiErrorFallback } from "@/lib/utils";

// Re-export so existing consumers don't break
export type { UserActivity } from "@/types/activity";
export { toWebsiteUrl } from "@/lib/utils";

/**
 * Groups a flat todos array into a Map keyed by userId.
 */
export function groupTodosByUser(todos: Todo[]): Map<number, Todo[]> {
  return groupByUserId(todos);
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
 */
export async function fetchTodosForUser(userId: number): Promise<Todo[] | null> {
  return withApiErrorFallback(async () => {
    const all = await fetchTodos();
    return groupTodosByUser(all).get(userId) ?? [];
  });
}
