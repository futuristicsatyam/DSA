// apps/web/src/hooks/use-bookmarks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookmarkApi, Bookmark } from '@/lib/bookmark-api';
import { apiError } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

const BOOKMARKS_KEY = ['user', 'bookmarks'];

// ── Fetch all bookmarks ───────────────────────────────────────────────────────
export function useBookmarks() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: BOOKMARKS_KEY,
    queryFn: () => bookmarkApi.list().then(r => r.data),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

// ── Check if a specific topic is bookmarked ───────────────────────────────────
export function useIsBookmarked(topicId: string | null) {
  const { data: bookmarks } = useBookmarks();
  if (!topicId || !bookmarks) return { isBookmarked: false, bookmarkId: null };
  const found = bookmarks.find(b => b.topicId === topicId);
  return {
    isBookmarked: !!found,
    bookmarkId: found?.id ?? null,
  };
}

// ── Toggle bookmark (add if not bookmarked, remove if bookmarked) ─────────────
export function useToggleBookmark() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      topicId,
      bookmarkId,
    }: {
      topicId: string;
      bookmarkId: string | null;
    }) => {
      if (bookmarkId) {
        await bookmarkApi.remove(bookmarkId);
        return null;
      } else {
        const { data } = await bookmarkApi.add({ topicId });
        return data;
      }
    },

    // Optimistic update — toggle immediately in the cache
    onMutate: async ({ topicId, bookmarkId }) => {
      await qc.cancelQueries({ queryKey: BOOKMARKS_KEY });
      const previous = qc.getQueryData<Bookmark[]>(BOOKMARKS_KEY);

      qc.setQueryData<Bookmark[]>(BOOKMARKS_KEY, old => {
        if (!old) return old;
        if (bookmarkId) {
          // Remove optimistically
          return old.filter(b => b.id !== bookmarkId);
        } else {
          // Add optimistically with temp id
          return [
            ...old,
            {
              id: `temp-${topicId}`,
              userId: '',
              topicId,
              editorialId: null,
              createdAt: new Date().toISOString(),
            },
          ];
        }
      });

      return { previous };
    },

    onError: (err, _, context) => {
      // Roll back on error
      if (context?.previous) {
        qc.setQueryData(BOOKMARKS_KEY, context.previous);
      }
      toast.error(apiError(err));
    },

    onSuccess: (_, { bookmarkId }) => {
      qc.invalidateQueries({ queryKey: BOOKMARKS_KEY });
      toast.success(bookmarkId ? 'Bookmark removed' : 'Bookmarked!');
    },
  });
}

// ── Remove a bookmark by ID ───────────────────────────────────────────────────
export function useRemoveBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookmarkApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: BOOKMARKS_KEY });
      const previous = qc.getQueryData<Bookmark[]>(BOOKMARKS_KEY);
      qc.setQueryData<Bookmark[]>(BOOKMARKS_KEY, old =>
        old ? old.filter(b => b.id !== id) : old,
      );
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) qc.setQueryData(BOOKMARKS_KEY, context.previous);
      toast.error(apiError(err));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKMARKS_KEY });
      toast.success('Bookmark removed');
    },
  });
}
