import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { projects } from "@/lib/mock-data";
import { formatNumber, trendColor } from "@/lib/utils";
import { ArrowDown, ArrowUp, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <DashboardShell title="Projects" subtitle={`${projects.length} sites being tracked`}>
      <div className="flex items-center justify-end mb-4">
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`}>
            <Card className="p-5 hover:border-primary/40 transition-colors h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {p.favicon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted flex items-center gap-1 truncate">
                      {p.domain}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </p>
                  </div>
                </div>
                <ScoreGauge score={p.healthScore} size={56} />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5">
                <div>
                  <p className="text-[11px] text-muted">Traffic</p>
                  <p className="text-sm font-semibold">{formatNumber(p.trafficEstimate)}</p>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${trendColor(p.trafficDelta)}`}>
                    {p.trafficDelta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                    {Math.abs(p.trafficDelta)}%
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-muted">Keywords</p>
                  <p className="text-sm font-semibold">{formatNumber(p.keywordCount)}</p>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${trendColor(p.keywordDelta)}`}>
                    {p.keywordDelta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                    {Math.abs(p.keywordDelta)}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-muted">Backlinks</p>
                  <p className="text-sm font-semibold">{formatNumber(p.backlinkCount)}</p>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${trendColor(p.backlinkDelta)}`}>
                    {p.backlinkDelta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                    {Math.abs(p.backlinkDelta)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <Badge variant="neutral">{p.cms}</Badge>
                <Badge variant={p.plan === "Agency" ? "primary" : "neutral"}>{p.plan}</Badge>
              </div>
            </Card>
          </Link>
        ))}

        <button className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 py-10 text-muted hover:border-primary/40 hover:text-primary transition-colors">
          <Plus className="w-6 h-6" />
          <span className="text-sm font-medium">Add a new project</span>
        </button>
      </div>
    </DashboardShell>
  );
}
