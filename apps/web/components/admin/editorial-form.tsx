"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea
} from "@repo/ui";

export type EditorialFormValues = {
  topicId: string;
  title: string;
  slug: string;
  summary: string;
  markdownContent: string;
  tags: string;
  estimatedMinutes: string;
  published: boolean;
};

type TopicOption = {
  id: string;
  title: string;
  subject: {
    name: string;
    categoryType: string;
  };
};

type EditorialFormProps = {
  defaultValues?: Partial<EditorialFormValues>;
  topics: TopicOption[];
  onSubmit: (values: EditorialFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function EditorialForm({
  defaultValues,
  topics,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Editorial"
}: EditorialFormProps) {
  const form = useForm<EditorialFormValues>({
    defaultValues: {
      topicId: defaultValues?.topicId ?? "",
      title: defaultValues?.title ?? "",
      slug: defaultValues?.slug ?? "",
      summary: defaultValues?.summary ?? "",
      markdownContent: defaultValues?.markdownContent ?? "",
      tags: defaultValues?.tags ?? "",
      estimatedMinutes: defaultValues?.estimatedMinutes ?? "",
      published: defaultValues?.published ?? false
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editorial details</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <select
              {...form.register("topicId")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="">Select topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.subject.categoryType} / {topic.subject.name} / {topic.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input {...form.register("title")} placeholder="Editorial title" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input {...form.register("slug")} placeholder="editorial-slug" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Summary</label>
            <Textarea
              {...form.register("summary")}
              rows={3}
              placeholder="Short summary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Markdown Content</label>
            <Textarea
              {...form.register("markdownContent")}
              rows={14}
              placeholder="# Editorial content"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input {...form.register("tags")} placeholder="array,prefix-sum,math" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated Minutes</label>
              <Input {...form.register("estimatedMinutes")} placeholder="10" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...form.register("published")} />
            Publish immediately
          </label>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
