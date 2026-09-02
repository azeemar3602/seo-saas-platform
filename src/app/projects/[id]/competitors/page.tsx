import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { getProject, getCompetitors } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function CompetitorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const competitors = getCompetitors(id);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add competitor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-muted font-bold text-xs flex items-center justify-center">
                  {c.favicon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.domain}</p>
                  <p className="text-xs text-muted">DA {c.domainAuthority}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{c.overlapScore}%</p>
                <p className="text-[11px] text-muted">overlap</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm font-semibold">{c.sharedKeywords}</p>
                <p className="text-[11px] text-muted">Shared kws</p>
              </div>
              <div>
                <p className="text-sm font-semibold">{c.keywordGap}</p>
                <p className="text-[11px] text-muted">Keyword gap</p>
              </div>
              <div>
                <p className="text-sm font-semibold">{formatNumber(c.estTraffic)}</p>
                <p className="text-[11px] text-muted">Est. traffic</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Head-to-head comparison" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted uppercase tracking-wide border-y border-border">
                <th className="px-5 py-2.5 font-medium">Domain</th>
                <th className="px-3 py-2.5 font-medium">Domain authority</th>
                <th className="px-3 py-2.5 font-medium">Est. traffic</th>
                <th className="px-3 py-2.5 font-medium">Backlinks</th>
                <th className="px-3 py-2.5 font-medium">Shared keywords</th>
                <th className="px-5 py-2.5 font-medium">Keyword gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-primary-soft/40">
                <td className="px-5 py-3 font-semibold">{project.domain} (you)</td>
                <td className="px-3 py-3">—</td>
                <td className="px-3 py-3">{formatNumber(project.trafficEstimate)}</td>
                <td className="px-3 py-3">{formatNumber(project.backlinkCount)}</td>
                <td className="px-3 py-3">—</td>
                <td className="px-5 py-3">—</td>
              </tr>
              {competitors.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/50">
                  <td className="px-5 py-3 font-medium">{c.domain}</td>
                  <td className="px-3 py-3">{c.domainAuthority}</td>
                  <td className="px-3 py-3 text-muted">{formatNumber(c.estTraffic)}</td>
                  <td className="px-3 py-3 text-muted">{formatNumber(c.backlinks)}</td>
                  <td className="px-3 py-3 text-muted">{c.sharedKeywords}</td>
                  <td className="px-5 py-3 text-muted">{c.keywordGap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
