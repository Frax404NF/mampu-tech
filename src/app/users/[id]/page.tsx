import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchUser, ApiError } from "@/lib/api";
import { fetchTodosForUser } from "@/lib/todos";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Avatar, DetailRow, BackIcon } from "@/components/ui/UserDetail";
import UserTodosSection from "@/components/users/UserTodosSection";

function parseUserId(id: string): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// ─── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));
}

async function getUserOr404(id: number) {
  try {
    return await fetchUser(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseUserId(id);

  if (numericId === null) {
    return { title: "User Not Found" };
  }

  try {
    const user = await getUserOr404(numericId);
    return {
      title: user.name,
      description: `Profile, company, and address details for ${user.name} — ${user.email}`,
    };
  } catch {
    return { title: "User Not Found" };
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseUserId(id);

  if (numericId === null) notFound();

  const user = await getUserOr404(numericId);
  const { name, username, email, phone, website, company, address } = user;

  const todos = await fetchTodosForUser(numericId);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
      >
        <BackIcon />
        Back to Directory
      </Link>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar name={name} />
              <div>
                <CardTitle className="text-2xl">{name}</CardTitle>
                <CardDescription className="text-purple-600 font-medium">
                  @{username}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailRow label="Email">
              <a
                href={`mailto:${email}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {email}
              </a>
            </DetailRow>
            <DetailRow label="Phone">
              <span className="text-gray-700">{phone}</span>
            </DetailRow>
            <DetailRow label="Website">
              <a
                href={`https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {website}
              </a>
            </DetailRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-gray-900">{company.name}</p>
            <p className="text-sm text-gray-500 italic mt-1">
              &ldquo;{company.catchPhrase}&rdquo;
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {address.street}, {address.suite}
            </p>
            <p className="text-gray-700">
              {address.city}, {address.zipcode}
            </p>
          </CardContent>
        </Card>

        <UserTodosSection todos={todos} />
      </div>
    </div>
  );
}