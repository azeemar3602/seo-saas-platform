"use client";

import { useState } from "react";
import { Bell, ChevronDown, Menu, Search, LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";
import type { ShellUser } from "./DashboardShellClient";

function initials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function Topbar({
  title,
  subtitle,
  onMenuClick,
  user,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  user?: ShellUser;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-16 px-4 lg:px-8 border-b border-border bg-surface/90 backdrop-blur">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 -ml-1 rounded-lg flex items-center justify-center text-muted hover:bg-surface-muted hover:text-foreground shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold tracking-tight truncate">{title}</h1>
          {subtitle ? <p className="text-xs text-muted truncate">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2 bg-surface-muted rounded-lg px-3 py-1.5 text-sm text-muted w-56">
          <Search className="w-4 h-4" />
          <span className="truncate">Search projects, keywords…</span>
        </div>
        <button className="relative w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-muted hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-danger" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
              {initials(user?.name, user?.email)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted hidden md:block" />
          </button>

          {menuOpen ? (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 w-52 bg-surface border border-border rounded-lg shadow-lg py-1.5">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium truncate">{user?.name ?? "Signed in"}</p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                </div>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-soft"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </form>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
