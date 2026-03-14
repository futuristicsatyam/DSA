"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Skeleton } from "@repo/ui";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Toc } from "@/components/markdown/toc";
import { extractHeadings } from "@/lib/markdown";
import { toast } from "sonner";

type Editorial = {
  id: string;
  title: string;
  summary: string;
  markdownContent: string;
  tags: string[];
  estimatedMinutes?: number | null;
  topic: {
    title: string;
    subject: {
      categoryType: string;
    };
  };
};

export default function EditorialPage() {
  const params = useParams<{ slug: string }>();
  const [editorial, setEditorial] = useState<Editorial | null>(null);

  useEffect(() => {
    apiFetch<Editorial>(`/api/v1/content/editorials/${params.slug}`)
      .then(setEditorial)
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load editorial"));
  }, [params.slug]);

  const headings = useMemo(() => extractHeadings(editorial?.markdownContent ?? ""), [editorial?.markdownContent]);

  if (!editorial) {
    return <Skeleton className="h-[520px]" />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/${editorial.topic.subject.categoryType.toLowerCase()}`, label: editorial.topic.subject.categoryType },
          { label: editorial.title }
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editorial.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <CardTitle>{editorial.title}</CardTitle>
            <p className="text-slate-500">{editorial.summary}</p>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer content={editorial.markdownContent} />
          </CardContent>
        </Card>

        <Toc items={headings} />
      </div>
    </div>
  );
}
