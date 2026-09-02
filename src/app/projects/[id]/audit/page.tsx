import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { getProject, getAuditCategories, getAuditIssues } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const severityMeta = {
  critical: { icon: AlertTriangle, variant: "danger" as const, label: "Critical" },
  warning: { icon: AlertCircle, variant: "warning" as const, label: "Warning" },
  notice: { icon: Info, variant: "info" as const, label: "Notice" },
};

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const categories = getAuditCategories(id);
  const issues = getAuditIssues(id);
  const critical = issues.filter((i) => i.severity === "critical");
  const warnings = issues.filter((i) => i.severity === "warning");
  const notices = issues.filter((i) => i.severity === "notice");

  return (
    <div className="space-y-4">
      <Card className="p-6 flex flex-col md:flex-row items-center gap-6">
        <ScoreGauge score={project.healthScore} size={110} />
        <div className="flex-1">
          <h2 className="font-semibold">Site health score</h2>
          <p className="text-sm text-muted mt-1">
            Based on {categories.length} categories, {issues.length} issues found across the last full crawl.
          </p>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-sm"><span className="w-2 h-2 rounded-full bg-danger" />{critical.length} critical</span>
            <span className="flex items-center gap-1.5 text-sm"><span className="w-2 h-2 rounded-full bg-warning" />{warnings.length} warnings</span>
            <span className="flex items-center gap-1.5 text-sm"><span className="w-2 h-2 rounded-full bg-info" />{notices.length} notices</span>
          </div>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-lg shrink-0 transition-colors">
          Re-run audit
        </button>
      </Card>

      <Card>
        <CardHeader title="Category breakdown" />
        <div className="px-5 pb-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((c) => (
            <div key={c.name} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.name}</span>
                <span
                  className={`text-sm font-bold ${
                    c.score >= 80 ? "text-success" : c.score >= 50 ? "text-warning" : "text-danger"
                  }`}
                >
                  {c.score}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full ${c.score >= 80 ? "bg-success" : c.score >= 50 ? "bg-warning" : "bg-danger"}`}
                  style={{ width: `${c.score}%` }}
                />
              </div>
              <div className="flex gap-3 mt-2 text-[11px] text-muted">
                <span>{c.passed} passed</span>
                <span>{c.warnings} warnings</span>
                <span>{c.critical} critical</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Issues" subtitle="Ranked by severity — fix critical issues first" />
        <div className="divide-y divide-border">
          {issues.map((issue) => {
            const meta = severityMeta[issue.severity];
            const Icon = meta.icon;
            return (
              <div key={issue.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      issue.severity === "critical"
                        ? "bg-danger-soft text-danger"
                        : issue.severity === "warning"
                        ? "bg-warning-soft text-warning"
                        : "bg-info-soft text-info"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{issue.title}</p>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <Badge variant="neutral">{issue.affectedUrls} URLs</Badge>
                    </div>
                    <p className="text-xs text-muted mt-1">{issue.description}</p>
                    <div className="mt-2 bg-surface-muted rounded-lg p-3">
                      <p className="text-[11px] font-semibold text-foreground mb-1">How to fix</p>
                      <p className="text-xs text-muted">{issue.howToFix}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
