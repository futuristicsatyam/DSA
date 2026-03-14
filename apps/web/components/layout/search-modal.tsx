"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button, Card, Input } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { toast } from "sonner";

type SearchResponse = {
  subjects: Array<{ id: string; name: string; slug: string; categoryType: string }>;
  topics: Array<{ id: string; title: string; slug: string; categoryType: string }>;
  editorials: Array<{ id: string; title: string; slug: string; tags: string[] }>;
};

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>({ subjects: [], topics: [], editorials: [] });
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recent-searches");
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ subjects: [], topics: [], editorials: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await apiFetch<SearchResponse>(`/api/v1/content/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Search failed");
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = useMemo(
    () => results.subjects.length || results.topics.length || results.editorials.length,
    [results]
  );

  function rememberSearch(value: string) {
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 6);
    localStorage.setItem("recent-searches", JSON.stringify(next));
    setRecent(next);
  }

  return (
    <>
      <Button variant="outline" className="hidden md:flex" onClick={() => setOpen(true)}>
        <Search className="mr-2 size-4" />
        Search
      </Button>
      <Button variant="ghost" className="md:hidden" onClick={() => setOpen(true)} aria-label="Search">
        <Search className="size-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur">
          <div className="mx-auto mt-16 max-w-3xl">
            <Card className="overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
                <Search className="size-4 text-slate-500" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search topics, editorials, tags..."
                  className="border-0 px-0 focus:ring-0"
                />
                <button onClick={() => setOpen(false)} aria-label="Close search">
                  <X className="size-4 text-slate-500" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-4">
                {!query && recent.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-500">Recent searches</p>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((item) => (
                        <button
                          key={item}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
                          onClick={() => setQuery(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query && !hasResults && <p className="text-sm text-slate-500">No results found.</p>}

                {results.subjects.length > 0 && (
                  <section className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-slate-500">Subjects</h3>
                    <div className="space-y-2">
                      {results.subjects.map((subject) => (
                        <Link
                          key={subject.id}
                          href={`/${subject.categoryType.toLowerCase()}`}
                          onClick={() => {
                            rememberSearch(query);
                            setOpen(false);
                          }}
                          className="block rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                        >
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-slate-500">{subject.categoryType}</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {results.topics.length > 0 && (
                  <section className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-slate-500">Topics</h3>
                    <div className="space-y-2">
                      {results.topics.map((topic) => (
                        <Link
                          key={topic.id}
                          href={`/${topic.categoryType.toLowerCase()}`}
                          onClick={() => {
                            rememberSearch(query);
                            setOpen(false);
                          }}
                          className="block rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                        >
                          {topic.title}
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {results.editorials.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-semibold text-slate-500">Editorials</h3>
                    <div className="space-y-2">
                      {results.editorials.map((editorial) => (
                        <Link
                          key={editorial.id}
                          href={`/editorials/${editorial.slug}`}
                          onClick={() => {
                            rememberSearch(query);
                            setOpen(false);
                          }}
                          className="block rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                        >
                          <p className="font-medium">{editorial.title}</p>
                          <p className="text-sm text-slate-500">{editorial.tags.join(", ")}</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
