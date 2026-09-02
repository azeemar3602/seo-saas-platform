import { DashboardShell } from "@/components/layout/DashboardShell";
import { HelpClient } from "./HelpClient";

export default function HelpPage() {
  return (
    <DashboardShell title="Help & troubleshooting" subtitle="Platform-specific fixes for common issues">
      <HelpClient />
    </DashboardShell>
  );
}
