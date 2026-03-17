'use client';
// apps/web/src/components/bookmark-button.tsx

import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useIsBookmarked, useToggleBookmark } from '@/hooks/use-bookmarks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  topicId: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export function BookmarkButton({
  topicId,
  variant = 'icon',
  className,
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { isBookmarked, bookmarkId } = useIsBookmarked(topicId);
  const toggle = useToggleBookmark();

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.info('Sign in to bookmark topics');
      router.push('/login');
      return;
    }
    toggle.mutate({ topicId, bookmarkId });
  };

  if (variant === 'button') {
    return (
      <Button
        variant={isBookmarked ? 'secondary' : 'outline'}
        size="sm"
        onClick={handleClick}
        disabled={toggle.isPending}
        className={cn('gap-2', className)}
      >
        {toggle.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isBookmarked ? (
          <BookmarkCheck className="w-4 h-4 text-indigo-600" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </Button>
    );
  }

  // Icon variant
  return (
    <button
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this topic'}
      className={cn(
        'p-2 rounded-lg transition-all',
        isBookmarked
          ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {toggle.isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </button>
  );
}
