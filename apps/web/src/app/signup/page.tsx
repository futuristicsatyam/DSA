
'use client';
// apps/web/src/app/signup/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye, EyeOff, Loader2, BookOpen,
  CheckCircle2, Mail, Phone, ArrowRight, ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { authApi } from '@/lib/auth-api';
import { setAccessToken, apiError } from '@/lib/api';
import { signupSchema, SignupFormValues } from '@/lib/validators';
import { OtpInput } from '@/components/otp-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Step = 'details' | 'email-otp' | 'phone-otp' | 'done';

const STEPS: Step[] = ['details', 'email-otp', 'phone-otp', 'done'];
const STEP_LABELS = ['Your info', 'Verify email', 'Verify phone', 'All set'];

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [step, setStep] = useState<Step>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Stored after successful signup, used for OTP steps
  const [signedUpEmail, setSignedUpEmail] = useState('');
  const [signedUpPhone, setSignedUpPhone] = useState('');
  const [accessToken, _setAccessToken] = useState('');

  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  // ── Step 1: Create account ─────────────────────────────────────────────────
  const onSignup = async (values: SignupFormValues) => {
    setIsBusy(true);
    try {
      const { data } = await authApi.signup({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      setAccessToken(data.accessToken);
      _setAccessToken(data.accessToken);
      setUser(data.user);
      setSignedUpEmail(values.email);
      setSignedUpPhone(values.phone);

      // Send email OTP immediately
      await authApi.sendEmailOtp(values.email);
      toast.success('Account created! Check your email for a verification code.');
      setStep('email-otp');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setIsBusy(false);
    }
  };

  // ── Step 2: Verify email OTP ───────────────────────────────────────────────
  const onVerifyEmail = async () => {
    if (emailOtp.length < 6) return;
    setIsBusy(true);
    try {
      await authApi.verifyEmailOtp({ target: signedUpEmail, code: emailOtp });
      toast.success('Email verified!');

      // Send phone OTP
      await authApi.sendPhoneOtp(signedUpPhone);
      toast.info('OTP sent to your phone number.');
      setStep('phone-otp');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setIsBusy(false);
    }
  };

  // ── Step 3: Verify phone OTP ───────────────────────────────────────────────
  const onVerifyPhone = async () => {
    if (phoneOtp.length < 6) return;
    setIsBusy(true);
    try {
      await authApi.verifyPhoneOtp({ target: signedUpPhone, code: phoneOtp });
      toast.success('Phone verified! You\'re all set 🎉');
      setStep('done');
      // Redirect after short delay
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setIsBusy(false);
    }
  };

  // ── Skip verification (allow later) ───────────────────────────────────────
  const skipToApp = () => router.push('/dashboard');

  // ── Resend OTP with cooldown ───────────────────────────────────────────────
  const startCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((n) => {
        if (n <= 1) { clearInterval(timer); return 0; }
        return n - 1;
      });
    }, 1000);
  };

  const resendEmailOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      await authApi.sendEmailOtp(signedUpEmail);
      toast.success('New OTP sent!');
      startCooldown();
    } catch {
      toast.error('Could not resend OTP. Try again.');
    }
  };

  const resendPhoneOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      await authApi.sendPhoneOtp(signedUpPhone);
      toast.success('New OTP sent!');
      startCooldown();
    } catch {
      toast.error('Could not resend OTP. Try again.');
    }
  };

  const currentStepIndex = STEPS.indexOf(step);

  return (
    <main className="min-h-screen flex">
      {/* ── Left decorative panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <Link href="/" className="relative flex items-center gap-2 text-white">
          <BookOpen className="w-7 h-7 text-indigo-300" />
          <span className="text-xl font-bold tracking-tight">DSA Suite</span>
        </Link>

        <div className="relative space-y-4">
          <h2 className="text-3xl font-bold text-white">Start your learning journey</h2>
          <p className="text-indigo-300 text-sm leading-relaxed">
            Join thousands of learners mastering DSA, Competitive Programming, and GATE CSE with structured, editorial-first content.
          </p>

          <ul className="space-y-2 pt-2">
            {['Structured topic roadmaps', 'Rich markdown editorials', 'Progress & streak tracking', 'Bookmark & revisit anytime'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-indigo-200 text-sm">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-indigo-400 text-xs">
          © {new Date().getFullYear()} DSA Suite.
        </p>
      </div>

      {/* ── Right: form panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md space-y-6">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-indigo-600">DSA Suite</span>
          </div>

          {/* Progress stepper */}
          {step !== 'done' && (
            <div className="flex items-center gap-1">
              {STEPS.slice(0, 3).map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors',
                    i < currentStepIndex
                      ? 'bg-indigo-600 text-white'
                      : i === currentStepIndex
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                        : 'bg-muted text-muted-foreground',
                  )}>
                    {i < currentStepIndex ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={cn(
                    'text-xs hidden sm:block',
                    i === currentStepIndex ? 'text-foreground font-medium' : 'text-muted-foreground',
                  )}>
                    {STEP_LABELS[i]}
                  </span>
                  {i < 2 && <div className={cn('flex-1 h-px mx-1', i < currentStepIndex ? 'bg-indigo-600' : 'bg-border')} />}
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 1: Account details ─────────────────────────────────── */}
          {step === 'details' && (
            <>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                <p className="text-muted-foreground text-sm mt-1">Free forever. No credit card needed.</p>
              </div>

              <form onSubmit={handleSubmit(onSignup)} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Alex Kumar" autoFocus {...register('name')} aria-invalid={!!errors.name} />
                  {errors.name?.message && <p className="text-destructive text-xs">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="alex@example.com" {...register('email')} aria-invalid={!!errors.email} />
                  {errors.email?.message && <p className="text-destructive text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="+919876543210" {...register('phone')} aria-invalid={!!errors.phone} />
                  {errors.phone?.message && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                  <p className="text-xs text-muted-foreground">Include country code, e.g. +91 for India</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      {...register('password')}
                      aria-invalid={!!errors.password}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password?.message && <p className="text-destructive text-xs">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      {...register('confirmPassword')}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword?.message && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isBusy}>
                  {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : <>Create account <ArrowRight className="w-4 h-4" /></>}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By signing up you agree to our{' '}
                  <Link href="/terms" className="underline">Terms</Link>{' '}and{' '}
                  <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}

          {/* ── STEP 2: Email OTP ───────────────────────────────────────── */}
          {step === 'email-otp' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Check your email</h2>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to <span className="font-medium text-foreground">{signedUpEmail}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Verification code</Label>
                <OtpInput value={emailOtp} onChange={setEmailOtp} disabled={isBusy} />
              </div>

              <Button
                onClick={onVerifyEmail}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                disabled={emailOtp.length < 6 || isBusy}
              >
                {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <>Verify email <ArrowRight className="w-4 h-4" /></>}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={resendEmailOtp}
                  disabled={resendCooldown > 0}
                  className="text-indigo-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
                <button onClick={skipToApp} className="text-muted-foreground hover:underline">
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Phone OTP ───────────────────────────────────────── */}
          {step === 'phone-otp' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Verify your phone</h2>
                  <p className="text-sm text-muted-foreground">
                    Code sent to <span className="font-medium text-foreground">{signedUpPhone}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Verification code</Label>
                <OtpInput value={phoneOtp} onChange={setPhoneOtp} disabled={isBusy} />
              </div>

              <Button
                onClick={onVerifyPhone}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                disabled={phoneOtp.length < 6 || isBusy}
              >
                {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <>Verify phone <ArrowRight className="w-4 h-4" /></>}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={resendPhoneOtp}
                  disabled={resendCooldown > 0}
                  className="text-indigo-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
                <button onClick={skipToApp} className="text-muted-foreground hover:underline">
                  Skip for now
                </button>
              </div>

              <button
                onClick={() => setStep('email-otp')}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            </div>
          )}

          {/* ── STEP 4: Success ─────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
              <p className="text-muted-foreground">Redirecting you to your dashboard…</p>
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-indigo-600" />
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

