"use client";
import { useState } from "react";
import type { Todo } from "@/types/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Props {
  todos: Todo[] | null;
}

/** Single icon component for both todo states — avoids duplicating the SVG base */
function TodoIcon({ completed }: { completed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 ${completed ? "text-green-500" : "text-amber-400"}`}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      {completed && <polyline points="9 11 12 14 22 4" />}
    </svg>
  );
}

function TodoRow({ todo }: { todo: Todo }) {
  return (
    <li
      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        todo.completed
          ? "hover:bg-green-50/50"
          : "hover:bg-amber-50/50"
      }`}
    >
      <span className="mt-0.5 flex-shrink-0">
        <TodoIcon completed={todo.completed} />
      </span>
      <span
        className={`text-sm leading-snug break-words ${
          todo.completed ? "line-through text-gray-400" : "text-gray-700"
        }`}
      >
        {todo.title}
      </span>
    </li>
  );
}

function GroupHeading({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "amber" | "green";
}) {
  const styles = {
    amber: "text-amber-700 bg-amber-50 border-amber-200",
    green: "text-green-700 bg-green-50 border-green-200",
  };
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`text-xs font-medium border px-1.5 py-0.5 rounded-full ${styles[color]}`}
      >
        {count}
      </span>
    </div>
  );
}

export default function UserTodosSection({ todos }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (todos === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Todos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-gray-400" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Todo data is currently unavailable.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (todos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Todos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="12" y2="13"/>
            </svg>
            <p className="text-sm text-gray-400">No todos yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Normal ─────────────────────────────────────────────────────────────────
  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);
  const total = todos.length;
  const pct = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  const showToggle = pending.length > 5 || completed.length > 0;
  const displayedPending = expanded ? pending : pending.slice(0, 5);
  // Label is context-aware: if only completed are hidden, say so explicitly
  const expandLabel =
    pending.length > 5 ? `Show all ${total} todos` : "Show completed";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Todos
          </CardTitle>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {total} total
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">

        {/* ── Progress summary block ── */}
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
          {/* Stat badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              {completed.length} done
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {pending.length} pending
            </span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400">Completion</span>
              <span className="text-xs font-semibold text-gray-600">{pct}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: pct === 100
                    ? "#22c55e"
                    : "linear-gradient(90deg, #22c55e, #86efac)",
                }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% of todos completed`}
              />
            </div>
          </div>
        </div>

        {/* ── Separator ── */}
        <hr className="border-gray-100" />

        {/* ── Pending list ── */}
        {displayedPending.length > 0 && (
          <div>
            <GroupHeading label="Pending" count={pending.length} color="amber" />
            <ul className="space-y-0.5">
              {displayedPending.map((todo) => (
                <TodoRow key={todo.id} todo={todo} />
              ))}
            </ul>
          </div>
        )}

        {/* ── Completed list (expanded only) ── */}
        {expanded && completed.length > 0 && (
          <div>
            <GroupHeading label="Completed" count={completed.length} color="green" />
            <ul className="space-y-0.5">
              {completed.map((todo) => (
                <TodoRow key={todo.id} todo={todo} />
              ))}
            </ul>
          </div>
        )}

        {/* ── Toggle ── */}
        {showToggle && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {expanded ? "Show fewer" : expandLabel}
          </button>
        )}

      </CardContent>
    </Card>
  );
}
