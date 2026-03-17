'use client';
// apps/web/src/app/bookmarks/page.tsx

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bookmark, BookmarkX, ArrowRight,
  Layers, BookOpen, GraduationCap, Code2,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useBookmarks, useRemoveBookmark } from '@/hooks/use-bookmarks';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CategoryType } from '@/lib/content-api';

// Map topic subject categoryType to display info
const CATEGORY_META: Record<CategoryType, { label: string; icon: React.ElementType; color: string; bg: string; href: string }> = {
  DSA: {
    label: 'DSA',
    icon: Code2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    href: '/dsa',
  },
  CP: {
    label: 'CP',
    icon: Layers,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    href: '/cp',
  },
  GATE: {
    label: 'GATE CSE',
    icon: GraduationCap,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    href: '/gate',
  },
};

const DIFF_COLORS: Record<string, string> = {
  BEGINNER: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  INTERMEDIATE: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  ADVANCED: 'text-red-500 bg-red-50 dark:bg-red-900/20',
};

type FilterType = 'ALL' | CategoryType;

function EmptyState({ filter }: { filter: FilterType }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Bookmark className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">No bookmarks yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {filter === 'ALL'
            ? "Save topics you want to revisit — click the bookmark icon on any topic."
            : `No ${filter} topics bookmarked yet.`}
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dsa">
          <Button variant="outline" size="sm" className="gap-2">
            <Code2 className="w-4 h-4" /> Browse DSA
          </Button>
        </Link>
        <Link href="/gate">
          <Button variant="outline" size="sm" className="gap-2">
            <GraduationCap className="w-4 h-4" /> Browse GATE
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: bookmarks, isLoading } = useBookmarks();
  const remove = useRemoveBookmark();
  const [filter, setFilter] = useState<FilterType>('ALL');

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login?from=/bookmarks');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || (!isAuthenticated && !authLoading)) return null;

  // Filter bookmarks by category
  const filtered = (bookmarks ?? []).filter(b => {
    if (filter === 'ALL') return true;
    return b.topic?.subject?.categoryType === filter;
  });

  // Group by category for display
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, b) => {
    const cat = b.topic?.subject?.categoryType ?? 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(b);
    return acc;
  }, {});

  const totalCount = bookmarks?.length ?? 0;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600" />
            Bookmarks
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLoading ? '…' : `${totalCount} saved topic${totalCount !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-border pb-0">
        {(['ALL', 'DSA', 'CP', 'GATE'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              filter === f
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {f === 'ALL' ? 'All' : f}
            {f !== 'ALL' && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {(bookmarks ?? []).filter(b => b.topic?.subject?.categoryType === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <EmptyState filter={filter} />
      )}

      {/* Bookmark cards — grouped by category */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, items]) => {
            const meta = CATEGORY_META[cat as CategoryType];
            const Icon = meta?.icon ?? BookOpen;

            return (
              <div key={cat} className="space-y-3">
                {/* Category header */}
                <div className="flex items-center gap-2">
                  <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', meta?.bg)}>
                    <Icon className={cn('w-3.5 h-3.5', meta?.color)} />
                  </div>
                  <h2 className="font-semibold text-sm">
                    {meta?.label ?? cat}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {items.length} topic{items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Bookmark cards */}
                <div className="space-y-2">
                  {items.map(bookmark => {
                    const topic = bookmark.topic;
                    if (!topic) return null;

                    // Build the topic URL
                    const catPath = cat === 'DSA' ? '/dsa' : cat === 'CP' ? '/cp' : '/gate';
                    const topicUrl = `${catPath}?topic=${topic.slug}`;

                    return (
                      <div
                        key={bookmark.id}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-all"
                      >
                        {/* Icon */}
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          meta?.bg,
                        )}>
                          <Icon className={cn('w-5 h-5', meta?.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={topicUrl}
                              className="font-medium hover:text-indigo-600 transition-colors truncate"
                            >
                              {topic.title}
                            </Link>
                            {topic.difficulty && (
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0',
                                DIFF_COLORS[topic.difficulty],
                              )}>
                                {topic.difficulty[0] + topic.difficulty.slice(1).toLowerCase()}
                              </span>
                            )}
                          </div>
                          {topic.shortDescription && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {topic.shortDescription}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Saved {new Date(bookmark.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link href={topicUrl}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Go to topic"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                          <button
                            onClick={() => remove.mutate(bookmark.id)}
                            disabled={remove.isPending}
                            title="Remove bookmark"
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <BookmarkX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
