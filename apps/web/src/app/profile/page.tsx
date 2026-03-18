'use client';
// apps/web/src/app/profile/page.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Phone, Shield, CheckCircle2,
  XCircle, Loader2, Eye, EyeOff, KeyRound, Pencil,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { api, apiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ── Schemas ───────────────────────────────────────────────────────────────────
const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type NameValues = z.infer<typeof nameSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

// ── Info card ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
  verified,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
      {verified !== undefined && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {verified ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">Verified</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Not verified</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Edit name form ─────────────────────────────────────────────────────────────
function EditNameForm({
  currentName,
  onSuccess,
  onCancel,
}: {
  currentName: string;
  onSuccess: (name: string) => void;
  onCancel: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: currentName },
  });

  const onSubmit = async (values: NameValues) => {
    setIsSubmitting(true);
    try {
      const { data } = await api.patch('/user/profile', { name: values.name });
      onSuccess(data.name ?? values.name);
      toast.success('Name updated!');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoFocus
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ── Change password form ───────────────────────────────────────────────────────
function ChangePasswordForm({ onCancel }: { onCancel: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordValues) => {
    setIsSubmitting(true);
    try {
      await api.patch('/user/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully!');
      reset();
      onCancel();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordInput = ({
    id,
    label,
    show,
    onToggle,
    registration,
    error,
    placeholder,
  }: {
    id: string;
    label: string;
    show: boolean;
    onToggle: () => void;
    registration: ReturnType<typeof register>;
    error?: string;
    placeholder?: string;
  }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder ?? '••••••••'}
          aria-invalid={!!error}
          {...registration}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <PasswordInput
        id="currentPassword"
        label="Current password"
        show={showCurrent}
        onToggle={() => setShowCurrent(p => !p)}
        registration={register('currentPassword')}
        error={errors.currentPassword?.message}
      />
      <PasswordInput
        id="newPassword"
        label="New password"
        show={showNew}
        onToggle={() => setShowNew(p => !p)}
        registration={register('newPassword')}
        error={errors.newPassword?.message}
        placeholder="Min 8 chars, 1 uppercase, 1 number"
      />
      <PasswordInput
        id="confirmPassword"
        label="Confirm new password"
        show={showConfirm}
        onToggle={() => setShowConfirm(p => !p)}
        registration={register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Change password
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ── Main profile page ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?from=/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </main>
    );
  }

  if (!user) return null;

  const handleNameSuccess = async (name: string) => {
    setEditingName(false);
    await refreshUser(); // re-fetch user from API to sync navbar
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-semibold',
              user.role === 'ADMIN'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'bg-muted text-muted-foreground',
            )}>
              {user.role === 'ADMIN' ? (
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              ) : 'User'}
            </span>
            <span className="text-xs text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleDateString('en-IN', {
                month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm">Account information</h2>
          {!editingName && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingName(true)}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit name
            </Button>
          )}
        </div>

        {editingName ? (
          <div className="py-2">
            <EditNameForm
              currentName={user.name}
              onSuccess={handleNameSuccess}
              onCancel={() => setEditingName(false)}
            />
          </div>
        ) : (
          <InfoRow icon={User} label="Full name" value={user.name} />
        )}

        <InfoRow
          icon={Mail}
          label="Email address"
          value={user.email}
          verified={user.emailVerified}
        />
        <InfoRow
          icon={Phone}
          label="Phone number"
          value={user.phone}
          verified={user.phoneVerified}
        />
      </div>

      {/* Verification nudge */}
      {(!user.emailVerified || !user.phoneVerified) && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 space-y-2">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            ⚠️ Unverified contact details
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {!user.emailVerified && 'Your email is not verified. '}
            {!user.phoneVerified && 'Your phone is not verified. '}
            Verification helps secure your account and enables password recovery.
          </p>
        </div>
      )}

      {/* Password section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm">Password</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Change your account password
            </p>
          </div>
          {!changingPassword && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChangingPassword(true)}
              className="gap-1.5 text-xs"
            >
              <KeyRound className="w-3.5 h-3.5" /> Change password
            </Button>
          )}
        </div>

        {changingPassword && (
          <ChangePasswordForm onCancel={() => setChangingPassword(false)} />
        )}
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-semibold text-sm">Account activity</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <a
            href="/bookmarks"
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-center"
          >
            <span className="text-lg">🔖</span>
            <span className="text-xs font-medium">Bookmarks</span>
          </a>
          <a
            href="/dashboard"
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-center"
          >
            <span className="text-lg">📊</span>
            <span className="text-xs font-medium">Dashboard</span>
          </a>
          <a
            href="/dsa"
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-center"
          >
            <span className="text-lg">📚</span>
            <span className="text-xs font-medium">Start learning</span>
          </a>
        </div>
      </div>

    </main>
  );
}
