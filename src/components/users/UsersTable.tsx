"use client";
import { useMemo, useTransition, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface UsersTableProps {
  users: User[];
}

type SortOrder = "asc" | "desc";

function getFilteredSortedUsers(users: User[], search: string, sort: SortOrder) {
  let filtered = users;
  if (search) {
    const q = search.toLowerCase();
    filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "asc") return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });
  return sorted;
}

export default function UsersTable({ users }: UsersTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const sort = (searchParams.get("sort") as SortOrder) || "asc";

  const filteredUsers = useMemo(
    () => getFilteredSortedUsers(users, inputValue, sort),
    [users, inputValue, sort]
  );

  // Debounce the URL update to prevent excessive server requests
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
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [inputValue, router, searchParams]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleSortToggle() {
    const newSort = sort === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sort", newSort);
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  function handleClearFilters() {
    setInputValue("");
    startTransition(() => {
      router.replace("/users");
    });
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
      </div>

      {filteredUsers.length === 0 ? (
        <div className="mt-12 max-w-xl mx-auto">
          <Card className="text-center py-8">
            <CardHeader>
              <CardTitle>No Users Found</CardTitle>
              <CardDescription>
                We couldn't find anyone matching your search criteria.
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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
                      <span className="text-gray-400 group-hover:text-gray-600">
                        {sort === "asc" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        )}
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold hidden sm:table-cell">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Website
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => router.push(`/users/${user.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/users/${user.id}`);
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`View profile for ${user.name}`}
                      className="hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
                    >
                      
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 sm:hidden mt-1">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`http://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {user.website}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
