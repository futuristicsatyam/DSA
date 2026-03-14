"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

type Bookmark = {
  id: string;
  type: string;
  topic?: { title: string; shortDescription: string } | null;
  editorial?: { title: string; summary: string } | null;
};

export default function BookmarksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => apiFetch<Bookmark[]>("/api/v1/user/bookmarks")
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[420px]" />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Bookmarks" }]} />
      <div>
        <h1 className="text-4xl font-semibold">Bookmarks</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Your saved topics, editorials, and future problem references.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.topic?.title ?? item.editorial?.title ?? "Saved item"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{item.topic?.shortDescription ?? item.editorial?.summary}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-indigo-600">{item.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
