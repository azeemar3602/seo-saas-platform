import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { BookOpen } from "lucide-react";

const glossary = [
  {
    term: "Health score",
    plain:
      "A single 0–100 number summarizing how technically sound your site is right now — combining crawlability, performance, on-page, structure, mobile, and structured data checks.",
    good: "80 or above",
  },
  {
    term: "Domain authority (DA)",
    plain:
      "A 0–100 estimate of how likely a whole domain is to rank, based mainly on the quantity and quality of sites linking to it. It's a comparison tool, not a Google metric — use it to judge competitors relative to each other.",
    good: "Depends on your niche — compare to direct competitors, not in isolation",
  },
  {
    term: "Keyword difficulty (KD)",
    plain:
      "An estimate of how hard it would be to rank on page 1 for a keyword, based on the authority of pages currently ranking there.",
    good: "Under 30 for new pages, under 50 for established sites",
  },
  {
    term: "Search intent",
    plain:
      "What the searcher actually wants: informational (learning), commercial (comparing options), transactional (ready to buy), or navigational (looking for a specific brand/site).",
    good: "Match your page type to the dominant intent for that keyword",
  },
  {
    term: "Dofollow vs. nofollow",
    plain:
      "A dofollow link passes authority to your site; a nofollow link (rel=\"nofollow\") tells search engines not to pass that credit, though it can still send referral traffic.",
    good: "A healthy backlink profile has a mix, typically 60–80% dofollow",
  },
  {
    term: "Referring domains",
    plain:
      "The number of unique websites linking to you, as opposed to total backlinks (one site can link to you many times). Referring domains matter more for authority than raw link count.",
    good: "More unique domains is generally better than more links from the same domain",
  },
  {
    term: "Core Web Vitals",
    plain:
      "Google's three page-experience metrics: Largest Contentful Paint (loading speed), Interaction to Next Paint (responsiveness), and Cumulative Layout Shift (visual stability).",
    good: "LCP under 2.5s, INP under 200ms, CLS under 0.1",
  },
  {
    term: "AI Overview visibility",
    plain:
      "Whether your page's content is being cited or summarized in Google's AI Overviews and other AI search surfaces (ChatGPT, Perplexity), not just ranked in traditional blue links.",
    good: "Structure content with clear, quotable answers near the top of the page",
  },
  {
    term: "Orphaned page",
    plain:
      "A page with no internal links pointing to it from anywhere else on your site. Search engines and users can only find it through the sitemap or a direct link.",
    good: "Zero orphaned pages that you want indexed",
  },
];

export default function LearnPage() {
  return (
    <DashboardShell title="Learn" subtitle="Plain-English explanations of the metrics we track">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {glossary.map((item) => (
          <Card key={item.term} className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">{item.term}</h3>
            </div>
            <p className="text-sm text-muted">{item.plain}</p>
            <p className="text-xs mt-3 pt-3 border-t border-border">
              <span className="font-semibold">Good target: </span>
              <span className="text-muted">{item.good}</span>
            </p>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
