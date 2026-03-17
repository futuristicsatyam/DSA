// apps/web/src/hooks/use-admin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi, CreateSubjectDto, UpdateSubjectDto, CreateTopicDto, UpdateTopicDto, CreateEditorialDto, UpdateEditorialDto } from '@/lib/admin-api';
import { CategoryType } from '@/lib/content-api';
import { apiError } from '@/lib/api';

const K = {
  stats: ['admin', 'stats'],
  subjects: (cat?: CategoryType) => ['admin', 'subjects', cat ?? 'all'],
  topics: (subjectId?: string) => ['admin', 'topics', subjectId ?? 'all'],
  editorials: (published?: boolean) => ['admin', 'editorials', published],
  editorial: (id: string) => ['admin', 'editorial', id],
  users: ['admin', 'users'],
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export function useAdminStats() {
  return useQuery({
    queryKey: K.stats,
    queryFn: () => adminApi.getStats().then(r => r.data),
    staleTime: 30_000,
  });
}

// ── Subjects ──────────────────────────────────────────────────────────────────
export function useAdminSubjects(categoryType?: CategoryType) {
  return useQuery({
    queryKey: K.subjects(categoryType),
    queryFn: () => adminApi.getSubjects({ categoryType, limit: 100 }).then(r => r.data),
    staleTime: 60_000,
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSubjectDto) => adminApi.createSubject(dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      qc.invalidateQueries({ queryKey: K.stats });
      toast.success('Subject created!');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubjectDto }) =>
      adminApi.updateSubject(id, dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      toast.success('Subject updated!');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteSubject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      qc.invalidateQueries({ queryKey: K.stats });
      toast.success('Subject deleted.');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

// ── Topics ────────────────────────────────────────────────────────────────────
export function useAdminTopics(subjectId?: string) {
  return useQuery({
    queryKey: K.topics(subjectId),
    queryFn: () => adminApi.getTopics({ subjectId, limit: 200 }).then(r => r.data),
    staleTime: 60_000,
  });
}

export function useCreateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTopicDto) => adminApi.createTopic(dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'topics'] });
      qc.invalidateQueries({ queryKey: K.stats });
      toast.success('Topic created!');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

export function useUpdateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTopicDto }) =>
      adminApi.updateTopic(id, dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'topics'] });
      toast.success('Topic updated!');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

export function useDeleteTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteTopic(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'topics'] });
      qc.invalidateQueries({ queryKey: K.stats });
      toast.success('Topic deleted.');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

// ── Editorials ────────────────────────────────────────────────────────────────
export function useAdminEditorials(published?: boolean) {
  return useQuery({
    queryKey: K.editorials(published),
    queryFn: () => adminApi.getEditorials({ published, limit: 100 }).then(r => r.data),
    staleTime: 60_000,
  });
}

export function useAdminEditorial(id: string | null) {
  return useQuery({
    queryKey: K.editorial(id ?? ''),
    queryFn: () => adminApi.getEditorial(id!).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateEditorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateEditorialDto) => adminApi.createEditorial(dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'editorials'] });
      qc.invalidateQueries({ queryKey: K.stats });
      toast.success('Editorial created!');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

export function useUpdateEditorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEditorialDto }) =>
      adminApi.updateEditorial(id, dto).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'editorials'] });
      qc.invalidateQueries({ queryKey: K.editorial(id) });
      toast.success('Editorial saved!');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

export function useDeleteEditorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteEditorial(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'editorials'] });
      qc.invalidateQueries({ queryKey: K.stats });
      toast.success('Editorial deleted.');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function useAdminUsers() {
  return useQuery({
    queryKey: K.users,
    queryFn: () => adminApi.getUsers({ limit: 100 }).then(r => r.data),
    staleTime: 30_000,
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'USER' | 'ADMIN' }) =>
      adminApi.updateUserRole(id, role).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: K.users });
      toast.success('Role updated!');
    },
    onError: (e) => toast.error(apiError(e)),
  });
}
