
'use client';
// apps/web/src/app/dashboard/page.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Bookmark, TrendingUp, Flame,
  ArrowRight, CheckCircle2, Clock, BarChart2,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Client-side guard (middleware is the primary guard, this is belt-and-suspenders)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?from=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </main>
    );
  }

  if (!user) return null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting()}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ready to continue learning? Pick up where you left off.
          </p>
        </div>
        {(!user.emailVerified || !user.phoneVerified) && (
          <div className="flex items-center gap-2 text-xs bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-lg">
            <span>⚠️</span>
            <span>
              {!user.emailVerified && 'Email not verified. '}
              {!user.phoneVerified && 'Phone not verified. '}
            </span>
            <Link href="/settings" className="underline font-medium">Verify now</Link>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
            bg: 'bg-green-50 dark:bg-green-900/20',
            label: 'Topics Completed',
            value: '0',
            sub: 'Start a topic to track progress',
          },
          {
            icon: <Flame className="w-5 h-5 text-orange-500" />,
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            label: 'Day Streak',
            value: '0',
            sub: 'Learn something today!',
          },
          {
            icon: <Bookmark className="w-5 h-5 text-indigo-600" />,
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            label: 'Bookmarks',
            value: '0',
            sub: 'Save topics you want to revisit',
          },
          {
            icon: <Clock className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            label: 'Time Spent',
            value: '0h',
            sub: 'Track your study sessions',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Learning tracks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            href: '/dsa',
            icon: <BookOpen className="w-5 h-5" />,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            border: 'border-indigo-100 dark:border-indigo-900',
            title: 'DSA',
            desc: 'Arrays, Trees, Graphs, DP and more',
            progress: 0,
          },
          {
            href: '/cp',
            icon: <BarChart2 className="w-5 h-5" />,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-900',
            title: 'Competitive Programming',
            desc: 'Greedy, Binary Search, Number Theory',
            progress: 0,
          },
          {
            href: '/gate',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-purple-600',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-100 dark:border-purple-900',
            title: 'GATE CSE',
            desc: 'OS, DBMS, CN, TOC, COA',
            progress: 0,
          },
        ].map((track) => (
          <Link
            key={track.href}
            href={track.href}
            className={`group rounded-xl border ${track.border} bg-card p-5 hover:shadow-md transition-all space-y-4`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg ${track.bg} ${track.color} flex items-center justify-center`}>
                {track.icon}
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold">{track.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{track.desc}</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{track.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${track.color.replace('text-', 'bg-')}`}
                  style={{ width: `${track.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state — recently viewed */}
      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">No recent activity yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Start exploring topics and they&apos;ll appear here.
          </p>
        </div>
        <Link href="/dsa">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            Start with DSA <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

    </main>
  );
}

