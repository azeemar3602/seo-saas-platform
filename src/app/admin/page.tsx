import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { AdminOrgRow } from "@/components/admin/AdminOrgRow";
import { listOrganizations } from "@/lib/db";
import { pricingPlans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Building2, Users, TrendingUp, ShieldAlert, Clock } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  // Middleware already blocks non-admins from reaching this route; this is a
  // second, server-side check so the page never renders admin data to a
  // session that somehow got here without one (e.g. a stale cached response).
  if (!session?.user?.isPlatformAdmin) redirect("/dashboard");

  const organizations = listOrganizations();
  const planPrice = Object.fromEntries(pricingPlans.map((p) => [p.name, p.price]));

  const mrr = organizations
    .filter((o) => o.status === "active")
    .reduce((sum, o) => sum + (planPrice[o.plan] ?? 0), 0);
  const trialingCount = organizations.filter((o) => o.status === "trialing").length;
  const suspendedCount = organizations.filter((o) => o.status === "suspended").length;
  const totalUsers = organizations.reduce((sum, o) => sum + o.memberCount, 0);

  return (
    <DashboardShell title="Platform admin" subtitle="Manage every organization and subscription">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Organizations"
          value={`${organizations.length}`}
          icon={Building2}
          iconColor="text-primary"
          iconBg="bg-primary-soft"
        />
        <StatCard
          label="Total users"
          value={`${totalUsers}`}
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary-soft"
        />
        <StatCard
          label="MRR (active plans)"
          value={formatCurrency(mrr)}
          icon={TrendingUp}
          iconColor="text-success"
          iconBg="bg-success-soft"
        />
        <StatCard
          label="Trialing"
          value={`${trialingCount}`}
          icon={Clock}
          iconColor="text-info"
          iconBg="bg-info-soft"
        />
        <StatCard
          label="Suspended"
          value={`${suspendedCount}`}
          icon={ShieldAlert}
          iconColor="text-danger"
          iconBg="bg-danger-soft"
        />
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Organizations"
          subtitle={`${organizations.length} registered — change plan or status directly`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted uppercase tracking-wide border-y border-border">
                <th className="px-5 py-2.5 font-medium">Organization</th>
                <th className="px-3 py-2.5 font-medium">Members</th>
                <th className="px-3 py-2.5 font-medium">Plan</th>
                <th className="px-3 py-2.5 font-medium">Price</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted text-sm">
                    No organizations have registered yet.
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <AdminOrgRow key={org.id} org={org} planPrice={planPrice} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-muted mt-4">
        Plan and status here are billing metadata only — no payment processor is connected yet.
        Changing a plan does not charge or refund a card. Wire Stripe (see README →
        &ldquo;Not yet in this repo&rdquo;) before relying on this for real billing.
      </p>
    </DashboardShell>
  );
}
