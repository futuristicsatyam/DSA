
'use client';
// apps/web/src/app/cp/page.tsx

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCpSubjects, useCpTopic } from '@/hooks/use-content';
import { ContentSidebar } from '@/components/content-sidebar';
import { EditorialPanel } from '@/components/editorial-panel';

export default function CpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get('topic');

  const { data: subjects, isLoading: subjectsLoading } = useCpSubjects();
  const { data: topicData, isLoading: topicLoading } = useCpTopic(selectedSlug);

  const handleSelectTopic = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('topic', slug);
      router.push(`/cp?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Competitive Programming</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pattern-based notes and techniques for competitive programming.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        <div className="sticky top-20 h-[calc(100vh-6rem)] hidden md:flex flex-col">
          <ContentSidebar
            subjects={subjects}
            isLoading={subjectsLoading}
            selectedSlug={selectedSlug}
            onSelect={handleSelectTopic}
          />
        </div>

        <div className="md:hidden w-full">
          <details className="mb-4">
            <summary className="cursor-pointer font-medium text-sm border rounded-lg px-4 py-2 bg-background">
              Browse Topics ▾
            </summary>
            <div className="mt-2 border rounded-xl p-3">
              <ContentSidebar
                subjects={subjects}
                isLoading={subjectsLoading}
                selectedSlug={selectedSlug}
                onSelect={(slug) => {
                  handleSelectTopic(slug);
                  (document.querySelector('details') as HTMLDetailsElement).open = false;
                }}
              />
            </div>
          </details>
        </div>

        <main className="flex-1 min-w-0">
          <EditorialPanel
            topic={topicData?.topic}
            editorial={topicData?.editorial}
            isLoading={!!selectedSlug && topicLoading}
          />
        </main>
      </div>
    </div>
  );
}

