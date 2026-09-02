import type {
  Project,
  TrendPoint,
  ActivityItem,
  AuditCategory,
  AuditIssue,
  Keyword,
  Competitor,
  Backlink,
  AgentDefinition,
  AgentRun,
  KeywordResearchResult,
  PricingPlan,
} from "./types";

// ---------------------------------------------------------------------------
// This file is the app's mock data layer. Every page reads through the
// functions below instead of touching arrays directly, so wiring in the real
// backend later means replacing the body of each function with a fetch to
// your API route (which in turn calls DataForSEO / Search Console / GA4 /
// PageSpeed / your LLM provider) instead of returning static data. See
// README.md -> "Connecting real data" for the mapping of each function to
// its intended live source.
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  {
    id: "rapidflow",
    name: "Rapid Flow Plumbing",
    domain: "rapidflowplumbing.com",
    favicon: "RF",
    createdAt: "2026-03-12",
    healthScore: 78,
    healthDelta: 4,
    trafficEstimate: 12400,
    trafficDelta: 8.2,
    keywordCount: 342,
    keywordDelta: 21,
    backlinkCount: 891,
    backlinkDelta: 34,
    lastCrawled: "2026-08-30T06:00:00Z",
    cms: "WordPress",
    plan: "Growth",
  },
  {
    id: "soulofscents",
    name: "Soul of Scents",
    domain: "soulofscents.com",
    favicon: "SS",
    createdAt: "2026-01-22",
    healthScore: 64,
    healthDelta: -3,
    trafficEstimate: 28900,
    trafficDelta: -2.1,
    keywordCount: 611,
    keywordDelta: -12,
    backlinkCount: 1520,
    backlinkDelta: 9,
    lastCrawled: "2026-08-31T04:00:00Z",
    cms: "Shopify",
    plan: "Growth",
  },
  {
    id: "yozo",
    name: "Yozo Living",
    domain: "yozoliving.com",
    favicon: "YZ",
    createdAt: "2026-05-04",
    healthScore: 91,
    healthDelta: 6,
    trafficEstimate: 45200,
    trafficDelta: 14.6,
    keywordCount: 984,
    keywordDelta: 58,
    backlinkCount: 3104,
    backlinkDelta: 112,
    lastCrawled: "2026-08-31T02:00:00Z",
    cms: "Shopify",
    plan: "Agency",
  },
  {
    id: "bralim",
    name: "Bralim Wellness",
    domain: "bralim.net",
    favicon: "BW",
    createdAt: "2026-06-18",
    healthScore: 52,
    healthDelta: 1,
    trafficEstimate: 5100,
    trafficDelta: 3.4,
    keywordCount: 158,
    keywordDelta: 6,
    backlinkCount: 214,
    backlinkDelta: -4,
    lastCrawled: "2026-08-29T09:00:00Z",
    cms: "WordPress",
    plan: "Starter",
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getPortfolioTotals() {
  return {
    totalProjects: projects.length,
    avgHealthScore: Math.round(
      projects.reduce((s, p) => s + p.healthScore, 0) / projects.length
    ),
    totalTraffic: projects.reduce((s, p) => s + p.trafficEstimate, 0),
    totalKeywords: projects.reduce((s, p) => s + p.keywordCount, 0),
    totalBacklinks: projects.reduce((s, p) => s + p.backlinkCount, 0),
  };
}

export function getHealthTrend(days = 30): TrendPoint[] {
  const points: TrendPoint[] = [];
  let base = 68;
  const now = new Date("2026-08-31");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    base += Math.sin(i / 4) * 1.4 + (Math.random() - 0.45) * 1.2;
    base = Math.max(40, Math.min(95, base));
    points.push({ date: d.toISOString().slice(0, 10), score: Math.round(base * 10) / 10 });
  }
  return points;
}

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    projectId: "yozo",
    projectName: "Yozo Living",
    type: "audit",
    title: "Weekly audit completed",
    description: "Health score improved from 85 to 91. 6 issues auto-resolved.",
    timestamp: "2026-08-31T02:10:00Z",
    severity: "success",
  },
  {
    id: "a2",
    projectId: "soulofscents",
    projectName: "Soul of Scents",
    type: "alert",
    title: "3 pages dropped out of top 10",
    description: "\"essential oil diffuser\" and 2 related terms fell to page 2.",
    timestamp: "2026-08-30T18:44:00Z",
    severity: "warning",
  },
  {
    id: "a3",
    projectId: "rapidflow",
    projectName: "Rapid Flow Plumbing",
    type: "backlink",
    title: "12 new referring domains",
    description: "Includes 2 links from DA 60+ local directories.",
    timestamp: "2026-08-30T11:20:00Z",
    severity: "success",
  },
  {
    id: "a4",
    projectId: "bralim",
    projectName: "Bralim Wellness",
    type: "agent",
    title: "Content Optimizer finished a run",
    description: "Rewrote meta titles for 8 underperforming product pages.",
    timestamp: "2026-08-29T15:02:00Z",
    severity: "info",
  },
  {
    id: "a5",
    projectId: "yozo",
    projectName: "Yozo Living",
    type: "keyword",
    title: "New keyword opportunity detected",
    description: "\"modular sofa small space\" — 2,900 vol, KD 24, currently unranked.",
    timestamp: "2026-08-29T09:15:00Z",
    severity: "info",
  },
  {
    id: "a6",
    projectId: "soulofscents",
    projectName: "Soul of Scents",
    type: "report",
    title: "Monthly client report sent",
    description: "August performance report emailed to 2 stakeholders.",
    timestamp: "2026-08-28T08:00:00Z",
    severity: "info",
  },
];

export function getTodayDigest() {
  return {
    date: "2026-08-31",
    items: [
      { label: "Audits run", value: 4 },
      { label: "New keyword rankings", value: 17 },
      { label: "Backlinks gained", value: 29 },
      { label: "Critical issues found", value: 2 },
    ],
  };
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export function getAuditCategories(projectId: string): AuditCategory[] {
  const seed = projectId.length;
  return [
    { name: "Crawlability & Indexing", score: 82 + (seed % 5), passed: 41, warnings: 3, critical: 0 },
    { name: "Performance & Core Web Vitals", score: 64 - (seed % 7), passed: 22, warnings: 6, critical: 2 },
    { name: "On-Page SEO", score: 88, passed: 55, warnings: 4, critical: 0 },
    { name: "Site Structure & Internal Links", score: 75, passed: 30, warnings: 5, critical: 1 },
    { name: "Mobile Usability", score: 91, passed: 18, warnings: 1, critical: 0 },
    { name: "Structured Data", score: 58, passed: 9, warnings: 4, critical: 1 },
  ];
}

const auditIssuePool: AuditIssue[] = [
    {
      id: "i1",
      category: "Performance & Core Web Vitals",
      severity: "critical",
      title: "Largest Contentful Paint exceeds 4.0s on 14 pages",
      description:
        "Hero images on product/service pages are unoptimized and load render-blocking. Mobile LCP averages 4.6s (target: under 2.5s).",
      affectedUrls: 14,
      howToFix:
        "Convert hero images to WebP/AVIF, add width/height attributes to prevent layout shift, and preload the LCP image with fetchpriority=\"high\". If on WordPress, use a lightweight image CDN (e.g. an image optimization plugin) instead of a heavier all-in-one performance plugin.",
    },
    {
      id: "i2",
      category: "Structured Data",
      severity: "critical",
      title: "Product schema missing required 'offers' field",
      description:
        "22 product pages have Product structured data but omit the offers.price and offers.availability fields required for rich results eligibility.",
      affectedUrls: 22,
      howToFix:
        "Add offers{price, priceCurrency, availability} to each Product JSON-LD block. On Shopify this is usually a theme.liquid schema snippet; on WordPress/WooCommerce it's typically injected by your SEO plugin's product schema module.",
    },
    {
      id: "i3",
      category: "Site Structure & Internal Links",
      severity: "critical",
      title: "9 pages are orphaned (no internal links pointing to them)",
      description:
        "These pages only appear in the sitemap, with zero internal links from crawlable pages, weakening their ability to rank.",
      affectedUrls: 9,
      howToFix:
        "Add contextual internal links from related category/blog pages. Prioritize the 3 orphaned pages that already have search impressions in GSC.",
    },
    {
      id: "i4",
      category: "Performance & Core Web Vitals",
      severity: "warning",
      title: "Unused JavaScript on 31 pages",
      description: "Third-party scripts (chat widget, analytics, a/b testing) add 340KB of unused JS on first load.",
      affectedUrls: 31,
      howToFix: "Lazy-load non-critical third-party scripts after first user interaction or on a 3-second delay.",
    },
    {
      id: "i5",
      category: "On-Page SEO",
      severity: "warning",
      title: "Duplicate title tags across 6 pages",
      description: "Category filter URLs (e.g. ?sort=price) generate duplicate titles with the parent category page.",
      affectedUrls: 6,
      howToFix: "Add canonical tags pointing filter/sort URL variants back to the base category URL.",
    },
    {
      id: "i6",
      category: "Crawlability & Indexing",
      severity: "warning",
      title: "3 pages blocked by robots.txt but present in sitemap",
      description: "Sitemap and robots.txt disagree, which wastes crawl budget and confuses indexing signals.",
      affectedUrls: 3,
      howToFix: "Remove blocked URLs from the sitemap, or remove the robots.txt disallow rule if they should be indexed.",
    },
    {
      id: "i7",
      category: "Mobile Usability",
      severity: "notice",
      title: "Tap targets too close together on 4 pages",
      description: "Footer navigation links are under the 48x48px recommended tap target size on mobile viewports.",
      affectedUrls: 4,
      howToFix: "Increase footer link padding to at least 12px vertical on mobile breakpoints.",
    },
    {
      id: "i8",
      category: "On-Page SEO",
      severity: "notice",
      title: "12 images missing descriptive alt text",
      description: "Alt attributes are empty or generic (e.g. \"image1.jpg\") on product gallery images.",
      affectedUrls: 12,
      howToFix: "Write descriptive, keyword-relevant alt text for each product image (not keyword-stuffed).",
    },
];

export function getAuditIssues(projectId: string): AuditIssue[] {
  const seed = projectId.length;
  const rotated = [
    ...auditIssuePool.slice(seed % auditIssuePool.length),
    ...auditIssuePool.slice(0, seed % auditIssuePool.length),
  ];
  const keep = seed % 3 === 0 ? rotated.slice(0, -1) : rotated;
  return keep.map((issue, i) => ({
    ...issue,
    affectedUrls: Math.max(1, issue.affectedUrls + (((seed + i) * 3) % 5) - 2),
  }));
}

// ---------------------------------------------------------------------------
// Keywords
// ---------------------------------------------------------------------------

const intents = ["informational", "commercial", "transactional", "navigational"] as const;

function seededTrend(seed: number): number[] {
  const arr: number[] = [];
  let v = 20 + (seed % 30);
  for (let i = 0; i < 12; i++) {
    v += Math.sin((i + seed) / 2) * 3 + (((seed * 7919 + i) % 5) - 2);
    v = Math.max(1, Math.min(100, v));
    arr.push(Math.round(v));
  }
  return arr;
}

const keywordSeeds: { keyword: string; url: string }[] = [
  { keyword: "emergency plumber near me", url: "/services/emergency-plumbing" },
  { keyword: "water heater installation cost", url: "/services/water-heater-installation" },
  { keyword: "how to unclog a drain", url: "/blog/how-to-unclog-a-drain" },
  { keyword: "best drain cleaning service", url: "/services/drain-cleaning" },
  { keyword: "leak detection near me", url: "/services/leak-detection" },
  { keyword: "tankless water heater vs tank", url: "/blog/tankless-vs-tank-water-heater" },
  { keyword: "sump pump replacement", url: "/services/sump-pump" },
  { keyword: "sewer line repair cost", url: "/services/sewer-line-repair" },
  { keyword: "24 hour plumber", url: "/services/emergency-plumbing" },
  { keyword: "pipe burst what to do", url: "/blog/burst-pipe-guide" },
  { keyword: "commercial plumbing contractor", url: "/services/commercial" },
  { keyword: "toilet running constantly fix", url: "/blog/running-toilet-fix" },
];

export function getKeywords(projectId: string): Keyword[] {
  return keywordSeeds.map((k, i) => {
    const seed = i + projectId.length;
    const position = ((seed * 13) % 40) + 1;
    return {
      id: `kw-${i}`,
      keyword: k.keyword,
      position,
      positionDelta: ((seed * 3) % 11) - 5,
      volume: ((seed * 137) % 40) * 100 + 200,
      difficulty: ((seed * 19) % 70) + 10,
      cpc: Math.round((((seed * 7) % 25) + 1) * 0.45 * 100) / 100,
      intent: intents[seed % intents.length],
      url: k.url,
      trend: seededTrend(seed),
      aiOverview: seed % 3 === 0,
    };
  });
}

const opportunityKeywords: Record<string, { keyword: string; volume: number; difficulty: number }> = {
  rapidflow: { keyword: "tankless water heater installation near me", volume: 1900, difficulty: 28 },
  soulofscents: { keyword: "best smelling wax melts", volume: 2400, difficulty: 21 },
  yozo: { keyword: "modular sofa small space", volume: 2900, difficulty: 24 },
  bralim: { keyword: "organic lavender essential oil benefits", volume: 1600, difficulty: 19 },
};

export function getKeywordOpportunity(projectId: string) {
  return (
    opportunityKeywords[projectId] ?? {
      keyword: "long-tail keyword for your niche",
      volume: 1200,
      difficulty: 22,
    }
  );
}

export function getRankDistribution(projectId: string) {
  const kws = getKeywords(projectId);
  const buckets = { "1-3": 0, "4-10": 0, "11-20": 0, "21-50": 0, "51+": 0 };
  for (const k of kws) {
    if (k.position <= 3) buckets["1-3"]++;
    else if (k.position <= 10) buckets["4-10"]++;
    else if (k.position <= 20) buckets["11-20"]++;
    else if (k.position <= 50) buckets["21-50"]++;
    else buckets["51+"]++;
  }
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

// ---------------------------------------------------------------------------
// Competitors
// ---------------------------------------------------------------------------

export function getCompetitors(projectId: string): Competitor[] {
  const base: Omit<Competitor, "id">[] = [
    { domain: "quickfixplumbers.com", favicon: "QF", overlapScore: 68, sharedKeywords: 214, keywordGap: 96, domainAuthority: 54, estTraffic: 18200, backlinks: 2340 },
    { domain: "proflow-services.com", favicon: "PF", overlapScore: 55, sharedKeywords: 167, keywordGap: 142, domainAuthority: 61, estTraffic: 31500, backlinks: 4120 },
    { domain: "localplumbingpros.com", favicon: "LP", overlapScore: 41, sharedKeywords: 98, keywordGap: 210, domainAuthority: 38, estTraffic: 9400, backlinks: 980 },
    { domain: "allhoursplumbing.net", favicon: "AH", overlapScore: 33, sharedKeywords: 74, keywordGap: 268, domainAuthority: 45, estTraffic: 14100, backlinks: 1650 },
  ];
  return base.map((b, i) => ({ id: `${projectId}-c${i}`, ...b }));
}

// ---------------------------------------------------------------------------
// Backlinks
// ---------------------------------------------------------------------------

const backlinkSeeds: { sourceDomain: string; anchorText: string; type: "dofollow" | "nofollow"; da: number }[] = [
  { sourceDomain: "localdirectory.com", anchorText: "Rapid Flow Plumbing", type: "dofollow", da: 62 },
  { sourceDomain: "chamberofcommerce.org", anchorText: "emergency plumber", type: "dofollow", da: 71 },
  { sourceDomain: "homeimprovementblog.net", anchorText: "click here", type: "nofollow", da: 44 },
  { sourceDomain: "yellowpages.com", anchorText: "rapidflowplumbing.com", type: "dofollow", da: 78 },
  { sourceDomain: "reviewsite.io", anchorText: "best plumbers in town", type: "dofollow", da: 39 },
  { sourceDomain: "localnews.com", anchorText: "Rapid Flow", type: "nofollow", da: 66 },
  { sourceDomain: "trade-association.org", anchorText: "certified plumbing contractor", type: "dofollow", da: 58 },
  { sourceDomain: "citysearch.com", anchorText: "plumbing services", type: "dofollow", da: 51 },
];

export function getBacklinks(projectId: string): Backlink[] {
  return backlinkSeeds.map((b, i) => {
    const seed = i + projectId.length;
    const statuses: Backlink["status"][] = ["active", "active", "active", "new", "lost"];
    return {
      id: `bl-${i}`,
      sourceDomain: b.sourceDomain,
      sourceUrl: `https://${b.sourceDomain}/article-${100 + i}`,
      targetUrl: `https://${projects.find((p) => p.id === projectId)?.domain ?? "example.com"}/`,
      anchorText: b.anchorText,
      domainAuthority: b.da,
      type: b.type,
      firstSeen: `2026-${String((seed % 6) + 3).padStart(2, "0")}-${String(((seed * 3) % 27) + 1).padStart(2, "0")}`,
      status: statuses[seed % statuses.length],
    };
  });
}

export function getBacklinkSummary(projectId: string) {
  const links = getBacklinks(projectId);
  const referringDomains = new Set(links.map((l) => l.sourceDomain)).size;
  const dofollow = links.filter((l) => l.type === "dofollow").length;
  return {
    totalBacklinks: projects.find((p) => p.id === projectId)?.backlinkCount ?? links.length,
    referringDomains: referringDomains * 34,
    avgAuthority: Math.round(links.reduce((s, l) => s + l.domainAuthority, 0) / links.length),
    followRatio: Math.round((dofollow / links.length) * 100),
  };
}

// ---------------------------------------------------------------------------
// AI Agents
// ---------------------------------------------------------------------------

export const agentDefinitions: AgentDefinition[] = [
  {
    id: "outreach-writer",
    name: "Outreach Writer",
    description: "Drafts personalized backlink outreach emails from a target site's content and contact page.",
    icon: "Mail",
    category: "outreach",
    inputLabel: "Target site URL",
    inputPlaceholder: "https://competitor-blog.com/best-tools-2026",
    color: "#4f46e5",
  },
  {
    id: "content-optimizer",
    name: "Content Optimizer",
    description: "Rewrites titles, meta descriptions and headings on an underperforming page to match search intent.",
    icon: "FileText",
    category: "content",
    inputLabel: "Page URL",
    inputPlaceholder: "https://yoursite.com/services/drain-cleaning",
    color: "#0ea5e9",
  },
  {
    id: "competitor-spy",
    name: "Competitor Spy",
    description: "Analyzes a competitor domain and surfaces their top-performing pages, keywords, and content gaps.",
    icon: "Radar",
    category: "competitive",
    inputLabel: "Competitor domain",
    inputPlaceholder: "competitor.com",
    color: "#d97706",
  },
  {
    id: "keyword-scout",
    name: "Keyword Scout",
    description: "Finds low-competition keyword opportunities related to a seed topic, clustered by search intent.",
    icon: "Search",
    category: "research",
    inputLabel: "Seed topic",
    inputPlaceholder: "tankless water heaters",
    color: "#16a34a",
  },
];

export const agentRuns: AgentRun[] = [
  {
    id: "run1",
    agentId: "content-optimizer",
    projectName: "Bralim Wellness",
    input: "https://bralim.net/products/lavender-oil",
    status: "completed",
    createdAt: "2026-08-29T15:02:00Z",
    summary: "Rewrote meta title/description and H1 to target \"organic lavender essential oil\" (KD 22, vol 1,900).",
    output:
      "Title: Organic Lavender Essential Oil — 100% Pure, Steam-Distilled | Bralim Wellness\nMeta: Shop pure organic lavender essential oil, steam-distilled and third-party tested. Free shipping over $35. \nH1: Organic Lavender Essential Oil",
  },
  {
    id: "run2",
    agentId: "competitor-spy",
    projectName: "Yozo Living",
    input: "modernnestfurniture.com",
    status: "completed",
    createdAt: "2026-08-28T10:30:00Z",
    summary: "Found 34 keyword gaps, 6 with volume >1,000 and difficulty under 30.",
    output:
      "Top content gaps:\n1. \"small space sectional sofa\" — vol 2,400, KD 26, competitor ranks #3\n2. \"modular sofa configurations\" — vol 1,600, KD 19, competitor ranks #5\n3. \"boucle accent chair\" — vol 3,100, KD 31, competitor ranks #2",
  },
  {
    id: "run3",
    agentId: "outreach-writer",
    projectName: "Soul of Scents",
    input: "https://naturalwellnessdaily.com/best-diffusers",
    status: "completed",
    createdAt: "2026-08-27T13:12:00Z",
    summary: "Drafted a personalized pitch referencing their existing roundup and offering a product sample.",
    output:
      "Subject: Loved your diffuser roundup — a fit for your readers?\n\nHi there, I came across your \"Best Diffusers 2026\" post and really liked the breakdown of ultrasonic vs nebulizing options...",
  },
  {
    id: "run4",
    agentId: "keyword-scout",
    projectName: "Rapid Flow Plumbing",
    input: "tankless water heaters",
    status: "running",
    createdAt: "2026-08-31T08:00:00Z",
    summary: "In progress — clustering 40 seed variations by intent.",
    output: "",
  },
];

export function getAgentRuns(agentId?: string): AgentRun[] {
  return agentId ? agentRuns.filter((r) => r.agentId === agentId) : agentRuns;
}

// ---------------------------------------------------------------------------
// Research tool
// ---------------------------------------------------------------------------

export function searchKeywords(seed: string): KeywordResearchResult[] {
  const variations = [
    seed,
    `best ${seed}`,
    `${seed} near me`,
    `${seed} cost`,
    `how to choose ${seed}`,
    `${seed} vs alternatives`,
    `cheap ${seed}`,
    `${seed} reviews`,
  ];
  return variations.map((v, i) => {
    const h = v.length * 31 + i * 17;
    return {
      keyword: v,
      volume: ((h * 53) % 60) * 100 + 100,
      difficulty: (h % 80) + 5,
      cpc: Math.round((((h * 3) % 30) + 1) * 0.35 * 100) / 100,
      intent: intents[h % intents.length],
      trend: seededTrend(h),
      serpFeatures: [
        h % 2 === 0 ? "Featured Snippet" : null,
        h % 3 === 0 ? "AI Overview" : null,
        h % 5 === 0 ? "People Also Ask" : null,
        h % 4 === 0 ? "Local Pack" : null,
      ].filter(Boolean) as string[],
    };
  });
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 39,
    yearlyPrice: 390,
    description: "For freelancers managing a handful of sites.",
    projects: 3,
    keywords: 500,
    agentRuns: 20,
    features: [
      "3 tracked projects",
      "500 tracked keywords",
      "Weekly automated audits",
      "20 AI agent runs / month",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 99,
    yearlyPrice: 990,
    description: "For agencies running SEO for multiple clients.",
    projects: 15,
    keywords: 3000,
    agentRuns: 150,
    features: [
      "15 tracked projects",
      "3,000 tracked keywords",
      "Daily automated audits",
      "150 AI agent runs / month",
      "White-label client reports",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 249,
    yearlyPrice: 2490,
    description: "For teams that need scale and API access.",
    projects: 50,
    keywords: 12000,
    agentRuns: 600,
    features: [
      "50 tracked projects",
      "12,000 tracked keywords",
      "Real-time audits",
      "600 AI agent runs / month",
      "White-label client reports",
      "API access",
      "Dedicated account manager",
    ],
  },
];
