"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { apiFetch } from "@/lib/api/client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";

type DashboardData = {
  continueLearning: Array<{ id: string; progressPercent: number; topic: { title: string; subject: { name: string } } }>;
  recentlyViewed: Array<{ id: string; topic: { title: string; subject: { name: string } } }>;
  bookmarks: Array<{ id: string; topic?: { title: string } | null; editorial?: { title: string } | null }>;
  progressSummary: { completedCount: number; totalTopics: number; percent: number };
  streak: number;
  weeklyActivity: Array<{ date: string; count: number }>;
  recommendations: Array<{ id: string; title: string; subject: { name: string } }>;
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiFetch<DashboardData>("/api/v1/user/dashboard")
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[520px]" />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Dashboard" }]} />
      <div>
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Track streaks, continue where you left off, and discover what to study next.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Completed Topics" value={data.progressSummary.completedCount} hint={`out of ${data.progressSummary.totalTopics} total topics`} />
        <StatCard title="Overall Progress" value={`${data.progressSummary.percent}%`} hint="Based on completed topics" />
        <StatCard title="Daily Streak" value={data.streak} hint="Consecutive active days" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <ActivityChart data={data.weeklyActivity} />
        <Card>
          <CardHeader>
            <CardTitle>Continue learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.continueLearning.length ? (
              data.continueLearning.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-medium">{item.topic.title}</p>
                  <p className="text-sm text-slate-500">{item.topic.subject.name}</p>
                  <p className="mt-2 text-sm text-indigo-600">{item.progressPercent}% completed</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">You are caught up. Explore recommendations below.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recently viewed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentlyViewed.map((item) => (
              <div key={item.id}>
                <p className="font-medium">{item.topic.title}</p>
                <p className="text-sm text-slate-500">{item.topic.subject.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookmarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.bookmarks.map((item) => (
              <p key={item.id}>{item.topic?.title ?? item.editorial?.title}</p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended next topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recommendations.map((item) => (
              <div key={item.id}>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-slate-500">{item.subject.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
