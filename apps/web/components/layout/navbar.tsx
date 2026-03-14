"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui";
import { NAV_LINKS, API_URL } from "@/lib/constants";
import { ThemeToggle } from "./theme-toggle";
import { SearchModal } from "./search-modal";

type MeResponse = {
  user: {
    id: string;
    name: string;
    role: "USER" | "ADMIN";
  };
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<MeResponse["user"] | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/auth/me`, {
      credentials: "include"
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json();
        return payload.data.user as MeResponse["user"];
      })
      .then((resolvedUser) => setUser(resolvedUser))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "/login";
  }

  const authActions = user ? (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <SearchModal />
      <Link href="/dashboard">
        <Button variant="ghost">Dashboard</Button>
      </Link>
      <Link href="/profile">
        <Button variant="ghost">Profile</Button>
      </Link>
      {user.role === "ADMIN" ? (
        <Link href="/admin">
          <Button variant="ghost">Admin</Button>
        </Link>
      ) : null}
      <Button onClick={logout}>Logout</Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <SearchModal />
      <Link href="/login">
        <Button variant="ghost">Login</Button>
      </Link>
      <Link href="/signup">
        <Button>Sign Up</Button>
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          DSA Suite
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">{authActions}</div>

        <button className="md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <ThemeToggle />
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost">Profile</Button>
                  </Link>
                  <Button onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
