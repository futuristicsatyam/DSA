// apps/web/src/lib/validators.ts
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or phone is required')
    .refine(
      (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9]{7,15}$/.test(v),
      { message: 'Enter a valid email or phone number' },
    ),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    phone: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number (digits only)'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must be numeric'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or phone is required')
    .refine(
      (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9]{7,15}$/.test(v),
      { message: 'Enter a valid email or phone number' },
    ),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
