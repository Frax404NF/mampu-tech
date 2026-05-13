"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function UserDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[UserDetail] Error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="text-center py-8">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We couldn&apos;t load this user&apos;s profile. This is likely a
            temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
          >
            Try again
          </button>
          <Link
            href="/users"
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Back to Directory
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}