
'use client';
// apps/web/src/components/markdown-renderer.tsx

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { Copy, Check, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import styles in your layout or globals.css:
// import 'highlight.js/styles/github-dark.css'
// import 'katex/dist/katex.min.css'

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface MarkdownRendererProps {
  content: string;
  showToc?: boolean;
  className?: string;
}

// ── Copy button for code blocks ───────────────────────────────────────────────
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={cn(
        'absolute top-3 right-3 p-1.5 rounded-md text-xs flex items-center gap-1',
        'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors',
        'opacity-0 group-hover:opacity-100 focus:opacity-100',
      )}
      aria-label="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

// ── Extract ToC from markdown ─────────────────────────────────────────────────
function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const toc: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[`*_]/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      toc.push({ id, text, level });
    }
  }
  return toc;
}

// ── Table of Contents sidebar ─────────────────────────────────────────────────
function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const headings = document.querySelectorAll('h1[id],h2[id],h3[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        <BookOpen className="w-3.5 h-3.5" />
        On this page
      </div>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'block text-sm py-0.5 transition-colors hover:text-indigo-600',
            item.level === 1 && 'font-medium',
            item.level === 2 && 'pl-3 text-muted-foreground',
            item.level === 3 && 'pl-6 text-xs text-muted-foreground',
            active === item.id ? 'text-indigo-600 font-medium' : '',
          )}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MarkdownRenderer({
  content,
  showToc = true,
  className,
}: MarkdownRendererProps) {
  const toc = showToc ? extractToc(content) : [];

  return (
    <div className={cn('flex gap-8', className)}>
      {/* Main content */}
      <article className="flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
        prose-code:text-indigo-600 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-950/30
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
        prose-pre:p-0 prose-pre:bg-transparent
        prose-blockquote:border-l-indigo-400 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-950/20
        prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
        prose-table:text-sm prose-th:bg-muted prose-th:px-4 prose-th:py-2
        prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-border
        prose-img:rounded-xl prose-img:shadow-md
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeSlug]}
          components={{
            // Code block with copy button
            pre({ children, ...props }) {
              const codeEl = (children as React.ReactElement)?.props;
              const code = typeof codeEl?.children === 'string' ? codeEl.children : '';
              return (
                <div className="relative group my-4 rounded-xl overflow-hidden border border-border shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/10">
                    <span className="text-xs text-zinc-400 font-mono">
                      {codeEl?.className?.replace('language-', '') || 'code'}
                    </span>
                    <CopyButton code={code} />
                  </div>
                  <pre
                    {...props}
                    className="!m-0 !rounded-none !bg-zinc-950 overflow-x-auto p-4 text-sm leading-relaxed"
                  >
                    {children}
                  </pre>
                </div>
              );
            },
            // Callout-style blockquote — detect [!NOTE], [!WARNING], [!TIP]
            blockquote({ children, ...props }) {
              const text = (children as React.ReactElement[])?.[0]?.props?.children;
              const str = Array.isArray(text) ? text.join('') : String(text ?? '');
              const type = str.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i)?.[1]?.toUpperCase();

              const styles: Record<string, string> = {
                NOTE: 'border-blue-400 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200',
                TIP: 'border-green-400 bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-200',
                WARNING: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-900 dark:text-yellow-200',
                IMPORTANT: 'border-purple-400 bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-200',
              };
              const icons: Record<string, string> = {
                NOTE: 'ℹ️', TIP: '💡', WARNING: '⚠️', IMPORTANT: '📌',
              };

              if (type && styles[type]) {
                return (
                  <div className={cn('not-prose border-l-4 px-4 py-3 rounded-r-lg my-4 text-sm', styles[type])}>
                    <p className="font-semibold mb-1">{icons[type]} {type}</p>
                    <div>{children}</div>
                  </div>
                );
              }

              return <blockquote {...props}>{children}</blockquote>;
            },
            // Responsive tables
            table({ children, ...props }) {
              return (
                <div className="not-prose overflow-x-auto my-6 rounded-xl border border-border">
                  <table {...props} className="w-full text-sm border-collapse">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children, ...props }) {
              return (
                <th
                  {...props}
                  className="bg-muted px-4 py-2.5 text-left font-semibold text-sm border-b border-border"
                >
                  {children}
                </th>
              );
            },
            td({ children, ...props }) {
              return (
                <td {...props} className="px-4 py-2.5 border-b border-border last:border-0">
                  {children}
                </td>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* ToC sidebar */}
      {showToc && toc.length > 0 && (
        <aside className="hidden xl:block w-56 flex-shrink-0">
          <div className="sticky top-20">
            <TableOfContents items={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
