"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

type ProfileData = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role: string;
    createdAt: string;
  };
};

export default function ProfilePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch<ProfileData>("/api/v1/auth/me")
  });

  if (isLoading) {
    return <Skeleton className="h-[420px]" />;
  }

  if (isError || !data?.user) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load profile.
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { label: "Profile" }
        ]}
      />

      <div>
        <h1 className="text-4xl font-semibold">Profile V3</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          View your account details and verification status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Full name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-slate-500">
              {user.emailVerified ? "Verified" : "Not verified"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="font-medium">{user.phone}</p>
            <p className="text-sm text-slate-500">
              {user.phoneVerified ? "Verified" : "Not verified"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Joined</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">User ID</p>
            <p className="font-medium break-all">{user.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
