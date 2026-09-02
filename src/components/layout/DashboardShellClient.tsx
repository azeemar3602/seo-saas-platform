"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

export interface ShellUser {
  name?: string | null;
  email?: string | null;
  isPlatformAdmin?: boolean;
}

export function DashboardShellClient({
  title,
  subtitle,
  user,
  children,
}: {
  title: string;
  subtitle?: string;
  user?: ShellUser;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isPlatformAdmin={user?.isPlatformAdmin} />
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isPlatformAdmin={user?.isPlatformAdmin}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} onMenuClick={() => setMobileOpen(true)} user={user} />
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
