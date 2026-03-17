
'use client';
// apps/web/src/app/reset-password/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, BookOpen, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/auth-api';
import { apiError } from '@/lib/api';
import { resetPasswordSchema, ResetPasswordFormValues } from '@/lib/validators';
import { OtpInput } from '@/components/otp-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get('target') ?? '';

  const [otp, setOtp] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (otp.length < 6) {
      toast.error('Please enter the 6-digit OTP first.');
      return;
    }
    setIsBusy(true);
    try {
      await authApi.resetPassword({
        target,
        code: otp,
        newPassword: values.newPassword,
      });
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="w-6 h-6" />
          <span className="font-bold">DSA Suite</span>
        </Link>

        {done ? (
          <div className="text-center space-y-4 py-8">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Password updated!</h2>
            <p className="text-muted-foreground text-sm">Redirecting to login…</p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold">Reset your password</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enter the code sent to{' '}
                <span className="font-medium text-foreground">{target || 'your email/phone'}</span>{' '}
                and choose a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label>Verification code</Label>
                <OtpInput value={otp} onChange={setOtp} disabled={isBusy} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    {...register('newPassword')}
                    aria-invalid={!!errors.newPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword?.message && (
                  <p className="text-destructive text-xs">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    {...register('confirmPassword')}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isBusy || otp.length < 6}
              >
                {isBusy ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Resetting…</>
                ) : (
                  'Reset password'
                )}
              </Button>
            </form>
          </>
        )}

        <Link href="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground">
          ← Back to login
        </Link>
      </div>
    </main>
  );
}

