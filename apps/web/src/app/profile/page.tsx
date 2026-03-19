export const dynamic = 'force-dynamic';
'use client';
// apps/web/src/app/profile/page.tsx
// Safe version — uses the same pattern as your existing pages

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Profile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
}

// ── API fetch helper — works with your existing setup ─────────────────────────
async function fetchProfile(): Promise<Profile> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

async function updateName(name: string): Promise<Profile> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Failed to update name');
  }
  return res.json();
}

async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/password`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Failed to change password');
  }
  return res.json();
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  // Edit name state
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');

  // Change password state
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  const nameMutation = useMutation({
    mutationFn: (name: string) => updateName(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      setEditingName(false);
      setNameError('');
    },
    onError: (err: Error) => setNameError(err.message),
  });

  const passwordMutation = useMutation({
    mutationFn: ({ current, next }: { current: string; next: string }) =>
      changePassword(current, next),
    onSuccess: () => {
      setChangingPassword(false);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setPwdError('');
      setPwdSuccess('Password changed successfully!');
      setTimeout(() => setPwdSuccess(''), 3000);
    },
    onError: (err: Error) => setPwdError(err.message),
  });

  const handleNameSave = () => {
    if (nameInput.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    nameMutation.mutate(nameInput.trim());
  };

  const handlePasswordChange = () => {
    setPwdError('');
    if (!currentPwd) { setPwdError('Enter your current password'); return; }
    if (newPwd.length < 8) { setPwdError('New password must be at least 8 characters'); return; }
    if (!/[A-Z]/.test(newPwd)) { setPwdError('Must contain an uppercase letter'); return; }
    if (!/[0-9]/.test(newPwd)) { setPwdError('Must contain a number'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match'); return; }
    passwordMutation.mutate({ current: currentPwd, next: newPwd });
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-32" />
        <div className="h-48 bg-muted animate-pulse rounded-xl" />
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-4">
        <p className="text-muted-foreground">
          You need to be logged in to view your profile.
        </p>
        <a
          href="/login"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // ── Profile page ──────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {data.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            data.role === 'ADMIN'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-muted text-muted-foreground'
          }`}>
            {data.role}
          </span>
        </div>
      </div>

      {/* Account info */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Account information</h2>
          {!editingName && (
            <button
              onClick={() => { setEditingName(true); setNameInput(data.name); }}
              className="text-xs text-indigo-600 hover:underline"
            >
              Edit name
            </button>
          )}
        </div>

        {/* Name */}
        {editingName ? (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Full name</label>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              autoFocus
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {nameError && <p className="text-destructive text-xs">{nameError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleNameSave}
                disabled={nameMutation.isPending}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {nameMutation.isPending ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => { setEditingName(false); setNameError(''); }}
                className="px-3 py-1.5 border border-border text-xs rounded-md hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <span className="text-xs text-muted-foreground w-20">Name</span>
            <span className="text-sm font-medium">{data.name}</span>
          </div>
        )}

        {/* Email */}
        <div className="flex items-center gap-3 py-1 border-t border-border">
          <span className="text-xs text-muted-foreground w-20">Email</span>
          <span className="text-sm flex-1">{data.email ?? '—'}</span>
          <span className={`text-xs font-medium ${data.emailVerified ? 'text-green-600' : 'text-muted-foreground'}`}>
            {data.emailVerified ? '✓ Verified' : 'Not verified'}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 py-1 border-t border-border">
          <span className="text-xs text-muted-foreground w-20">Phone</span>
          <span className="text-sm flex-1">{data.phone ?? '—'}</span>
          <span className={`text-xs font-medium ${data.phoneVerified ? 'text-green-600' : 'text-muted-foreground'}`}>
            {data.phoneVerified ? '✓ Verified' : 'Not verified'}
          </span>
        </div>

        {/* Joined */}
        <div className="flex items-center gap-3 py-1 border-t border-border">
          <span className="text-xs text-muted-foreground w-20">Joined</span>
          <span className="text-sm">
            {new Date(data.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm">Password</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Change your account password</p>
          </div>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="text-xs text-indigo-600 hover:underline"
            >
              Change password
            </button>
          )}
        </div>

        {pwdSuccess && (
          <p className="text-green-600 text-sm font-medium">{pwdSuccess}</p>
        )}

        {changingPassword && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Current password</label>
              <div className="relative">
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">New password</label>
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showNewPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Confirm new password</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {pwdError && <p className="text-destructive text-xs">{pwdError}</p>}

            <div className="flex gap-2">
              <button
                onClick={handlePasswordChange}
                disabled={passwordMutation.isPending}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {passwordMutation.isPending ? 'Changing…' : 'Change password'}
              </button>
              <button
                onClick={() => {
                  setChangingPassword(false);
                  setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
                  setPwdError('');
                }}
                className="px-3 py-1.5 border border-border text-xs rounded-md hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-semibold text-sm">Quick links</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: '/dashboard', emoji: '📊', label: 'Dashboard' },
            { href: '/bookmarks', emoji: '🔖', label: 'Bookmarks' },
            { href: '/dsa', emoji: '📚', label: 'Learn DSA' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-center"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

    </main>
  );
}
