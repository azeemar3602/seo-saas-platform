import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getProject, getBacklinks, getBacklinkSummary } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { Link2, Globe, Gauge, TrendingUp } from "lucide-react";

const statusVariant = {
  active: "success" as const,
  new: "info" as const,
  lost: "danger" as const,
};

export default async function BacklinksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const backlinks = getBacklinks(id);
  const summary = getBacklinkSummary(id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Total backlinks</span>
            <Link2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold mt-2">{formatNumber(summary.totalBacklinks)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Referring domains</span>
            <Globe className="w-4 h-4 text-info" />
          </div>
          <p className="text-2xl font-semibold mt-2">{formatNumber(summary.referringDomains)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Avg. authority</span>
            <Gauge className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-semibold mt-2">{summary.avgAuthority}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Dofollow ratio</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-semibold mt-2">{summary.followRatio}%</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Backlinks" subtitle={`${backlinks.length} most recent links`} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted uppercase tracking-wide border-y border-border">
                <th className="px-5 py-2.5 font-medium">Source</th>
                <th className="px-3 py-2.5 font-medium">Anchor text</th>
                <th className="px-3 py-2.5 font-medium">Authority</th>
                <th className="px-3 py-2.5 font-medium">Type</th>
                <th className="px-3 py-2.5 font-medium">First seen</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {backlinks.map((b) => (
                <tr key={b.id} className="hover:bg-surface-muted/50">
                  <td className="px-5 py-3 font-medium">{b.sourceDomain}</td>
                  <td className="px-3 py-3 text-muted max-w-[200px] truncate">&ldquo;{b.anchorText}&rdquo;</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        b.domainAuthority >= 60 ? "bg-success-soft text-success" : b.domainAuthority >= 40 ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"
                      }`}
                    >
                      {b.domainAuthority}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={b.type === "dofollow" ? "primary" : "neutral"}>{b.type}</Badge>
                  </td>
                  <td className="px-3 py-3 text-muted">{b.firstSeen}</td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
