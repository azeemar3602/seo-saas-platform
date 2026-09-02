import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { getProject } from "@/lib/mock-data";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const base = `/projects/${id}`;

  return (
    <DashboardShell
      title={project.name}
      subtitle={project.domain}
    >
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="neutral">{project.cms}</Badge>
        <Badge variant="neutral">Last crawled {new Date(project.lastCrawled).toLocaleDateString()}</Badge>
      </div>
      <div className="mb-6">
        <Tabs
          items={[
            { href: base, label: "Overview", exact: true },
            { href: `${base}/audit`, label: "Audit" },
            { href: `${base}/keywords`, label: "Keywords" },
            { href: `${base}/competitors`, label: "Competitors" },
            { href: `${base}/backlinks`, label: "Backlinks" },
          ]}
        />
      </div>
      {children}
    </DashboardShell>
  );
}
