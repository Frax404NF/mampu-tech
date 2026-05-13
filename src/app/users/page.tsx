import { Suspense } from "react";
import { fetchUsers } from "@/lib/api";
import UsersTable from "@/components/users/UsersTable";
import UserTableSkeleton from "@/components/users/UserTableSkeleton";

async function UsersDataFetcher() {
  // throw new Error("Simulated API error states.");
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const users = await fetchUsers();
  return <UsersTable users={users} />;
}

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tech Team Directory</h1>
        <p className="mt-2 text-gray-500">Manage and view all users of your organization.</p>
      </div>

      <Suspense fallback={<UserTableSkeleton />}>
        <UsersDataFetcher />
      </Suspense>
    </div>
  );
}
