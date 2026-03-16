"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton
} from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { AdminShell } from "@/components/admin/admin-shell";

type EditorialItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  published: boolean;
  updatedAt: string;
  topic: {
    title: string;
    subject: {
      name: string;
      categoryType: string;
    };
  };
};

export default function AdminEditorialsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-editorials"],
    queryFn: () => apiFetch<EditorialItem[]>("/api/v1/admin/editorials")
  });

  if (isLoading) {
    return <Skeleton className="h-[500px]" />;
  }

  return (
    <AdminShell title="Editorials">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold">Editorials</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Manage editorial drafts and published content.
            </p>
          </div>

          <Link href="/admin/editorials/new">
            <Button>Create Editorial</Button>
          </Link>
        </div>

        {isError || !data ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load editorials.
          </div>
        ) : (
          <div className="grid gap-4">
            {data.length ? (
              data.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                      <span>{item.title}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          item.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-500">
                      {item.topic.subject.categoryType} / {item.topic.subject.name} /{" "}
                      {item.topic.title}
                    </p>

                    <p>{item.summary}</p>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/admin/editorials/${item.id}/edit`}
                        className="text-sm font-medium text-indigo-600"
                      >
                        Edit
                      </Link>

                      <span className="text-sm text-slate-400">
                        Slug: {item.slug}
                      </span>

                      <span className="text-sm text-slate-400">
                        Updated: {new Date(item.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-slate-500">
                  No editorials found.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
