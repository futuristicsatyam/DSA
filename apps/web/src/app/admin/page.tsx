'use client';
// apps/web/src/app/admin/page.tsx

import Link from 'next/link';
import { Layers, BookOpen, FileText, Users, ArrowRight, PlusCircle } from 'lucide-react';
import { useAdminStats } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const STAT_CARDS = [
  {
    key: 'totalSubjects' as const,
    label: 'Subjects',
    icon: Layers,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    href: '/admin/subjects',
  },
  {
    key: 'totalTopics' as const,
    label: 'Topics',
    icon: BookOpen,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    href: '/admin/topics',
  },
  {
    key: 'publishedEditorials' as const,
    label: 'Editorials',
    icon: FileText,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    href: '/admin/editorials',
  },
  {
    key: 'totalUsers' as const,
    label: 'Users',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    href: '/admin/users',
  },
];

const QUICK_ACTIONS = [
  { label: 'New Subject', href: '/admin/subjects?action=new', icon: Layers },
  { label: 'New Topic', href: '/admin/topics?action=new', icon: BookOpen },
  { label: 'New Editorial', href: '/admin/editorials?action=new', icon: FileText },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all content, users, and platform settings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className="group rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all space-y-3"
            >
              <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{stats?.data[card.key] ?? 0}</p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.href} href={a.href}>
                <Button variant="outline" className="gap-2">
                  <PlusCircle className="w-4 h-4 text-indigo-600" />
                  {a.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Platform overview */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Platform overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { label: 'DSA content', href: '/admin/subjects?cat=DSA' },
            { label: 'CP content', href: '/admin/subjects?cat=CP' },
            { label: 'GATE content', href: '/admin/subjects?cat=GATE' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <span className="font-medium">{item.label}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
