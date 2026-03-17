// apps/web/src/lib/bookmark-api.ts
import { api } from './api';
import type { Topic, Editorial } from './content-api';

export interface Bookmark {
  id: string;
  userId: string;
  topicId: string | null;
  editorialId: string | null;
  createdAt: string;
  topic?: Topic;
  editorial?: Editorial;
}

export const bookmarkApi = {
  list: () =>
    api.get<Bookmark[]>('/user/bookmarks'),

  add: (payload: { topicId?: string; editorialId?: string }) =>
    api.post<Bookmark>('/user/bookmarks', payload),

  remove: (id: string) =>
    api.delete(`/user/bookmarks/${id}`),

  // Check if a specific topic is bookmarked — derived from list
  isBookmarked: async (topicId: string): Promise<string | null> => {
    const { data } = await api.get<Bookmark[]>('/user/bookmarks');
    const found = data.find(b => b.topicId === topicId);
    return found ? found.id : null;
  },
};
