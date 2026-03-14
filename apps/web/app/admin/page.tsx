"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { AdminShell } from "@/components/admin/admin-shell";

type Stats = {
  users: number;
  topics: number;
  editorials: number;
  bookmarks: number;
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<Stats>("/api/v1/admin/stats")
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[320px]" />;
  }

  return (
    <AdminShell title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Users", data.users],
          ["Topics", data.topics],
          ["Editorials", data.editorials],
          ["Bookmarks", data.bookmarks]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
