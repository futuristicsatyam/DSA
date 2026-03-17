
'use client';
// apps/web/src/app/login/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { apiError } from '@/lib/api';
import { loginSchema, LoginFormValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = searchParams.get('from') ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const user = await login(values.identifier, values.password);

      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);

      // If email/phone not verified, nudge them — but still let them in
      if (!user.emailVerified) {
        toast.info('Please verify your email to unlock all features.');
      }

      router.push(user.role === 'ADMIN' ? '/admin' : from);
    } catch (err) {
      const message = apiError(err);

      // Map specific API errors to field-level errors
      if (
        message.toLowerCase().includes('password') ||
        message.toLowerCase().includes('invalid credentials')
      ) {
        setError('password', { message: 'Invalid credentials' });
        setError('identifier', { message: '' });
      } else if (
        message.toLowerCase().includes('not found') ||
        message.toLowerCase().includes('user')
      ) {
        setError('identifier', { message: 'No account found with this email or phone' });
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* ── Left panel — decorative ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2 text-white">
            <BookOpen className="w-7 h-7 text-indigo-300" />
            <span className="text-xl font-bold tracking-tight">DSA Suite</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <blockquote className="text-3xl font-bold text-white leading-tight">
            "The only way to learn a new programming language is by writing programs in it."
          </blockquote>
          <p className="text-indigo-300 text-sm">— Dennis Ritchie</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: 'Topics', value: '200+' },
              { label: 'Editorials', value: '500+' },
              { label: 'Learners', value: '10k+' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-indigo-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-indigo-400 text-xs">
          © {new Date().getFullYear()} DSA Suite. All rights reserved.
        </p>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm space-y-8">

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-indigo-600">DSA Suite</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="identifier">Email or Phone</Label>
              <Input
                id="identifier"
                placeholder="you@example.com or +919876543210"
                autoComplete="username"
                autoFocus
                aria-invalid={!!errors.identifier}
                {...register('identifier')}
              />
              {errors.identifier?.message && (
                <p className="text-destructive text-xs mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:underline"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password?.message && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

