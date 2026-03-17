// apps/web/src/lib/content-api.ts
import { api } from './api';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CategoryType = 'DSA' | 'CP' | 'GATE';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

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

// ── API calls ─────────────────────────────────────────────────────────────────

export const contentApi = {
  // DSA
  getDsaSubjects: () =>
    api.get<Subject[]>('/content/dsa/subjects'),
  getDsaTopic: (slug: string) =>
    api.get<{ topic: Topic; editorial: Editorial | null }>(`/content/dsa/topics/${slug}`),

  // CP
  getCpSubjects: () =>
    api.get<Subject[]>('/content/cp/subjects'),
  getCpTopic: (slug: string) =>
    api.get<{ topic: Topic; editorial: Editorial | null }>(`/content/cp/topics/${slug}`),

  // GATE
  getGateSubjects: () =>
    api.get<Subject[]>('/content/gate/subjects'),
  getGateTopic: (slug: string) =>
    api.get<{ topic: Topic; editorial: Editorial | null }>(`/content/gate/topics/${slug}`),

  // Editorial by slug
  getEditorial: (slug: string) =>
    api.get<Editorial>(`/content/editorials/${slug}`),

  // Search
  search: (q: string) =>
    api.get<SearchResult>(`/content/search`, { params: { q } }),
};
