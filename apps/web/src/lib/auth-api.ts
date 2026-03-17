// apps/web/src/lib/auth-api.ts
import { api } from './api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  identifier: string; // email or phone
  password: string;
}

export interface OtpPayload {
  target: string;
  code: string;
}

export interface ForgotPasswordPayload {
  identifier: string;
}

export interface ResetPasswordPayload {
  target: string;
  code: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

// ── Auth API calls ────────────────────────────────────────────────────────────

export const authApi = {
  signup: (payload: SignupPayload) =>
    api.post<AuthResponse>('/auth/signup', payload),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  logout: () => api.post<MessageResponse>('/auth/logout'),

  me: () => api.get<AuthUser>('/auth/me'),

  refresh: () => api.post<{ accessToken: string }>('/auth/refresh'),

  sendEmailOtp: (email: string) =>
    api.post<MessageResponse>('/auth/send-email-otp', { email }),

  verifyEmailOtp: (payload: OtpPayload) =>
    api.post<MessageResponse>('/auth/verify-email-otp', payload),

  sendPhoneOtp: (phone: string) =>
    api.post<MessageResponse>('/auth/send-phone-otp', { phone }),

  verifyPhoneOtp: (payload: OtpPayload) =>
    api.post<MessageResponse>('/auth/verify-phone-otp', payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<MessageResponse>('/auth/forgot-password', payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<MessageResponse>('/auth/reset-password', payload),
};
