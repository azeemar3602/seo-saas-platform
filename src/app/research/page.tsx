import { DashboardShell } from "@/components/layout/DashboardShell";
import { searchKeywords } from "@/lib/mock-data";
import { ResearchClient } from "./ResearchClient";

async function searchAction(seed: string) {
  "use server";
  return searchKeywords(seed || "seo");
}

export default function ResearchPage() {
  const initialSeed = "tankless water heaters";
  const initialResults = searchKeywords(initialSeed);

  return (
    <DashboardShell title="Research" subtitle="Keyword and content research tool">
      <ResearchClient initialSeed={initialSeed} initialResults={initialResults} searchAction={searchAction} />
    </DashboardShell>
  );
}
