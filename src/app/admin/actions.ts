"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  updateOrganizationPlan,
  updateOrganizationStatus,
  type OrgStatus,
  type Plan,
} from "@/lib/db";

const PLANS: Plan[] = ["Starter", "Growth", "Agency"];
const STATUSES: OrgStatus[] = ["trialing", "active", "suspended", "canceled"];

async function requirePlatformAdmin() {
  const session = await auth();
  if (!session?.user?.isPlatformAdmin) {
    throw new Error("Not authorized");
  }
}

export async function changeOrgPlanAction(orgId: string, plan: string) {
  await requirePlatformAdmin();
  if (!PLANS.includes(plan as Plan)) throw new Error("Invalid plan");
  updateOrganizationPlan(orgId, plan as Plan);
  revalidatePath("/admin");
}

export async function changeOrgStatusAction(orgId: string, status: string) {
  await requirePlatformAdmin();
  if (!STATUSES.includes(status as OrgStatus)) throw new Error("Invalid status");
  updateOrganizationStatus(orgId, status as OrgStatus);
  revalidatePath("/admin");
}
