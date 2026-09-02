import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function formatPercent(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function scoreColor(score: number): { text: string; bg: string; ring: string } {
  if (score >= 80) return { text: "text-success", bg: "bg-success-soft", ring: "stroke-success" };
  if (score >= 50) return { text: "text-warning", bg: "bg-warning-soft", ring: "stroke-warning" };
  return { text: "text-danger", bg: "bg-danger-soft", ring: "stroke-danger" };
}

export function trendColor(delta: number): string {
  if (delta > 0) return "text-success";
  if (delta < 0) return "text-danger";
  return "text-muted";
}
