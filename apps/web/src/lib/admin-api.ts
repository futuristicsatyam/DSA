// apps/web/src/lib/admin-api.ts
import { api } from './api';
import type { Subject, Topic, Editorial, CategoryType, Difficulty } from './content-api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSubjects: number;
  totalTopics: number;
  totalEditorials: number;
  publishedEditorials: number;
}

// Subject DTOs
export interface CreateSubjectDto {
  name: string;
  slug: string;
  description?: string;
  categoryType: CategoryType;
}
export interface UpdateSubjectDto extends Partial<CreateSubjectDto> {}

// Topic DTOs
export interface CreateTopicDto {
  subjectId: string;
  title: string;
  slug: string;
  shortDescription?: string;
  difficulty?: Difficulty;
  orderIndex?: number;
}
export interface UpdateTopicDto extends Partial<CreateTopicDto> {}

// Editorial DTOs
export interface CreateEditorialDto {
  topicId: string;
  slug: string;
  title: string;
  summary?: string;
  markdownContent: string;
  tags?: string[];
  estimatedMinutes?: number;
  published?: boolean;
}
export interface UpdateEditorialDto extends Partial<CreateEditorialDto> {}

// ── Admin API calls ───────────────────────────────────────────────────────────

export const adminApi = {
  // Stats
  getStats: () => api.get<AdminStats>('/admin/stats'),

  // Subjects
  getSubjects: (params?: { categoryType?: CategoryType; page?: number; limit?: number }) =>
    api.get<{ data: Subject[]; total: number }>('/admin/subjects', { params }),
  createSubject: (dto: CreateSubjectDto) =>
    api.post<Subject>('/admin/subjects', dto),
  updateSubject: (id: string, dto: UpdateSubjectDto) =>
    api.patch<Subject>(`/admin/subjects/${id}`, dto),
  deleteSubject: (id: string) =>
    api.delete(`/admin/subjects/${id}`),

  // Topics
  getTopics: (params?: { subjectId?: string; page?: number; limit?: number }) =>
    api.get<{ data: Topic[]; total: number }>('/admin/topics', { params }),
  createTopic: (dto: CreateTopicDto) =>
    api.post<Topic>('/admin/topics', dto),
  updateTopic: (id: string, dto: UpdateTopicDto) =>
    api.patch<Topic>(`/admin/topics/${id}`, dto),
  deleteTopic: (id: string) =>
    api.delete(`/admin/topics/${id}`),

  // Editorials
  getEditorials: (params?: { published?: boolean; page?: number; limit?: number }) =>
    api.get<{ data: Editorial[]; total: number }>('/admin/editorials', { params }),
  getEditorial: (id: string) =>
    api.get<Editorial>(`/admin/editorials/${id}`),
  createEditorial: (dto: CreateEditorialDto) =>
    api.post<Editorial>('/admin/editorials', dto),
  updateEditorial: (id: string, dto: UpdateEditorialDto) =>
    api.patch<Editorial>(`/admin/editorials/${id}`, dto),
  deleteEditorial: (id: string) =>
    api.delete(`/admin/editorials/${id}`),

  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<{ data: AdminUser[]; total: number }>('/admin/users', { params }),
  updateUserRole: (id: string, role: 'USER' | 'ADMIN') =>
    api.patch<AdminUser>(`/admin/users/${id}/role`, { role }),
};
