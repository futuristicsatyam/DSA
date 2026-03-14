"use client";

import { TocItem } from "@/lib/markdown";

export function Toc({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <aside className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">On this page</h3>
      <nav className="space-y-2 text-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
