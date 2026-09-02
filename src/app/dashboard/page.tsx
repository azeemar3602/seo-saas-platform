import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { TrendChart } from "@/components/charts/TrendChart";
import {
  getPortfolioTotals,
  getHealthTrend,
  activityFeed,
  getTodayDigest,
  projects,
} from "@/lib/mock-data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Activity, Gauge, Link2, TrendingUp, Search, FileWarning, MailCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const totals = getPortfolioTotals();
  const trend = getHealthTrend(30);
  const digest = getTodayDigest();

  // rough monthly ROI estimate: traffic value at $2.10 avg CPC equivalent
  const roiEstimate = totals.totalTraffic * 2.1;

  return (
    <DashboardShell title="Dashboard" subtitle="Portfolio overview across all projects">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Avg. health score"
          value={`${totals.avgHealthScore}`}
          delta={3}
          icon={Gauge}
          iconColor="text-primary"
          iconBg="bg-primary-soft"
        />
        <StatCard
          label="Est. monthly traffic"
          value={formatNumber(totals.totalTraffic)}
          delta={7.4}
          icon={TrendingUp}
          iconColor="text-success"
          iconBg="bg-success-soft"
        />
        <StatCard
          label="Tracked keywords"
          value={formatNumber(totals.totalKeywords)}
          delta={12}
          icon={Search}
          iconColor="text-info"
          iconBg="bg-info-soft"
        />
        <StatCard
          label="Total backlinks"
          value={formatNumber(totals.totalBacklinks)}
          delta={4.8}
          icon={Link2}
          iconColor="text-warning"
          iconBg="bg-warning-soft"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Health score trend"
            subtitle="Blended average across all active projects · last 30 days"
          />
          <div className="px-3 pb-4">
            <TrendChart data={trend} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Estimated organic value" subtitle="Traffic value at category avg. CPC" />
          <div className="px-5 pb-5">
            <p className="text-3xl font-bold tracking-tight mt-2">{formatCurrency(roiEstimate)}</p>
            <p className="text-xs text-muted mt-1">per month, if this traffic were paid</p>
            <div className="mt-5 space-y-3">
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted truncate">{p.name}</span>
                  <span className="font-semibold">{formatCurrency(p.trafficEstimate * 2.1)}</span>
                </div>
              ))}
            </div>
            <Link
              href="/projects"
              className="mt-4 inline-block text-xs font-semibold text-primary hover:underline"
            >
              View all projects →
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent activity" subtitle="Latest events across your portfolio" />
          <div className="divide-y divide-border">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.severity === "success"
                      ? "bg-success-soft text-success"
                      : item.severity === "warning"
                      ? "bg-warning-soft text-warning"
                      : item.severity === "danger"
                      ? "bg-danger-soft text-danger"
                      : "bg-info-soft text-info"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <Badge variant="neutral">{item.projectName}</Badge>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{item.description}</p>
                </div>
                <span className="text-[11px] text-muted shrink-0 mt-1">
                  {new Date(item.timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Today's digest" subtitle={digest.date} />
          <div className="px-5 py-4 grid grid-cols-2 gap-3">
            {digest.items.map((item) => (
              <div key={item.label} className="bg-surface-muted rounded-lg p-3">
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-[11px] text-muted mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted">
              <FileWarning className="w-3.5 h-3.5 text-warning" />
              2 critical issues need attention on Soul of Scents
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <MailCheck className="w-3.5 h-3.5 text-success" />
              Monthly report ready to send for 2 clients
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
