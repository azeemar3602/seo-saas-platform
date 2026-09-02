import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RankDistributionChart } from "@/components/charts/RankDistributionChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { getProject, getKeywords, getRankDistribution } from "@/lib/mock-data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus, Sparkles } from "lucide-react";

const intentVariant = {
  informational: "info" as const,
  commercial: "warning" as const,
  transactional: "success" as const,
  navigational: "neutral" as const,
};

export default async function KeywordsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const keywords = getKeywords(id).sort((a, b) => a.position - b.position);
  const distribution = getRankDistribution(id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Rank distribution" subtitle={`${keywords.length} tracked keywords`} />
          <div className="px-3 pb-4">
            <RankDistributionChart data={distribution} />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-muted">Keyword opportunity</p>
          <div className="flex items-center gap-2 mt-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">modular sofa small space</p>
          </div>
          <p className="text-xs text-muted mt-1">2,900 vol · KD 24 · currently unranked</p>
          <button className="mt-4 w-full bg-primary-soft text-primary text-sm font-semibold py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
            Add to tracking
          </button>
        </Card>
      </div>

      <Card>
        <CardHeader title="All keywords" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted uppercase tracking-wide border-y border-border">
                <th className="px-5 py-2.5 font-medium">Keyword</th>
                <th className="px-3 py-2.5 font-medium">Position</th>
                <th className="px-3 py-2.5 font-medium">Volume</th>
                <th className="px-3 py-2.5 font-medium">Difficulty</th>
                <th className="px-3 py-2.5 font-medium">CPC</th>
                <th className="px-3 py-2.5 font-medium">Intent</th>
                <th className="px-3 py-2.5 font-medium">Trend</th>
                <th className="px-5 py-2.5 font-medium">URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keywords.map((k) => (
                <tr key={k.id} className="hover:bg-surface-muted/50">
                  <td className="px-5 py-3 font-medium max-w-[220px] truncate">
                    <div className="flex items-center gap-1.5">
                      {k.keyword}
                      {k.aiOverview && (
                        <span title="Appears in AI Overview">
                          <Sparkles className="w-3 h-3 text-primary shrink-0" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">#{k.position}</span>
                      <span className={`flex items-center text-[10px] font-semibold ${k.positionDelta > 0 ? "text-success" : k.positionDelta < 0 ? "text-danger" : "text-muted"}`}>
                        {k.positionDelta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : k.positionDelta < 0 ? <ArrowDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
                        {Math.abs(k.positionDelta)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted">{formatNumber(k.volume)}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        k.difficulty >= 60 ? "bg-danger-soft text-danger" : k.difficulty >= 35 ? "bg-warning-soft text-warning" : "bg-success-soft text-success"
                      }`}
                    >
                      {k.difficulty}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted">{formatCurrency(k.cpc)}</td>
                  <td className="px-3 py-3">
                    <Badge variant={intentVariant[k.intent]}>{k.intent}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Sparkline data={k.trend} />
                  </td>
                  <td className="px-5 py-3 text-muted max-w-[180px] truncate">{k.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
