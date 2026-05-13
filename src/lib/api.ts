import type { User } from "@/types/user";

const BASE_URL = "https://jsonplaceholder.typicode.com";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export function fetchUsers() {
  return apiFetch<User[]>("/users", { next: { revalidate: 60 } });
}

export function fetchUser(id: number) {
  return apiFetch<User>(`/users/${id}`, { next: { revalidate: 60 } });
}


export { ApiError };

