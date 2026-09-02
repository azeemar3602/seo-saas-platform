import { Bell, ChevronDown, Menu, Search } from "lucide-react";

export function Topbar({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}) {
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
        <button className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
            AZ
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted hidden md:block" />
        </button>
      </div>
    </header>
  );
}
