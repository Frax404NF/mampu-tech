import { UserDetailSkeleton } from "@/components/users/UserDetailSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <UserDetailSkeleton />
    </div>
  );
}