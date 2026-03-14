"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

type Progress = {
  id: string;
  completed: boolean;
  progressPercent: number;
  topic: {
    title: string;
    subject: { name: string };
  };
};

export default function ProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => apiFetch<Progress[]>("/api/v1/user/progress")
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Progress" }]} />
      <div>
        <h1 className="text-4xl font-semibold">Progress</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">A quick view of what is done, what is in flight, and where to focus next.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{item.topic.subject.name}</p>
              <p className="mt-3 font-medium text-indigo-600">{item.progressPercent}% complete</p>
              <p className="mt-1 text-sm">{item.completed ? "Completed" : "In progress"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
