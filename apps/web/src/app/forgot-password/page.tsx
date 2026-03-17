
'use client';
// apps/web/src/app/forgot-password/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, BookOpen, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/auth-api';
import { apiError } from '@/lib/api';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [target, setTarget] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsBusy(true);
    try {
      await authApi.forgotPassword({ identifier: values.identifier });
      setTarget(values.identifier);
      setSent(true);
      toast.success('Reset code sent!');
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

        {!sent ? (
          <>
            <div>
              <h1 className="text-2xl font-bold">Forgot your password?</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enter your email or phone and we&apos;ll send a reset code.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="identifier">Email or Phone</Label>
                <Input
                  id="identifier"
                  placeholder="you@example.com or +919876543210"
                  autoFocus
                  {...register('identifier')}
                  aria-invalid={!!errors.identifier}
                />
                {errors.identifier?.message && (
                  <p className="text-destructive text-xs">{errors.identifier.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                disabled={isBusy}
              >
                {isBusy ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <>Send reset code <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold">Check your inbox</h2>
            <p className="text-muted-foreground text-sm">
              A 6-digit reset code was sent to{' '}
              <span className="font-medium text-foreground">{target}</span>.
              It expires in 10 minutes.
            </p>
            <Link
              href={`/reset-password?target=${encodeURIComponent(target)}`}
              className="block"
            >
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                Enter reset code <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        <Link
          href="/login"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3 h-3" /> Back to login
        </Link>
      </div>
    </main>
  );
}

