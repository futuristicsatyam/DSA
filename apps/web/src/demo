'use client';
// apps/web/src/app/admin/editorials/page.tsx

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, Pencil, Loader2, X, Eye, EyeOff,
  Save, Search, CheckCircle2, Clock,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  useAdminEditorials, useCreateEditorial,
  useUpdateEditorial, useDeleteEditorial, useAdminTopics,
} from '@/hooks/use-admin';
import { ConfirmDelete } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Editorial } from '@/lib/content-api';
import { cn } from '@/lib/utils';

function slugify(str: string) {
  return 'editorial-' + str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const schema = z.object({
  topicId: z.string().min(1, 'Topic required'),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  title: z.string().min(2, 'Title required'),
  summary: z.string().optional(),
  markdownContent: z.string().min(10, 'Content required'),
  tags: z.string().optional(), // comma-separated, split on save
  estimatedMinutes: z.coerce.number().optional(),
  published: z.boolean().default(false),
});
type FormValues = z.infer<typeof schema>;

const STARTER_MARKDOWN = `# Topic Title

Brief introduction to this topic.

## Prerequisites

- Item one
- Item two

## Core Concept

Explain the concept here. You can use **bold**, _italic_, and \`inline code\`.

\`\`\`cpp
// Code example
int main() {
    return 0;
}
\`\`\`

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Example   | O(n) | O(1)  |

> [!TIP]
> Add a useful tip here.
`;

function EditorialEditor({
  initial,
  defaultTopicId,
  onClose,
}: {
  initial?: Editorial;
  defaultTopicId?: string;
  onClose: () => void;
}) {
  const { data: topicsData } = useAdminTopics();
  const create = useCreateEditorial();
  const update = useUpdateEditorial();
  const isPending = create.isPending || update.isPending;
  const [preview, setPreview] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      topicId: initial?.topicId ?? defaultTopicId ?? '',
      slug: initial?.slug ?? '',
      title: initial?.title ?? '',
      summary: initial?.summary ?? '',
      markdownContent: initial?.markdownContent ?? STARTER_MARKDOWN,
      tags: initial?.tags?.join(', ') ?? '',
      estimatedMinutes: initial?.estimatedMinutes ?? undefined,
      published: initial?.published ?? false,
    },
  });

  const titleValue = watch('title');
  const markdownValue = watch('markdownContent');
  const publishedValue = watch('published');

  useEffect(() => {
    if (!initial) setValue('slug', slugify(titleValue));
  }, [titleValue, initial, setValue]);

  // Auto-save draft to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (markdownValue && markdownValue !== STARTER_MARKDOWN) {
        localStorage.setItem('admin-draft-editorial', markdownValue);
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [markdownValue]);

  const onSubmit = async (values: FormValues) => {
    const dto = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    if (initial) {
      await update.mutateAsync({ id: initial.id, dto });
    } else {
      await create.mutateAsync(dto);
    }
    localStorage.removeItem('admin-draft-editorial');
    onClose();
  };

  const topics = topicsData?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background shrink-0">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        <h2 className="font-semibold text-sm flex-1">
          {initial ? 'Edit editorial' : 'New editorial'}
        </h2>
        {autoSaved && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Draft saved
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreview(p => !p)}
          className="gap-1.5 text-xs"
        >
          {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {preview ? 'Editor' : 'Preview'}
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {initial ? 'Save' : 'Publish'}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Metadata sidebar */}
        <div className="w-64 border-r border-border p-4 space-y-4 overflow-y-auto shrink-0 hidden lg:block">
          <div className="space-y-1.5">
            <Label className="text-xs">Topic</Label>
            <select
              {...register('topicId')}
              className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select topic…</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            {errors.topicId && <p className="text-destructive text-xs">{errors.topicId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input className="h-8 text-xs" placeholder="Editorial title" {...register('title')} />
            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Slug</Label>
            <Input className="h-8 text-xs font-mono" placeholder="editorial-slug" {...register('slug')} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Summary</Label>
            <textarea
              {...register('summary')}
              rows={3}
              placeholder="Brief summary…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Tags (comma-separated)</Label>
            <Input className="h-8 text-xs" placeholder="arrays, dp, graphs" {...register('tags')} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" /> Est. minutes
            </Label>
            <Input className="h-8 text-xs" type="number" placeholder="15" {...register('estimatedMinutes')} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="published"
              {...register('published')}
              className="rounded border-input"
            />
            <Label htmlFor="published" className="text-xs cursor-pointer">
              Published
            </Label>
            {publishedValue && (
              <span className="text-xs text-green-600 font-medium ml-auto">Live</span>
            )}
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {preview ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownValue}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="px-4 py-2 border-b border-border bg-muted/30 shrink-0">
                <p className="text-xs text-muted-foreground font-mono">markdown</p>
              </div>
              <textarea
                value={markdownValue}
                onChange={e => setValue('markdownContent', e.target.value)}
                className="flex-1 p-4 font-mono text-sm bg-background resize-none focus:outline-none leading-relaxed"
                placeholder="Start writing markdown…"
                spellCheck={false}
              />
              {errors.markdownContent && (
                <p className="text-destructive text-xs px-4 py-1 border-t border-border">
                  {errors.markdownContent.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminEditorialsPage() {
  const searchParams = useSearchParams();
  const openNew = searchParams.get('action') === 'new';
  const defaultTopicId = searchParams.get('topicId') ?? undefined;

  const { data, isLoading } = useAdminEditorials();
  const deleteEditorial = useDeleteEditorial();

  const [editorOpen, setEditorOpen] = useState(openNew);
  const [editing, setEditing] = useState<Editorial | null>(null);
  const [search, setSearch] = useState('');

  const editorials = (data?.data ?? []).filter(e =>
    search ? e.title.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">Editorials</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.total ?? 0} editorials
          </p>
        </div>
        <Button
          onClick={() => { setEditing(null); setEditorOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> New editorial
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search editorials…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Tags</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-7 w-16" /></td>
                </tr>
              ))
            ) : editorials.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No editorials yet. Create your first one.
                </td>
              </tr>
            ) : (
              editorials.map(e => (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{e.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {e.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      e.published
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                    )}>
                      {e.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditing(e); setEditorOpen(true); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <ConfirmDelete
                        title={`Delete "${e.title}"?`}
                        description="This will permanently remove this editorial."
                        onConfirm={() => deleteEditorial.mutate(e.id)}
                        isPending={deleteEditorial.isPending}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editorOpen && (
        <EditorialEditor
          initial={editing ?? undefined}
          defaultTopicId={defaultTopicId}
          onClose={() => { setEditorOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
