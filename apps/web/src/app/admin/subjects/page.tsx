'use client';
// apps/web/src/app/admin/subjects/page.tsx

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Loader2, X, Search } from 'lucide-react';
import {
  useAdminSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject,
} from '@/hooks/use-admin';
import { ConfirmDelete } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CategoryType } from '@/lib/content-api';
import type { Subject } from '@/lib/content-api';
import { cn } from '@/lib/utils';

const CATEGORIES: CategoryType[] = ['DSA', 'CP', 'GATE'];
const CATEGORY_COLORS: Record<CategoryType, string> = {
  DSA:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  CP:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  GATE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  description: z.string().optional(),
  categoryType: z.enum(['DSA', 'CP', 'GATE']),
});
type FormValues = z.infer<typeof schema>;

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function SubjectForm({
  initial,
  onClose,
}: {
  initial?: Subject;
  onClose: () => void;
}) {
  const create = useCreateSubject();
  const update = useUpdateSubject();
  const isPending = create.isPending || update.isPending;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
      categoryType: initial?.categoryType ?? 'DSA',
    },
  });

  const nameValue = watch('name');
  useEffect(() => {
    if (!initial) setValue('slug', slugify(nameValue));
  }, [nameValue, initial, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (initial) {
      await update.mutateAsync({ id: initial.id, dto: values });
    } else {
      await create.mutateAsync(values);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-background rounded-xl border border-border shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">{initial ? 'Edit subject' : 'New subject'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Arrays" {...register('name')} />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input placeholder="e.g. arrays" {...register('slug')} />
            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="Short description (optional)" {...register('description')} />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <div className="flex gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('categoryType', c)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                    watch('categoryType') === c
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-border text-muted-foreground hover:bg-accent',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {initial ? 'Save changes' : 'Create subject'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSubjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catFilter = (searchParams.get('cat') as CategoryType | null) ?? undefined;
  const openNew = searchParams.get('action') === 'new';

  const { data, isLoading } = useAdminSubjects(catFilter);
  const deleteSubject = useDeleteSubject();

  const [formOpen, setFormOpen] = useState(openNew);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [search, setSearch] = useState('');

  const subjects = (data?.data ?? []).filter(s =>
    search ? s.name.toLowerCase().includes(search.toLowerCase()) : true,
  );

  const openEdit = (s: Subject) => { setEditing(s); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.total ?? 0} subjects across DSA, CP, and GATE
          </p>
        </div>
        <Button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> New subject
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {([undefined, ...CATEGORIES] as const).map(c => (
            <button
              key={c ?? 'all'}
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                c ? p.set('cat', c) : p.delete('cat');
                router.push(`/admin/subjects?${p.toString()}`);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                catFilter === c
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-border text-muted-foreground hover:bg-accent',
              )}
            >
              {c ?? 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Topics</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-12 rounded-full" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-8" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-7 w-16" /></td>
                </tr>
              ))
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No subjects found. Create your first one.
                </td>
              </tr>
            ) : (
              subjects.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground font-mono text-xs">{s.slug}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', CATEGORY_COLORS[s.categoryType])}>
                      {s.categoryType}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {s.topics?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(s)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <ConfirmDelete
                        title={`Delete "${s.name}"?`}
                        description="This will also delete all topics and editorials under this subject."
                        onConfirm={() => deleteSubject.mutate(s.id)}
                        isPending={deleteSubject.isPending}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form modal */}
      {formOpen && (
        <SubjectForm initial={editing ?? undefined} onClose={closeForm} />
      )}
    </div>
  );
}
