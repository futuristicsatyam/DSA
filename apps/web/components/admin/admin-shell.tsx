import { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-slate-500">Manage platform content, editorial workflow, and user access.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
