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
    shortDescription: string;
    difficulty?: string | null;
  }>;
  children?: Array<{
    id: string;
    name: string;
    topics: Array<{
      id: string;
      title: string;
      shortDescription: string;
      difficulty?: string | null;
    }>;
  }>;
};

type FormValues = {
  subjectId: string;
  title: string;
  shortDescription: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  orderIndex: number;
};

export default function AdminTopicsPage() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-topic-subjects"],
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
      subjectId: "",
      title: "",
      shortDescription: "",
      difficulty: "BEGINNER",
      orderIndex: 1
    }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch("/api/v1/admin/topics", {
        method: "POST",
        body: JSON.stringify({ ...values, orderIndex: Number(values.orderIndex) })
      }),
    onSuccess: () => {
      toast.success("Topic created");
      form.reset();
      refetch();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to create topic")
  });

  const flattenedSubjects = (data ?? []).flatMap((subject) => [
    { id: subject.id, name: subject.name },
    ...((subject.children ?? []).map((child) => ({ id: child.id, name: `${subject.name} / ${child.name}` })))
  ]);

  const topics = (data ?? []).flatMap((subject) => [
    ...subject.topics.map((topic) => ({ ...topic, subjectName: subject.name })),
    ...((subject.children ?? []).flatMap((child) =>
      child.topics.map((topic) => ({
        ...topic,
        subjectName: `${subject.name} / ${child.name}`
      }))
    ))
  ]);

  return (
    <AdminShell title="Manage Topics">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create topic</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <select className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950" {...form.register("subjectId")}>
                <option value="">Select subject</option>
                {flattenedSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <Input placeholder="Topic title" {...form.register("title")} />
              <Input placeholder="Short description" {...form.register("shortDescription")} />
              <select className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950" {...form.register("difficulty")}>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
              <Input type="number" placeholder="Order index" {...form.register("orderIndex", { valueAsNumber: true })} />
              <Button className="w-full" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Create Topic"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              topics.map((topic) => (
                <div key={topic.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-medium">{topic.title}</p>
                  <p className="text-sm text-slate-500">{topic.shortDescription}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-indigo-600">
                    {topic.subjectName} • {topic.difficulty ?? "UNSPECIFIED"}
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
