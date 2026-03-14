"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

type Profile = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
};

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch<Profile>("/api/v1/user/profile")
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[320px]" />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Profile" }]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Email: {data.email ?? "—"} {data.emailVerified ? "• verified" : "• pending"}</p>
          <p>Phone: {data.phone ?? "—"} {data.phoneVerified ? "• verified" : "• pending"}</p>
          <p>Role: {data.role}</p>
          <p>Joined: {new Date(data.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
