import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[380px]">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center">
            <Sparkles className="w-[18px] h-[18px]" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Rankwell</span>
        </Link>

        <div className="bg-surface border border-border rounded-xl p-7">
          <h1 className="text-lg font-semibold tracking-tight text-center">{title}</h1>
          <p className="text-sm text-muted text-center mt-1 mb-6">{subtitle}</p>
          {children}
        </div>

        <p className="text-center text-xs text-muted mt-5">{footer}</p>
      </div>
    </div>
  );
}
