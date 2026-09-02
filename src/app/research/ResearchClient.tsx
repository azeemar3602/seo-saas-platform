"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/charts/Sparkline";
import type { KeywordResearchResult } from "@/lib/types";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Search, Plus } from "lucide-react";

const intentVariant = {
  informational: "info" as const,
  commercial: "warning" as const,
  transactional: "success" as const,
  navigational: "neutral" as const,
};

export function ResearchClient({
  initialSeed,
  initialResults,
  searchAction,
}: {
  initialSeed: string;
  initialResults: KeywordResearchResult[];
  searchAction: (seed: string) => Promise<KeywordResearchResult[]>;
}) {
  const [seed, setSeed] = useState(initialSeed);
  const [results, setResults] = useState(initialResults);
  const [pending, startTransition] = useTransition();

  function runSearch(value: string) {
    startTransition(async () => {
      const r = await searchAction(value);
      setResults(r);
    });
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(seed);
          }}
          className="flex gap-2"
        >
          <div className="flex-1 flex items-center gap-2 bg-surface-muted rounded-lg px-3 h-11">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Enter a seed keyword or topic…"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-semibold px-5 rounded-lg transition-colors"
          >
            {pending ? "Searching…" : "Research"}
          </button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Keyword ideas" subtitle={`${results.length} results for "${seed}"`} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted uppercase tracking-wide border-y border-border">
                <th className="px-5 py-2.5 font-medium">Keyword</th>
                <th className="px-3 py-2.5 font-medium">Volume</th>
                <th className="px-3 py-2.5 font-medium">Difficulty</th>
                <th className="px-3 py-2.5 font-medium">CPC</th>
                <th className="px-3 py-2.5 font-medium">Intent</th>
                <th className="px-3 py-2.5 font-medium">SERP features</th>
                <th className="px-3 py-2.5 font-medium">Trend</th>
                <th className="px-5 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((r) => (
                <tr key={r.keyword} className="hover:bg-surface-muted/50">
                  <td className="px-5 py-3 font-medium max-w-[220px] truncate">{r.keyword}</td>
                  <td className="px-3 py-3 text-muted">{formatNumber(r.volume)}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        r.difficulty >= 60 ? "bg-danger-soft text-danger" : r.difficulty >= 35 ? "bg-warning-soft text-warning" : "bg-success-soft text-success"
                      }`}
                    >
                      {r.difficulty}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted">{formatCurrency(r.cpc)}</td>
                  <td className="px-3 py-3">
                    <Badge variant={intentVariant[r.intent]}>{r.intent}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1 flex-wrap max-w-[180px]">
                      {r.serpFeatures.length === 0 ? (
                        <span className="text-muted text-xs">—</span>
                      ) : (
                        r.serpFeatures.map((f) => (
                          <Badge key={f} variant="neutral">
                            {f}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Sparkline data={r.trend} />
                  </td>
                  <td className="px-5 py-3">
                    <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap">
                      <Plus className="w-3 h-3" />
                      Track
                    </button>
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
