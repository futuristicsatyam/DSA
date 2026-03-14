"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: Array<{ href?: string; label: string }> }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900 dark:hover:text-slate-100">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-slate-100">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="size-4" />}
        </div>
      ))}
    </div>
  );
}
