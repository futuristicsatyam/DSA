"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/api/client";

type UserRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
};

type UsersResponse = {
  items: UserRow[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiFetch<UsersResponse>("/api/v1/admin/users")
  });

  return (
    <AdminShell title="Manage Users">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !data ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                  <tr>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 dark:border-slate-900">
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email ?? "—"}</td>
                      <td className="py-3">{user.phone ?? "—"}</td>
                      <td className="py-3">{user.role}</td>
                      <td className="py-3">{user.emailVerified || user.phoneVerified ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-sm text-slate-500">Total users: {data.meta.total}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
