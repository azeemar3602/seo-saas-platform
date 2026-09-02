import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { pricingPlans } from "@/lib/mock-data";
import { Check, Zap } from "lucide-react";

export default function PricingPage() {
  return (
    <DashboardShell title="Plans & billing" subtitle="Choose the plan that fits your workload">
      <div className="bg-primary-soft border border-primary/20 rounded-xl px-5 py-3 flex items-center gap-3 mb-6">
        <Zap className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-primary">
          <span className="font-semibold">Your trial ends in 9 days.</span> Pick a plan below to keep automated
          audits and AI agents running without interruption.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`p-6 flex flex-col ${plan.highlighted ? "border-primary shadow-[0_0_0_1px_rgba(79,70,229,0.4)]" : ""}`}
          >
            {plan.highlighted && (
              <span className="self-start bg-primary text-white text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-xs text-muted mt-1">{plan.description}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">${plan.price}</span>
              <span className="text-sm text-muted">/ month</span>
            </div>
            <p className="text-[11px] text-muted mt-1">or ${plan.yearlyPrice}/year (2 months free)</p>

            <button
              className={`mt-5 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-primary hover:bg-primary-hover text-white"
                  : "bg-surface-muted hover:bg-primary-soft hover:text-primary text-foreground"
              }`}
            >
              Choose {plan.name}
            </button>

            <ul className="mt-6 space-y-2.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted mt-8">
        Need more than 50 projects or a custom data volume? <a href="/help" className="text-primary font-semibold hover:underline">Contact us</a> for Enterprise pricing.
      </p>
    </DashboardShell>
  );
}
