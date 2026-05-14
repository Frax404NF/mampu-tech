import { UserDetailSkeleton } from '@/components/users/UserDetailSkeleton'

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
      <UserDetailSkeleton />
    </div>
  )
}
