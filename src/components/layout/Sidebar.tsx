"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Search,
  Bot,
  CreditCard,
  BookOpen,
  LifeBuoy,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/research", label: "Research", icon: Search },
  { href: "/agents", label: "AI Agents", icon: Bot },
];

const bottomNav = [
  { href: "/pricing", label: "Plans", icon: CreditCard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/help", label: "Help", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-surface h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-semibold text-[15px] tracking-tight">Rankwell</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        {bottomNav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-3 rounded-lg bg-primary-soft p-3">
          <p className="text-xs font-semibold text-primary">Trial ends in 9 days</p>
          <p className="text-[11px] text-muted mt-0.5">Upgrade to keep automated audits running.</p>
          <Link
            href="/pricing"
            className="mt-2 inline-block text-[11px] font-semibold text-primary hover:underline"
          >
            View plans →
          </Link>
        </div>
      </div>
    </aside>
  );
}
