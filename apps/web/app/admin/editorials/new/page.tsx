"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  EditorialForm,
  EditorialFormValues
} from "@/components/admin/editorial-form";

type TopicOption = {
  id: string;
  title: string;
  subject: {
    name: string;
    categoryType: string;
  };
};

type SubjectResponse = {
  id: string;
  name: string;
  slug: string;
  topics: TopicOption[];
  children?: Array<{
    id: string;
    name: string;
    slug: string;
    topics: TopicOption[];
  }>;
};

export default function NewEditorialPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-topics-for-editorial"],
    queryFn: async () => {
      const dsa = await apiFetch<SubjectResponse[]>("/api/v1/content/dsa/subjects");
      const cp = await apiFetch<SubjectResponse[]>("/api/v1/content/cp/subjects");
      const gate = await apiFetch<SubjectResponse[]>("/api/v1/content/gate/subjects");

      const flattenTopics = (subjects: SubjectResponse[]) =>
        subjects.flatMap((subject) => [
          ...subject.topics,
          ...(subject.children?.flatMap((child) => child.topics) ?? [])
        ]);

      return [...flattenTopics(dsa), ...flattenTopics(cp), ...flattenTopics(gate)];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (values: EditorialFormValues) => {
      return apiFetch("/api/v1/admin/editorials", {
        method: "POST",
        body: JSON.stringify({
          topicId: values.topicId,
          title: values.title,
          slug: values.slug,
          summary: values.summary,
          markdownContent: values.markdownContent,
          tags: values.tags
            ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
            : [],
          estimatedMinutes: values.estimatedMinutes
            ? Number(values.estimatedMinutes)
            : undefined,
          published: values.published
        })
      });
    },
    onSuccess: () => {
      toast.success("Editorial created successfully");
      window.location.href = "/admin/editorials";
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create editorial"
      );
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[600px]" />;
  }

  return (
    <AdminShell title="New Editorial">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold">New Editorial</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Create a new editorial and publish it when ready.
          </p>
        </div>

        {isError || !data ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load topics.
          </div>
        ) : (
          <EditorialForm
            topics={data}
            onSubmit={async (values) => {
              await createMutation.mutateAsync(values);
            }}
            isSubmitting={createMutation.isPending}
            submitLabel="Create Editorial"
          />
        )}
      </div>
    </AdminShell>
  );
}
