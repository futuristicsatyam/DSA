import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} DSA Suite. Built for deep learning and fast progress.</p>
        <div className="flex items-center gap-4">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/dsa">DSA</Link>
          <Link href="/cp">CP</Link>
          <Link href="/gate">GATE CSE</Link>
        </div>
      </div>
    </footer>
  );
}
