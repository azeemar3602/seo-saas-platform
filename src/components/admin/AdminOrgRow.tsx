"use client";

import { useTransition } from "react";
import { changeOrgPlanAction, changeOrgStatusAction } from "@/app/admin/actions";
import type { OrganizationWithOwner } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  active: "bg-success-soft text-success",
  trialing: "bg-info-soft text-info",
  suspended: "bg-danger-soft text-danger",
  canceled: "bg-surface-muted text-muted",
};

export function AdminOrgRow({
  org,
  planPrice,
}: {
  org: OrganizationWithOwner;
  planPrice: Record<string, number>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <tr className="hover:bg-surface-muted/50">
      <td className="px-5 py-3">
        <p className="font-medium">{org.name}</p>
        <p className="text-xs text-muted">{org.ownerName} · {org.ownerEmail}</p>
      </td>
      <td className="px-3 py-3 text-muted">{org.memberCount}</td>
      <td className="px-3 py-3">
        <select
          value={org.plan}
          disabled={pending}
          onChange={(e) =>
            startTransition(() => {
              changeOrgPlanAction(org.id, e.target.value);
            })
          }
          className="border border-border rounded-md text-xs font-medium px-2 py-1.5 bg-surface disabled:opacity-50"
        >
          <option value="Starter">Starter</option>
          <option value="Growth">Growth</option>
          <option value="Agency">Agency</option>
        </select>
      </td>
      <td className="px-3 py-3 text-muted">{formatCurrency(planPrice[org.plan] ?? 0)}/mo</td>
      <td className="px-3 py-3">
        <select
          value={org.status}
          disabled={pending}
          onChange={(e) =>
            startTransition(() => {
              changeOrgStatusAction(org.id, e.target.value);
            })
          }
          className={`rounded-md text-xs font-semibold px-2 py-1.5 border-0 disabled:opacity-50 ${
            statusBadge[org.status] ?? "bg-surface-muted text-muted"
          }`}
        >
          <option value="trialing">Trialing</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="canceled">Canceled</option>
        </select>
      </td>
      <td className="px-5 py-3 text-muted text-xs">
        {new Date(org.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
      </td>
    </tr>
  );
}
