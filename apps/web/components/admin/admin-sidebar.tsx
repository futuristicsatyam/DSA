import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/subjects", label: "Manage Subjects" },
  { href: "/admin/topics", label: "Manage Topics" },
  { href: "/admin/editorials", label: "Manage Editorials" },
  { href: "/admin/users", label: "Manage Users" }
];

export function AdminSidebar() {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <nav className="space-y-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
