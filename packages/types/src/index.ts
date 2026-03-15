export type Role = "USER" | "ADMIN";

export type CategoryType = "DSA" | "CP" | "GATE";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: Role;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryType: CategoryType;
  parentId?: string | null;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  orderIndex?: number | null;
  subjectId: string;
}

export interface Editorial {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdownContent: string;
  tags: string[];
  estimatedMinutes?: number | null;
  published: boolean;
  topicId: string;
}
