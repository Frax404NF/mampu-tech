"use client";
import { useMemo, useTransition, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { UserRow } from "@/types/user";
import type { UserActivity } from "@/lib/todos";
import { toWebsiteUrl } from "@/lib/todos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface UsersTableProps {
  rows: UserRow[];
  todosAvailable: boolean;
}

type SortOrder = "asc" | "desc";
type WorkloadFilter = "all" | "high" | "medium" | "low";

const VALID_WORKLOAD_VALUES: WorkloadFilter[] = ["all", "high", "medium", "low"];

function parseWorkloadParam(value: string | null): WorkloadFilter {
  if (value && (VALID_WORKLOAD_VALUES as string[]).includes(value)) {
    return value as WorkloadFilter;
  }
  return "all";
}

function applyWorkloadFilter(rows: UserRow[], workload: WorkloadFilter): UserRow[] {
  if (workload === "all") return rows;
  return rows.filter((row) => {
    if (row.activity === null) return true;
    const p = row.activity.pending;
    switch (workload) {
      case "high":   return p > 10;
      case "medium": return p > 5 && p <= 10;
      case "low":    return p <= 5;
      default:       return true;
    }
  });
}

function getFilteredSortedRows(
  rows: UserRow[],
  workload: WorkloadFilter,
  search: string,
  sort: SortOrder,
  pendingSort: SortOrder | null
) {
  // Pipeline: workloadFilter → qFilter → sort
  let filtered = applyWorkloadFilter(rows, workload);

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.user.name.toLowerCase().includes(q) ||
        r.user.email.toLowerCase().includes(q)
    );
  }

  if (pendingSort !== null) {
    return [...filtered].sort((a, b) => {
      const ap = a.activity?.pending ?? 0;
      const bp = b.activity?.pending ?? 0;
      return pendingSort === "desc" ? bp - ap : ap - bp;
    });
  }

  return [...filtered].sort((a, b) => {
    if (sort === "asc") return a.user.name.localeCompare(b.user.name);
    return b.user.name.localeCompare(a.user.name);
  });
}

function TodosProgressCell({ activity }: { activity: UserActivity | null }) {
  if (activity === null) {
    return <span className="text-gray-400">—</span>;
  }
  const { pending, completed, total } = activity;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="min-w-[120px]">
      <div className="text-xs text-gray-600 mb-1">
        <span className="font-medium text-amber-600">{pending} pending</span>
        <span className="text-gray-400 mx-1">·</span>
        <span className="text-green-600">{completed} done</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of todos completed`}
        />
      </div>
    </div>
  );
}

export default function UsersTable({ rows, todosAvailable }: UsersTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const sort = (searchParams.get("sort") as SortOrder) || "asc";
  const workload = parseWorkloadParam(searchParams.get("workload"));

  // pendingSort: "desc" = most pending first, "asc" = least pending first, null = name sort
  const pendingSortParam = searchParams.get("psort");
  const pendingSort: SortOrder | null =
    pendingSortParam === "asc" || pendingSortParam === "desc" ? pendingSortParam : null;

  const filteredRows = useMemo(
    () => getFilteredSortedRows(rows, workload, inputValue, sort, pendingSort),
    [rows, workload, inputValue, sort, pendingSort]
  );

  // Debounce q URL update to 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (currentQ !== inputValue) {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        if (inputValue) {
          params.set("q", inputValue);
        } else {
          params.delete("q");
        }
        startTransition(() => {
          router.replace(`?${params.toString()}`);
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, router, searchParams]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleSortToggle() {
    const newSort = sort === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sort", newSort);
    params.delete("psort"); // name sort takes over, clear workload sort
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  function handleWorkloadChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as WorkloadFilter;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (val === "all") {
      params.delete("workload");
    } else {
      params.set("workload", val);
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  function handlePendingSortToggle() {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (pendingSort === "desc") {
      params.set("psort", "asc");       // desc → asc
    } else if (pendingSort === "asc") {
      params.delete("psort");           // asc → off
    } else {
      params.set("psort", "desc");      // off → desc (most pending first)
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  function handleClearFilters() {
    setInputValue("");
    const params = new URLSearchParams();
    // Preserve sort direction; reset q, workload, and psort
    if (sort !== "asc") params.set("sort", sort);
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  const pendingSortIcon =
    pendingSort === "desc" ? "↓" : pendingSort === "asc" ? "↑" : "↕";
  const pendingSortLabel =
    pendingSort === "desc"
      ? "Most pending first"
      : pendingSort === "asc"
      ? "Least pending first"
      : "Sort by workload";

  return (
    <div>
      {/* Controls bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
            value={inputValue}
            onChange={handleSearch}
            aria-label="Search users"
          />
        </div>

        {/* Workload filter */}
        <div className="w-full sm:w-auto">
          <label htmlFor="workload-filter" className="sr-only">
            Filter by workload
          </label>
          <select
            id="workload-filter"
            value={workload}
            onChange={handleWorkloadChange}
            disabled={!todosAvailable}
            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">All workloads</option>
            <option value="high">High (&gt;10 pending)</option>
            <option value="medium">Medium (6–10 pending)</option>
            <option value="low">Low (≤5 pending)</option>
          </select>
        </div>

        {/* Workload sort button */}
        {todosAvailable && (
          <button
            onClick={handlePendingSortToggle}
            aria-label={pendingSortLabel}
            title={pendingSortLabel}
            className={`w-full sm:w-auto px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              pendingSort !== null
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Workload {pendingSortIcon}
          </button>
        )}
      </div>

      {filteredRows.length === 0 ? (
        <div className="mt-12 max-w-xl mx-auto">
          <Card className="text-center py-8">
            <CardHeader>
              <CardTitle>No Users Found</CardTitle>
              <CardDescription>
                We couldn&apos;t find anyone matching your current filters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                className="px-4 py-2 mt-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Mobile card list — visible below sm */}
          <ul className="sm:hidden divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {filteredRows.map((row) => (
              <li
                key={row.user.id}
                onClick={() => router.push(`/users/${row.user.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/users/${row.user.id}`);
                  }
                }}
                tabIndex={0}
                aria-label={`View profile for ${row.user.name}`}
                className="px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
              >
                <div className="font-medium text-gray-900">{row.user.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">{row.user.email}</div>
                <div className="text-sm mt-0.5">
                  <a
                    href={toWebsiteUrl(row.user.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {row.user.website}
                  </a>
                </div>
                <div className="mt-2">
                  <TodosProgressCell activity={row.activity} />
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table — visible at sm and above */}
          <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                      onClick={handleSortToggle}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        <span className="text-gray-400 group-hover:text-gray-600" aria-hidden="true">
                          {sort === "asc" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          )}
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Website</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Todos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.user.id}
                      onClick={() => router.push(`/users/${row.user.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/users/${row.user.id}`);
                        }
                      }}
                      tabIndex={0}
                      aria-label={`View profile for ${row.user.name}`}
                      className="hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{row.user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {row.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={toWebsiteUrl(row.user.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.user.website}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <TodosProgressCell activity={row.activity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
