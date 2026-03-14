"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Toc } from "@/components/markdown/toc";
import { extractHeadings } from "@/lib/markdown";
import { toast } from "sonner";

type Editorial = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdownContent: string;
  tags: string[];
  estimatedMinutes?: number | null;
};

type Topic = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  difficulty?: string | null;
  editorials: Editorial[];
};

type Subject = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryType: string;
  children?: Array<{
    id: string;
    name: string;
    topics: Topic[];
  }>;
  topics: Topic[];
};

const copy = {
  DSA: {
    title: "Data Structures & Algorithms",
    subtitle: "Structured editorial-first learning for interview prep and fundamentals."
  },
  CP: {
    title: "Competitive Programming",
    subtitle: "Contest-oriented patterns, heuristics, and sample problems."
  },
  GATE: {
    title: "GATE CSE",
    subtitle: "Subject-wise notes, expandable modules, and exam-focused theory."
  }
};

export function LearningShell({ category }: { category: "DSA" | "CP" | "GATE" }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedEditorial, setSelectedEditorial] = useState<Editorial | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = category.toLowerCase();
    apiFetch<Subject[]>(`/api/v1/content/${endpoint}/subjects`)
      .then((data) => {
        setSubjects(data);

        const firstTopic =
          data.flatMap((subject) => [
            ...(subject.topics ?? []),
            ...((subject.children ?? []).flatMap((child) => child.topics ?? []))
          ])[0];
        const firstEditorial = firstTopic?.editorials?.[0] ?? null;
        setSelectedTopic(firstTopic ?? null);
        setSelectedEditorial(firstEditorial);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load content");
      })
      .finally(() => setLoading(false));
  }, [category]);

  const headings = useMemo(
    () => extractHeadings(selectedEditorial?.markdownContent ?? ""),
    [selectedEditorial?.markdownContent]
  );

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_260px]">
        <Skeleton className="h-[560px]" />
        <Skeleton className="h-[560px]" />
        <Skeleton className="h-[560px]" />
      </div>
    );
  }

  const title = copy[category];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: title.title }]} />
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">{title.title}</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{title.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr_260px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {subjects.map((subject) => (
              <div key={subject.id}>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{subject.name}</h3>
                <div className="space-y-1">
                  {subject.topics.map((topic) => (
                    <button
                      key={topic.id}
                      className={`w-full rounded-2xl px-3 py-2 text-left text-sm transition ${
                        selectedTopic?.id === topic.id
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          : "hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setSelectedEditorial(topic.editorials?.[0] ?? null);
                      }}
                    >
                      {topic.title}
                    </button>
                  ))}
                  {subject.children?.map((child) => (
                    <div key={child.id} className="pt-2">
                      <p className="mb-1 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-900">
                        {child.name}
                      </p>
                      <div className="space-y-1">
                        {child.topics.map((topic) => (
                          <button
                            key={topic.id}
                            className={`w-full rounded-2xl px-3 py-2 text-left text-sm transition ${
                              selectedTopic?.id === topic.id
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                                : "hover:bg-slate-100 dark:hover:bg-slate-900"
                            }`}
                            onClick={() => {
                              setSelectedTopic(topic);
                              setSelectedEditorial(topic.editorials?.[0] ?? null);
                            }}
                          >
                            {topic.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {selectedTopic?.difficulty ? <Badge>{selectedTopic.difficulty}</Badge> : null}
              {selectedEditorial?.estimatedMinutes ? <Badge>{selectedEditorial.estimatedMinutes} min read</Badge> : null}
            </div>
            <CardTitle>{selectedEditorial?.title ?? selectedTopic?.title ?? "Select a topic"}</CardTitle>
            <p className="text-sm text-slate-500">{selectedEditorial?.summary ?? selectedTopic?.shortDescription}</p>
          </CardHeader>
          <CardContent>
            {selectedEditorial ? (
              <MarkdownRenderer content={selectedEditorial.markdownContent} />
            ) : (
              <p className="text-sm text-slate-500">This topic does not have a published editorial yet.</p>
            )}
          </CardContent>
        </Card>

        <Toc items={headings} />
      </div>
    </div>
  );
}
