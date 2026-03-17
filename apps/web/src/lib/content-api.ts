// apps/web/src/lib/content-api.ts
// FIXED: Difficulty enum matches your actual Prisma schema
import { api } from './api';

export type CategoryType = 'DSA' | 'CP' | 'GATE';

// ⚠️ Your schema uses BEGINNER / INTERMEDIATE / ADVANCED — not EASY/MEDIUM/HARD
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryType: CategoryType;
  parentId: string | null;
  topics: Topic[];
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  difficulty: Difficulty | null;
  orderIndex: number | null;
  subject?: Subject;
}

export interface Editorial {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  summary: string | null;
  markdownContent: string;
  tags: string[];
  estimatedMinutes: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  topic?: Topic;
}

export interface SearchResult {
  subjects: Subject[];
  topics: Topic[];
  editorials: Editorial[];
}

export const contentApi = {
  getDsaSubjects: () => api.get<Subject[]>('/content/dsa/subjects'),
  getDsaTopic: (slug: string) =>
    api.get<{ topic: Topic; editorial: Editorial | null }>(`/content/dsa/topics/${slug}`),

  getCpSubjects: () => api.get<Subject[]>('/content/cp/subjects'),
  getCpTopic: (slug: string) =>
    api.get<{ topic: Topic; editorial: Editorial | null }>(`/content/cp/topics/${slug}`),

  getGateSubjects: () => api.get<Subject[]>('/content/gate/subjects'),
  getGateTopic: (slug: string) =>
    api.get<{ topic: Topic; editorial: Editorial | null }>(`/content/gate/topics/${slug}`),

  getEditorial: (slug: string) => api.get<Editorial>(`/content/editorials/${slug}`),
  search: (q: string) => api.get<SearchResult>('/content/search', { params: { q } }),
};
