// apps/web/src/hooks/use-content.ts
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/lib/content-api';

// ── Query keys ────────────────────────────────────────────────────────────────
export const contentKeys = {
  dsaSubjects: ['content', 'dsa', 'subjects'] as const,
  dsaTopic: (slug: string) => ['content', 'dsa', 'topic', slug] as const,
  cpSubjects: ['content', 'cp', 'subjects'] as const,
  cpTopic: (slug: string) => ['content', 'cp', 'topic', slug] as const,
  gateSubjects: ['content', 'gate', 'subjects'] as const,
  gateTopic: (slug: string) => ['content', 'gate', 'topic', slug] as const,
  search: (q: string) => ['content', 'search', q] as const,
};

// ── DSA hooks ─────────────────────────────────────────────────────────────────
export function useDsaSubjects() {
  return useQuery({
    queryKey: contentKeys.dsaSubjects,
    queryFn: () => contentApi.getDsaSubjects().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDsaTopic(slug: string | null) {
  return useQuery({
    queryKey: contentKeys.dsaTopic(slug ?? ''),
    queryFn: () => contentApi.getDsaTopic(slug!).then((r) => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// ── CP hooks ──────────────────────────────────────────────────────────────────
export function useCpSubjects() {
  return useQuery({
    queryKey: contentKeys.cpSubjects,
    queryFn: () => contentApi.getCpSubjects().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCpTopic(slug: string | null) {
  return useQuery({
    queryKey: contentKeys.cpTopic(slug ?? ''),
    queryFn: () => contentApi.getCpTopic(slug!).then((r) => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// ── GATE hooks ────────────────────────────────────────────────────────────────
export function useGateSubjects() {
  return useQuery({
    queryKey: contentKeys.gateSubjects,
    queryFn: () => contentApi.getGateSubjects().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGateTopic(slug: string | null) {
  return useQuery({
    queryKey: contentKeys.gateTopic(slug ?? ''),
    queryFn: () => contentApi.getGateTopic(slug!).then((r) => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Search hook ───────────────────────────────────────────────────────────────
export function useSearch(q: string) {
  return useQuery({
    queryKey: contentKeys.search(q),
    queryFn: () => contentApi.search(q).then((r) => r.data),
    enabled: q.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}
