'use client';
// apps/web/src/app/admin/users/page.tsx

import { useState } from 'react';
import { Search, Shield, User, CheckCircle2, XCircle } from 'lucide-react';
import { useAdminUsers, useUpdateUserRole } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/lib/admin-api';

function RoleBadge({ role }: { role: 'USER' | 'ADMIN' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
      role === 'ADMIN'
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    )}>
      {role === 'ADMIN'
        ? <Shield className="w-3 h-3" />
        : <User className="w-3 h-3" />}
      {role}
    </span>
  );
}

function VerifiedIcon({ verified }: { verified: boolean }) {
  return verified
    ? <CheckCircle2 className="w-4 h-4 text-green-500" />
    : <XCircle className="w-4 h-4 text-muted-foreground" />;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { data, isLoading } = useAdminUsers();
  const updateRole = useUpdateUserRole();
  const [search, setSearch] = useState('');

  const users: AdminUser[] = (data?.data ?? []).filter(u =>
    search
      ? u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      : true,
  );

  const toggleRole = (u: AdminUser) => {
    if (u.id === currentUser?.id) return; // can't demote yourself
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
    updateRole.mutate({ id: u.id, role: newRole });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {data?.total ?? 0} registered users
        </p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Verified</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-7 w-20" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(u => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {u.name}
                            {isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground">
                      {u.phone}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span title="Email" className="flex items-center gap-1 text-xs text-muted-foreground">
                          E <VerifiedIcon verified={u.emailVerified} />
                        </span>
                        <span title="Phone" className="flex items-center gap-1 text-xs text-muted-foreground">
                          P <VerifiedIcon verified={u.phoneVerified} />
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRole(u)}
                        disabled={isSelf || updateRole.isPending}
                        className="text-xs h-7"
                        title={isSelf ? "Can't change your own role" : undefined}
                      >
                        {u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
