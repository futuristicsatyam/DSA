'use client';
// apps/web/src/app/admin/topics/page.tsx

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Loader2, X, Search, FileText } from 'lucide-react';
import {
  useAdminTopics, useCreateTopic, useUpdateTopic, useDeleteTopic, useAdminSubjects,
} from '@/hooks/use-admin';
import { ConfirmDelete } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Topic } from '@/lib/content-api';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
const DIFF_COLORS: Record<string, string> = {
  BEGINNER: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  ADVANCED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const schema = z.object({
  subjectId: z.string().min(1, 'Subject required'),
  title: z.string().min(2, 'Title required'),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  shortDescription: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  orderIndex: z.coerce.number().optional(),
});
type FormValues = z.infer<typeof schema>;

function TopicForm({ initial, onClose }: { initial?: Topic; onClose: () => void }) {
  const { data: subjectsData } = useAdminSubjects();
  const create = useCreateTopic();
  const update = useUpdateTopic();
  const isPending = create.isPending || update.isPending;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subjectId: initial?.subjectId ?? '',
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      shortDescription: initial?.shortDescription ?? '',
      difficulty: initial?.difficulty ?? undefined,
      orderIndex: initial?.orderIndex ?? undefined,
    },
  });

  const titleValue = watch('title');
  useEffect(() => {
    if (!initial) setValue('slug', slugify(titleValue));
  }, [titleValue, initial, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (initial) {
      await update.mutateAsync({ id: initial.id, dto: values });
    } else {
      await create.mutateAsync(values);
    }
    onClose();
  };

  const subjects = subjectsData?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-background rounded-xl border border-border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background">
          <h2 className="font-semibold">{initial ? 'Edit topic' : 'New topic'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <select
              {...register('subjectId')}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a subject…</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.categoryType} — {s.name}</option>
              ))}
            </select>
            {errors.subjectId && <p className="text-destructive text-xs">{errors.subjectId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="e.g. Introduction to Arrays" {...register('title')} />
            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input placeholder="e.g. arrays-intro" {...register('slug')} />
            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Short description</Label>
            <Input placeholder="One-line summary" {...register('shortDescription')} />
          </div>

          <div className="space-y-1.5">
            <Label>Difficulty</Label>
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setValue('difficulty', d)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    watch('difficulty') === d
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-border text-muted-foreground hover:bg-accent',
                  )}
                >
                  {d[0] + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Order index</Label>
            <Input type="number" placeholder="1, 2, 3…" {...register('orderIndex')} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {initial ? 'Save changes' : 'Create topic'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTopicsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openNew = searchParams.get('action') === 'new';
  const subjectFilter = searchParams.get('subject') ?? undefined;

  const { data, isLoading } = useAdminTopics(subjectFilter);
  const { data: subjectsData } = useAdminSubjects();
  const deleteTopic = useDeleteTopic();

  const [formOpen, setFormOpen] = useState(openNew);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [search, setSearch] = useState('');

  const topics = (data?.data ?? []).filter(t =>
    search ? t.title.toLowerCase().includes(search.toLowerCase()) : true,
  );

  const subjects = subjectsData?.data ?? [];
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? '—';

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Topics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data?.total ?? 0} topics</p>
        </div>
        <Button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> New topic
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search topics…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Subject</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Difficulty</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-8" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-7 w-16" /></td>
                </tr>
              ))
            ) : topics.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No topics found.
                </td>
              </tr>
            ) : (
              topics.map(t => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{t.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                    {getSubjectName(t.subjectId)}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {t.difficulty ? (
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', DIFF_COLORS[t.difficulty])}>
                        {t.difficulty[0] + t.difficulty.slice(1).toLowerCase()}
                      </span>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {t.orderIndex ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/editorials?action=new&topicId=${t.id}`}>
                        <Button variant="ghost" size="icon" title="Add editorial" className="text-muted-foreground hover:text-indigo-600">
                          <FileText className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditing(t); setFormOpen(true); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <ConfirmDelete
                        title={`Delete "${t.title}"?`}
                        description="This will also delete its editorial."
                        onConfirm={() => deleteTopic.mutate(t.id)}
                        isPending={deleteTopic.isPending}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formOpen && <TopicForm initial={editing ?? undefined} onClose={() => { setFormOpen(false); setEditing(null); }} />}
    </div>
  );
}
