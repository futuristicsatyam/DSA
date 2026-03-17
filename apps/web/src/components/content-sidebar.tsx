
'use client';
// apps/web/src/components/content-sidebar.tsx

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Circle, CheckCircle2, BookOpen } from 'lucide-react';
import { Subject, Topic, Difficulty } from '@/lib/content-api';
import { Skeleton } from '@/components/ui/skeleton';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  MEDIUM: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  HARD: 'text-red-500 bg-red-50 dark:bg-red-900/20',
};

interface ContentSidebarProps {
  subjects: Subject[] | undefined;
  isLoading: boolean;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  // Optional: completed topic IDs for progress display
  completedTopicIds?: Set<string>;
  // Optional tabs for DSA (Data Structures / Algorithms split)
  tabs?: { label: string; subjectSlugs: string[] }[];
}

function TopicItem({
  topic,
  isSelected,
  isCompleted,
  onClick,
}: {
  topic: Topic;
  isSelected: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all group',
        isSelected
          ? 'bg-indigo-600 text-white font-medium shadow-sm'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      <span className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className={cn('w-3.5 h-3.5', isSelected ? 'text-indigo-200' : 'text-green-500')} />
        ) : (
          <Circle className={cn('w-3.5 h-3.5', isSelected ? 'text-indigo-200' : 'text-muted-foreground')} />
        )}
      </span>
      <span className="flex-1 leading-snug">{topic.title}</span>
      {topic.difficulty && !isSelected && (
        <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0', DIFFICULTY_COLORS[topic.difficulty])}>
          {topic.difficulty[0]}
        </span>
      )}
    </button>
  );
}

function SubjectGroup({
  subject,
  selectedSlug,
  completedTopicIds = new Set(),
  onSelect,
  defaultOpen = false,
}: {
  subject: Subject;
  selectedSlug: string | null;
  completedTopicIds?: Set<string>;
  onSelect: (slug: string) => void;
  defaultOpen?: boolean;
}) {
  const hasSelected = subject.topics.some((t) => t.slug === selectedSlug);
  const [open, setOpen] = useState(defaultOpen || hasSelected);

  const completedCount = subject.topics.filter((t) => completedTopicIds.has(t.id)).length;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm font-semibold hover:bg-accent transition-colors group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="truncate text-left">{subject.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {completedCount > 0 && (
            <span className="text-xs text-green-600 font-medium">
              {completedCount}/{subject.topics.length}
            </span>
          )}
          {open ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {open && (
        <div className="mt-1 ml-1 pl-3 border-l border-border space-y-0.5">
          {subject.topics.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-1.5 italic">No topics yet</p>
          ) : (
            subject.topics
              .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999))
              .map((topic) => (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  isSelected={topic.slug === selectedSlug}
                  isCompleted={completedTopicIds.has(topic.id)}
                  onClick={() => onSelect(topic.slug)}
                />
              ))
          )}
        </div>
      )}
    </div>
  );
}

export function ContentSidebar({
  subjects,
  isLoading,
  selectedSlug,
  onSelect,
  completedTopicIds,
  tabs,
}: ContentSidebarProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Filter subjects by active tab if tabs are defined
  const visibleSubjects = tabs
    ? subjects?.filter((s) => tabs[activeTab].subjectSlugs.includes(s.slug))
    : subjects;

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col">
      {/* Tabs */}
      {tabs && (
        <div className="flex rounded-lg bg-muted p-1 mb-4">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={cn(
                'flex-1 text-xs font-medium py-1.5 rounded-md transition-colors',
                activeTab === i
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Subject list */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-8 w-full rounded-lg" />
              {i < 2 && (
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-7 w-[90%] rounded-md" />
                  <Skeleton className="h-7 w-[80%] rounded-md" />
                </div>
              )}
            </div>
          ))
        ) : !visibleSubjects?.length ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-sm text-muted-foreground">No content yet.</p>
            <p className="text-xs text-muted-foreground">Check back soon!</p>
          </div>
        ) : (
          visibleSubjects.map((subject, i) => (
            <SubjectGroup
              key={subject.id}
              subject={subject}
              selectedSlug={selectedSlug}
              completedTopicIds={completedTopicIds}
              onSelect={onSelect}
              defaultOpen={i === 0}
            />
          ))
        )}
      </div>
    </aside>
  );
}
