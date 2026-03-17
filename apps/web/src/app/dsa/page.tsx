
'use client';
// apps/web/src/app/dsa/page.tsx

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDsaSubjects, useDsaTopic } from '@/hooks/use-content';
import { ContentSidebar } from '@/components/content-sidebar';
import { EditorialPanel } from '@/components/editorial-panel';

// Data Structures subjects (slugs must match what your API/seed returns)
const DATA_STRUCTURE_SLUGS = [
  'arrays', 'strings', 'linked-list', 'stack', 'queue',
  'deque', 'tree', 'bst', 'heap', 'graph', 'hashing', 'trie',
  'segment-tree', 'disjoint-set-union',
];

const ALGORITHM_SLUGS = [
  'sorting', 'searching', 'recursion', 'backtracking', 'greedy',
  'dynamic-programming', 'divide-and-conquer', 'graph-algorithms',
  'sliding-window', 'two-pointers', 'binary-search', 'bit-manipulation',
];

const DSA_TABS = [
  { label: 'Data Structures', subjectSlugs: DATA_STRUCTURE_SLUGS },
  { label: 'Algorithms', subjectSlugs: ALGORITHM_SLUGS },
];

export default function DsaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get('topic');

  const { data: subjects, isLoading: subjectsLoading } = useDsaSubjects();
  const { data: topicData, isLoading: topicLoading } = useDsaTopic(selectedSlug);

  const handleSelectTopic = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('topic', slug);
      router.push(`/dsa?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Data Structures & Algorithms</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Master every DS and algorithm concept with structured editorials and examples.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <div className="sticky top-20 h-[calc(100vh-6rem)] flex flex-col hidden md:flex">
          <ContentSidebar
            subjects={subjects}
            isLoading={subjectsLoading}
            selectedSlug={selectedSlug}
            onSelect={handleSelectTopic}
            tabs={DSA_TABS}
          />
        </div>

        {/* Mobile sidebar — collapsible (simplified, full drawer TBD) */}
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
                  // close details
                  (document.querySelector('details') as HTMLDetailsElement).open = false;
                }}
                tabs={DSA_TABS}
              />
            </div>
          </details>
        </div>

        {/* Editorial panel */}
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

