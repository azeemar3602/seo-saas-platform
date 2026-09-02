import { DashboardShell } from "@/components/layout/DashboardShell";
import { agentDefinitions, agentRuns } from "@/lib/mock-data";
import { AgentsClient } from "./AgentsClient";

export default function AgentsPage() {
  return (
    <DashboardShell title="AI Agents" subtitle="Automate research, content, and outreach">
      <AgentsClient agents={agentDefinitions} runs={agentRuns} />
    </DashboardShell>
  );
}
