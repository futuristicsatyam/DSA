"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton } from "@repo/ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/api/client";
import { toast } from "sonner";

type Subject = {
  id: string;
  name: string;
  description: string;
  categoryType: string;
};

type FormValues = {
  name: string;
  description: string;
  categoryType: "DSA" | "CP" | "GATE";
};

export default function AdminSubjectsPage() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["subjects-admin"],
    queryFn: () => apiFetch<Subject[]>("/api/v1/content/dsa/subjects").then((dsa) =>
      Promise.all([
        Promise.resolve(dsa),
        apiFetch<Subject[]>("/api/v1/content/cp/subjects"),
        apiFetch<Subject[]>("/api/v1/content/gate/subjects")
      ]).then(([a, b, c]) => [...a, ...b, ...c])
    )
  });

  const form = useForm<FormValues>({
    defaultValues: { name: "", description: "", categoryType: "DSA" }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch("/api/v1/admin/subjects", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: () => {
      toast.success("Subject created");
      form.reset();
      refetch();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to create subject")
  });

  return (
    <AdminShell title="Manage Subjects">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create subject</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <Input placeholder="Subject name" {...form.register("name")} />
              <Input placeholder="Description" {...form.register("description")} />
              <select className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950" {...form.register("categoryType")}>
                <option value="DSA">DSA</option>
                <option value="CP">CP</option>
                <option value="GATE">GATE</option>
              </select>
              <Button className="w-full" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Create Subject"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing subjects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading || !data ? (
              <Skeleton className="h-40" />
            ) : (
              data.map((subject) => (
                <div key={subject.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-medium">{subject.name}</p>
                  <p className="text-sm text-slate-500">{subject.description}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-indigo-600">{subject.categoryType}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
