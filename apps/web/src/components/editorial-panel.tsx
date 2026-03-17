
'use client';
// apps/web/src/components/editorial-panel.tsx

import { Clock, Tag, BarChart2, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Topic, Editorial, Difficulty } from '@/lib/content-api';
import { MarkdownRenderer } from './markdown-renderer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
  MEDIUM: 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
  HARD: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
};

interface EditorialPanelProps {
  topic: Topic | null | undefined;
  editorial: Editorial | null | undefined;
  isLoading: boolean;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <ArrowRight className="w-8 h-8 text-indigo-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Select a topic</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Choose a topic from the sidebar to start reading editorials, notes, and examples.
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? 'w-1/3 h-6' : i % 4 === 0 ? 'w-4/5' : 'w-full'}`} />
      ))}
      <Skeleton className="h-32 w-full rounded-xl" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i + 8} className="h-4 w-full" />
      ))}
    </div>
  );
}

const PLACEHOLDER_EDITORIAL = `
> [!NOTE]
> This topic doesn't have a written editorial yet. It will be added soon!

## Coming Soon

Our team is working on detailed notes and examples for this topic. Check back later.

In the meantime, you can:
- Explore other topics using the sidebar
- Bookmark this topic to revisit it later
- Browse related editorials

We're continuously adding content — thanks for your patience!
`.trim();

export function EditorialPanel({
  topic,
  editorial,
  isLoading,
  isBookmarked = false,
  onBookmark,
  onMarkComplete,
  isCompleted = false,
}: EditorialPanelProps) {
  if (!topic && !isLoading) return <WelcomeScreen />;
  if (isLoading) return <LoadingSkeleton />;
  if (!topic) return null;

  const content = editorial?.markdownContent ?? PLACEHOLDER_EDITORIAL;

  return (
    <div className="flex-1 min-w-0 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold leading-tight">{topic.title}</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onBookmark && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBookmark}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
                className={cn(isBookmarked && 'text-indigo-600')}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {topic.difficulty && (
            <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', DIFFICULTY_STYLES[topic.difficulty])}>
              {topic.difficulty}
            </span>
          )}
          {editorial?.estimatedMinutes && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {editorial.estimatedMinutes} min read
            </span>
          )}
          {editorial?.tags && editorial.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {editorial.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {topic.shortDescription && (
          <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-indigo-400 pl-3">
            {topic.shortDescription}
          </p>
        )}

        {/* Mark complete */}
        {onMarkComplete && (
          <Button
            variant={isCompleted ? 'secondary' : 'default'}
            size="sm"
            onClick={onMarkComplete}
            className={cn(
              'gap-2',
              !isCompleted && 'bg-indigo-600 hover:bg-indigo-700 text-white',
            )}
          >
            <BarChart2 className="w-4 h-4" />
            {isCompleted ? 'Marked as complete ✓' : 'Mark as complete'}
          </Button>
        )}
      </div>

      <hr className="border-border" />

      {/* Markdown content */}
      <MarkdownRenderer content={content} />
    </div>
  );
}
