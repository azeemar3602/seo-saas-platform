export type Intent = "informational" | "commercial" | "transactional" | "navigational";

export interface Project {
  id: string;
  name: string;
  domain: string;
  favicon: string;
  createdAt: string;
  healthScore: number;
  healthDelta: number;
  trafficEstimate: number;
  trafficDelta: number;
  keywordCount: number;
  keywordDelta: number;
  backlinkCount: number;
  backlinkDelta: number;
  lastCrawled: string;
  cms: "WordPress" | "Shopify" | "Webflow" | "Custom" | "Wix";
  plan: "Starter" | "Growth" | "Agency";
}

export interface TrendPoint {
  date: string;
  score: number;
}

export interface ActivityItem {
  id: string;
  projectId: string;
  projectName: string;
  type: "audit" | "keyword" | "backlink" | "agent" | "report" | "alert";
  title: string;
  description: string;
  timestamp: string;
  severity?: "info" | "success" | "warning" | "danger";
}

export interface AuditCategory {
  name: string;
  score: number;
  passed: number;
  warnings: number;
  critical: number;
}

export interface AuditIssue {
  id: string;
  category: string;
  severity: "critical" | "warning" | "notice";
  title: string;
  description: string;
  affectedUrls: number;
  howToFix: string;
}

export interface Keyword {
  id: string;
  keyword: string;
  position: number;
  positionDelta: number;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: Intent;
  url: string;
  trend: number[];
  aiOverview: boolean;
}

export interface Competitor {
  id: string;
  domain: string;
  favicon: string;
  overlapScore: number;
  sharedKeywords: number;
  keywordGap: number;
  domainAuthority: number;
  estTraffic: number;
  backlinks: number;
}

export interface Backlink {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number;
  type: "dofollow" | "nofollow";
  firstSeen: string;
  status: "active" | "lost" | "new";
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "content" | "outreach" | "research" | "competitive";
  inputLabel: string;
  inputPlaceholder: string;
  color: string;
}

export interface AgentRun {
  id: string;
  agentId: string;
  projectName: string;
  input: string;
  status: "completed" | "running" | "failed";
  createdAt: string;
  summary: string;
  output: string;
}

export interface KeywordResearchResult {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: Intent;
  trend: number[];
  serpFeatures: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  projects: number;
  keywords: number;
  agentRuns: number;
  features: string[];
  highlighted?: boolean;
}
