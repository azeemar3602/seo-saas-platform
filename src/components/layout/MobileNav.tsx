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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/research", label: "Research", icon: Search },
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/pricing", label: "Plans", icon: CreditCard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/help", label: "Help", icon: LifeBuoy },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-72 bg-surface shadow-xl flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Rankwell</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-muted hover:text-foreground"
                )}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
