import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function UserNotFound() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="text-center py-8">
        <CardHeader>
          <p className="text-5xl font-bold text-gray-800 mb-2">404</p>
          <CardTitle>User not found</CardTitle>
          <CardDescription>
            There&apos;s no user with that ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/users"
            className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
          >
            Back to directory
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}