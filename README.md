# Rankwell — SEO SaaS Platform

A multi-tenant SEO platform: site audits, keyword research, AI-search visibility,
backlink tracking, competitor analysis, AI agents, and client reporting — built as
a standalone product to sell as a subscription, separate from the `beacon-seo`
Claude Code plugin.

This repository is a **working Next.js application** with every screen from the
product spec built and wired to a realistic mock data layer. It is not yet
connected to live SEO data, a database, auth, or billing — that wiring is the
next phase, and is mapped out below so it's a matter of swapping functions, not
redesigning pages.

## What's actually built right now

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, no other framework
  dependencies beyond `recharts` (charts) and `lucide-react` (icons).
- Full responsive layout: persistent sidebar on desktop/tablet, slide-over drawer
  nav on mobile, sticky topbar.
- **Dashboard** — portfolio stat cards, health-score trend chart, estimated
  organic traffic value, activity feed, today's digest.
- **Projects** — grid of tracked sites with health score, traffic, keywords,
  backlinks at a glance.
- **Project detail** (tabs: Overview / Audit / Keywords / Competitors /
  Backlinks) — health score gauge, category breakdown, issue list with
  severity + "how to fix" guidance, keyword table with position/volume/
  difficulty/CPC/intent/trend, competitor comparison table, backlink table
  with authority/type/status.
- **Research** — keyword tool: seed keyword in, ideas out with volume,
  difficulty, CPC, intent, SERP features, trend sparkline.
- **AI Agents** — Outreach Writer, Content Optimizer, Competitor Spy, Keyword
  Scout, each with an input form and a run-history feed. Submitting a run
  currently returns a placeholder response client-side (see below for wiring
  it to a real LLM).
- **Plans** — three-tier pricing (Starter / Growth / Agency) with a trial
  banner.
- **Learn** — plain-English glossary of every metric the app surfaces.
- **Help** — per-CMS (WordPress / Shopify / Webflow / custom) troubleshooting
  accordion.

Every page reads through `src/lib/mock-data.ts`. Nothing else references mock
data directly, so connecting real data is a matter of replacing function
bodies in that one file (or splitting it into real API calls) rather than
touching every page.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/dashboard`.

```bash
npm run build && npm run start   # production build
```

## Project structure

```
src/
  app/                    routes (App Router) — one folder per page
    dashboard/
    projects/[id]/{audit,keywords,competitors,backlinks}/
    research/
    agents/
    pricing/
    learn/
    help/
  components/
    layout/               Sidebar, Topbar, MobileNav, DashboardShell
    ui/                    Card, StatCard, Badge, ScoreGauge, Tabs
    charts/                TrendChart, RankDistributionChart, Sparkline
  lib/
    types.ts               every data shape the app uses
    mock-data.ts            <- swap this out for real data sources
    utils.ts                formatters, class helpers
```

## Connecting real data (next phase)

Each function in `src/lib/mock-data.ts` maps to one real data source. Suggested
order of implementation (cheapest / highest leverage first):

| Function | Replace with |
|---|---|
| `getProject`, `projects` | Postgres query (multi-tenant `projects` table) |
| `getAuditCategories`, `getAuditIssues` | Store results from a scheduled crawl job (Core Web Vitals via **Google PageSpeed Insights API**, on-page checks via your own crawler, indexing via **Google Search Console API**) |
| `getKeywords`, `getRankDistribution` | **DataForSEO** SERP + Keywords Data API, or Search Console query data for your own ranking pages |
| `getCompetitors` | **DataForSEO** Labs (Competitors Domain, Domain Intersection) |
| `getBacklinks`, `getBacklinkSummary` | **DataForSEO** Backlinks API |
| `searchKeywords` (Research tool) | **DataForSEO** Keywords Data (search volume, CPC, difficulty) |
| `agentDefinitions` / agent run logic | Your own API routes calling **Anthropic/OpenAI/Gemini** for generation, plus DataForSEO/Search Console for the data each agent reasons over |
| traffic estimates | **GA4 Data API** for connected properties, or DataForSEO traffic estimation as a fallback for unconnected sites |

This mirrors the module-by-module breakdown from the `beacon-seo` plugin
(technical audits, AI-visibility, content, local SEO, off-page, algorithm
tracking, client reporting) — the plugin's capability set is the product spec;
this app is the always-on version of it with a database and a dashboard
instead of a chat session.

### Not yet in this repo (needed before this is sellable)

1. **Database** — Postgres via Prisma. Tables roughly: `Organization`, `User`,
   `Project`, `AuditRun`, `Keyword`, `KeywordRanking` (time series),
   `Competitor`, `Backlink`, `AgentRun`, `Subscription`.
2. **Auth** — NextAuth (or Clerk/Auth.js) with an `Organization` scoping every
   query, so one customer never sees another's data.
3. **Job scheduler** — a queue (BullMQ + Redis, or a cron-triggered serverless
   function) to run audits/keyword refreshes on a schedule per plan tier.
4. **Billing** — Stripe subscriptions matching the three plans on `/pricing`,
   with usage limits (`projects`, `keywords`, `agentRuns` fields already
   modeled in `PricingPlan`) enforced server-side.
5. **API routes** for each DataForSEO/Google/LLM call, so API keys stay
   server-side and usage is metered per organization.

## Deployment

This is a stock Next.js app — deploys to Vercel with zero configuration:

```bash
npm install -g vercel   # if you don't have it
vercel                  # first deploy, follow prompts
vercel --prod            # production deploy
```

Or connect the GitHub repo directly in the Vercel dashboard for automatic
deploys on push. Once a database is added, set `DATABASE_URL` (and later
`STRIPE_SECRET_KEY`, `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD`,
`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, `NEXTAUTH_SECRET`, Google OAuth
credentials) as environment variables in Vercel's project settings — never
commit these to the repo.

## Naming

The app is placeholder-branded "Rankwell" (logo mark + name in
`src/components/layout/Sidebar.tsx` and `src/components/layout/MobileNav.tsx`,
plus `metadata.title` in `src/app/layout.tsx`). Swap the name and add a real
logo before launch — this was deliberately not named or styled to match any
specific competitor's brand.
