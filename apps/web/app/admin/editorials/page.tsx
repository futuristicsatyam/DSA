"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton } from "@repo/ui";
import { toast } from "sonner";

type Subject = {
  id: string;
  name: string;
  topics: Array<{
    id: string;
    title: string;
    editorials: Array<{
      id: string;
      title: string;
      summary: string;
    }>;
  }>;
  children?: Array<{
    id: string;
    name: string;
    topics: Array<{
      id: string;
      title: string;
      editorials: Array<{
        id: string;
        title: string;
        summary: string;
      }>;
    }>;
  }>;
};

type FormValues = {
  topicId: string;
  title: string;
  summary: string;
  markdownContent: string;
  tags: string;
  estimatedMinutes: number;
  published: "true" | "false";
};

export default function AdminEditorialsPage() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-editorial-subjects"],
    queryFn: async () => {
      const [dsa, cp, gate] = await Promise.all([
        apiFetch<Subject[]>("/api/v1/content/dsa/subjects"),
        apiFetch<Subject[]>("/api/v1/content/cp/subjects"),
        apiFetch<Subject[]>("/api/v1/content/gate/subjects")
      ]);
      return [...dsa, ...cp, ...gate];
    }
  });

  const form = useForm<FormValues>({
    defaultValues: {
      topicId: "",
      title: "",
      summary: "",
      markdownContent: "# Editorial\n\nStart writing here...",
      tags: "arrays,prefix-sum",
      estimatedMinutes: 15,
      published: "true"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch("/api/v1/admin/editorials", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          estimatedMinutes: Number(values.estimatedMinutes),
          published: values.published === "true"
        })
      }),
    onSuccess: () => {
      toast.success("Editorial created");
      form.reset();
      refetch();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to create editorial")
  });

  const topics = (data ?? []).flatMap((subject) => [
    ...subject.topics.map((topic) => ({ ...topic, subjectName: subject.name })),
    ...((subject.children ?? []).flatMap((child) =>
      child.topics.map((topic) => ({
        ...topic,
        subjectName: `${subject.name} / ${child.name}`
      }))
    ))
  ]);

  const existingEditorials = topics.flatMap((topic) =>
    topic.editorials.map((editorial) => ({
      ...editorial,
      topicTitle: topic.title,
      subjectName: topic.subjectName
    }))
  );

  return (
    <AdminShell title="Manage Editorials">
      <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create editorial</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <select className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950" {...form.register("topicId")}>
                <option value="">Select topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.subjectName} / {topic.title}</option>
                ))}
              </select>
              <Input placeholder="Editorial title" {...form.register("title")} />
              <Input placeholder="Summary" {...form.register("summary")} />
              <Input placeholder="Tags comma separated" {...form.register("tags")} />
              <Input type="number" placeholder="Estimated minutes" {...form.register("estimatedMinutes", { valueAsNumber: true })} />
              <select className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950" {...form.register("published")}>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
              <textarea
                className="min-h-52 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                {...form.register("markdownContent")}
              />
              <Button className="w-full" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Create Editorial"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published editorials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              existingEditorials.map((editorial) => (
                <div key={editorial.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-medium">{editorial.title}</p>
                  <p className="text-sm text-slate-500">{editorial.summary}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-indigo-600">
                    {editorial.subjectName} • {editorial.topicTitle}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
