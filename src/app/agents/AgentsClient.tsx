"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { AgentDefinition, AgentRun } from "@/lib/types";
import { Mail, FileText, Radar, Search, ArrowRight, Clock, CheckCircle2, Loader2 } from "lucide-react";

const icons = { Mail, FileText, Radar, Search } as const;

export function AgentsClient({
  agents,
  runs,
}: {
  agents: AgentDefinition[];
  runs: AgentRun[];
}) {
  const [active, setActive] = useState<AgentDefinition>(agents[0]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<AgentRun | null>(null);

  function handleRun(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setLastResult({
        id: `local-${Date.now()}`,
        agentId: active.id,
        projectName: "Preview run",
        input,
        status: "completed",
        createdAt: new Date().toISOString(),
        summary: `${active.name} finished analyzing "${input}". This is a UI preview — connect the agent's API route to your LLM provider to generate real output.`,
        output:
          "Real output will appear here once this agent is wired to your backend (see README.md → \"Connecting real data\"). It receives the input above, calls your LLM + SEO data APIs, and returns structured results.",
      });
      setSubmitting(false);
    }, 900);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 space-y-3">
        {agents.map((agent) => {
          const Icon = icons[agent.icon as keyof typeof icons];
          const isActive = active.id === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => {
                setActive(agent);
                setLastResult(null);
                setInput("");
              }}
              className={`w-full text-left rounded-xl border p-4 transition-colors ${
                isActive ? "border-primary bg-primary-soft/40" : "border-border bg-surface hover:border-primary/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${agent.color}1a`, color: agent.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{agent.name}</p>
                  <p className="text-xs text-muted mt-0.5">{agent.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${active.color}1a`, color: active.color }}
            >
              {(() => {
                const Icon = icons[active.icon as keyof typeof icons];
                return <Icon className="w-4 h-4" />;
              })()}
            </div>
            <div>
              <p className="text-sm font-semibold">{active.name}</p>
              <p className="text-xs text-muted">{active.description}</p>
            </div>
          </div>
          <form onSubmit={handleRun} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={active.inputPlaceholder}
              className="flex-1 bg-surface-muted rounded-lg px-3 h-11 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-semibold px-5 rounded-lg transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Run
            </button>
          </form>
          <p className="text-[11px] text-muted mt-2">{active.inputLabel}</p>

          {lastResult && (
            <div className="mt-4 border border-border rounded-lg p-4 bg-surface-muted">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold">Preview result</span>
              </div>
              <p className="text-xs text-muted mb-2">{lastResult.summary}</p>
              <pre className="text-xs whitespace-pre-wrap bg-surface rounded-md p-3 border border-border">
                {lastResult.output}
              </pre>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Run history" subtitle="Recent agent runs across all projects" />
          <div className="divide-y divide-border">
            {runs.map((run) => {
              const agent = agents.find((a) => a.id === run.agentId);
              const Icon = agent ? icons[agent.icon as keyof typeof icons] : Clock;
              return (
                <div key={run.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${agent?.color ?? "#6b7086"}1a`, color: agent?.color ?? "#6b7086" }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{agent?.name ?? run.agentId}</p>
                        <Badge variant="neutral">{run.projectName}</Badge>
                        <Badge variant={run.status === "completed" ? "success" : run.status === "running" ? "info" : "danger"}>
                          {run.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted mt-1">{run.summary}</p>
                    </div>
                    <span className="text-[11px] text-muted shrink-0 mt-1">
                      {new Date(run.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
