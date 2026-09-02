import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { TrendChart } from "@/components/charts/TrendChart";
import { getProject, getHealthTrend, getAuditCategories, getKeywords, getBacklinkSummary } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Search, Link2, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

export default async function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const trend = getHealthTrend(30);
  const categories = getAuditCategories(id).slice(0, 4);
  const keywords = getKeywords(id).sort((a, b) => a.position - b.position).slice(0, 5);
  const backlinkSummary = getBacklinkSummary(id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-5">
          <ScoreGauge score={project.healthScore} size={88} />
          <div>
            <p className="text-sm font-semibold">Site health</p>
            <p className="text-xs text-muted mt-1">
              {project.healthDelta > 0 ? "+" : ""}
              {project.healthDelta} pts vs. last audit
            </p>
            <Link href={`/projects/${id}/audit`} className="text-xs font-semibold text-primary hover:underline mt-2 inline-block">
              View full audit →
            </Link>
          </div>
        </Card>
        <StatCard
          label="Est. monthly traffic"
          value={formatNumber(project.trafficEstimate)}
          delta={project.trafficDelta}
          icon={TrendingUp}
          iconColor="text-success"
          iconBg="bg-success-soft"
        />
        <StatCard
          label="Tracked keywords"
          value={formatNumber(project.keywordCount)}
          delta={project.keywordDelta}
          deltaSuffix=""
          icon={Search}
          iconColor="text-info"
          iconBg="bg-info-soft"
        />
      </div>

      <Card>
        <CardHeader title="Health score trend" subtitle="Last 30 days" />
        <div className="px-3 pb-4">
          <TrendChart data={trend} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Audit categories" action={<Link href={`/projects/${id}/audit`} className="text-xs font-semibold text-primary hover:underline">See all →</Link>} />
          <div className="px-5 pb-5 pt-2 space-y-3">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="text-sm text-muted">{c.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.score >= 80 ? "bg-success" : c.score >= 50 ? "bg-warning" : "bg-danger"}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-7 text-right">{c.score}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Top ranking keywords" action={<Link href={`/projects/${id}/keywords`} className="text-xs font-semibold text-primary hover:underline">See all →</Link>} />
          <div className="px-5 pb-4 pt-2 space-y-2.5">
            {keywords.map((k) => (
              <div key={k.id} className="flex items-center justify-between text-sm">
                <span className="truncate mr-2">{k.keyword}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted">{formatNumber(k.volume)}/mo</span>
                  <span className="font-semibold w-6 text-right">#{k.position}</span>
                  <span className={`flex items-center text-[10px] font-semibold ${k.positionDelta >= 0 ? "text-success" : "text-danger"}`}>
                    {k.positionDelta >= 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                    {Math.abs(k.positionDelta)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Backlink profile" action={<Link href={`/projects/${id}/backlinks`} className="text-xs font-semibold text-primary hover:underline">See all →</Link>} />
        <div className="px-5 pb-5 pt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-lg font-bold">{formatNumber(backlinkSummary.totalBacklinks)}</p>
            <p className="text-[11px] text-muted flex items-center gap-1"><Link2 className="w-3 h-3" />Total backlinks</p>
          </div>
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-lg font-bold">{formatNumber(backlinkSummary.referringDomains)}</p>
            <p className="text-[11px] text-muted">Referring domains</p>
          </div>
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-lg font-bold">{backlinkSummary.avgAuthority}</p>
            <p className="text-[11px] text-muted">Avg. authority</p>
          </div>
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-lg font-bold">{backlinkSummary.followRatio}%</p>
            <p className="text-[11px] text-muted">Dofollow ratio</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
