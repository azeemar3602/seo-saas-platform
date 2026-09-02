import { auth } from "@/auth";
import { DashboardShellClient } from "./DashboardShellClient";

// Server wrapper: fetches the session (auth() reads the JWT — no better-sqlite3
// call here, safe in any Node runtime) and hands it down as plain props to the
// client shell. Every existing page imports { DashboardShell } from this file
// unchanged — only this file's internals changed to add real session data.
export async function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <DashboardShellClient title={title} subtitle={subtitle} user={session?.user}>
      {children}
    </DashboardShellClient>
  );
}
