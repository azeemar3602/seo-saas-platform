# Rankwell — SEO SaaS Platform

A multi-tenant SEO platform: site audits, keyword research, AI-search visibility,
backlink tracking, competitor analysis, AI agents, and client reporting — built as
a standalone product to sell as a subscription, separate from the `beacon-seo`
Claude Code plugin.

This repository is a **working Next.js application** with every screen from the
product spec built and wired to a realistic mock data layer, plus **real,
working authentication** (register/login/logout), **multi-tenant organizations**,
and a **platform admin panel** for managing subscriptions. The SEO data itself
(projects, audits, keywords, backlinks) is still mock data — that wiring is the
next phase, mapped out below so it's a matter of swapping functions, not
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
- **Auth** — `/register` creates a new Organization + owner user and signs
  them in; `/login` signs back in; sign-out is in the Topbar's account menu.
  Every app route (`/dashboard`, `/projects`, `/research`, `/agents`,
  `/pricing`, `/learn`, `/help`, `/admin`) is behind auth — unauthenticated
  visitors are redirected to `/login` and sent back after signing in.
- **Platform admin** (`/admin`, visible only to accounts with
  `isPlatformAdmin`) — lists every registered organization with its owner,
  member count, plan, and status, and lets you change plan/status inline.
  This is real, working CRUD against the database — it is **not** connected
  to a payment processor, so changing a plan here is billing metadata only
  and does not charge or refund anyone (see Stripe in "Not yet in this repo").

Every SEO data page reads through `src/lib/mock-data.ts`. Nothing else
references mock data directly, so connecting real data is a matter of
replacing function bodies in that one file (or splitting it into real API
calls) rather than touching every page. Auth and organizations are **not**
mock — they're real, backed by a small SQLite database (see below).

## Auth & database

Accounts, organizations, and subscription plan/status are stored in a local
SQLite file via `better-sqlite3` (`src/lib/db.ts`) — deliberately not an ORM
with a migration engine: Prisma's migration engine needs to download a native
binary at build time, which isn't guaranteed to work on every host (shared
hosting, sandboxed CI). `better-sqlite3` ships prebuilt binaries for common
platforms and has zero external network calls at build or run time.

If this product later needs Postgres (for horizontal scaling — SQLite is a
single file, fine for one server, not for multiple instances sharing state),
swap the implementation inside `src/lib/db.ts` — nothing outside that file
talks to SQLite directly.

Auth is NextAuth v5 (`next-auth@beta`) with a Credentials provider (email +
bcrypt-hashed password), JWT sessions. Route protection is a `src/proxy.ts`
file (Next.js 16's renamed `middleware.ts` — see
[Renaming Middleware to Proxy](https://nextjs.org/docs/messages/middleware-to-proxy)),
which runs in the Edge runtime and therefore cannot import `better-sqlite3` —
that's why the NextAuth config is split into `src/auth.config.ts` (edge-safe:
no providers, no DB import, used by `proxy.ts`) and `src/auth.ts` (full
config with the Credentials provider, used everywhere else). If you add
providers or callbacks, double-check which file they belong in.

## Local development

```bash
npm install
cp .env.example .env    # then fill in AUTH_SECRET (see comments in the file)
npm run db:seed         # creates a platform-admin login + a demo customer login
npm run dev
```

Open http://localhost:3000 — it redirects to `/dashboard`, which redirects to
`/login` since you're not signed in yet. Sign in with the account
`npm run db:seed` printed, or register a new one at `/register`.

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
    login/, register/      auth pages (server page.tsx + client *Form.tsx)
    admin/                  platform admin panel + server actions
    api/auth/[...nextauth]/ NextAuth route handler
  components/
    layout/               Sidebar, Topbar, MobileNav, DashboardShell(Client)
    ui/                    Card, StatCard, Badge, ScoreGauge, Tabs
    charts/                TrendChart, RankDistributionChart, Sparkline
    auth/                  AuthCard (shared login/register layout)
    admin/                  AdminOrgRow (plan/status controls)
  lib/
    types.ts               every data shape the app uses
    mock-data.ts            <- swap this out for real SEO data sources
    db.ts                    real SQLite data layer (users, organizations)
    auth-actions.ts          server actions: register, login, sign out
    utils.ts                formatters, class helpers
  auth.ts                  full NextAuth config (Node runtime only)
  auth.config.ts           edge-safe NextAuth config, shared with proxy.ts
  proxy.ts                 route protection (Next 16's middleware.ts)
scripts/
  seed.ts                  creates platform-admin + demo customer accounts
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

1. **Real SEO data tables** — `Project`, `AuditRun`, `Keyword`,
   `KeywordRanking` (time series), `Competitor`, `Backlink`, `AgentRun` all
   still come from `src/lib/mock-data.ts`, not the database. The `User` and
   `Organization` tables are real (`src/lib/db.ts`) — extend that same file,
   or migrate to Postgres if you need horizontal scaling, and add the
   `organizationId` scoping these new tables so one customer never queries
   another's data. ~~Auth~~ ✅ done — NextAuth v5, see "Auth & database" above.
2. **Job scheduler** — a queue (BullMQ + Redis, or a cron-triggered serverless
   function) to run audits/keyword refreshes on a schedule per plan tier.
3. **Billing** — Stripe subscriptions matching the three plans on `/pricing`.
   The `/admin` panel already lets you set an organization's plan and status
   (trialing/active/suspended/canceled) as billing *metadata*, and
   `PricingPlan` already models `projects`/`keywords`/`agentRuns` usage
   limits — but nothing charges a card yet. Wire Stripe Checkout/Billing,
   have its webhook call `updateOrganizationPlan`/`updateOrganizationStatus`
   in `src/lib/db.ts` on `checkout.session.completed` /
   `customer.subscription.updated` events, and enforce the usage limits
   server-side.
4. **API routes** for each DataForSEO/Google/LLM call, so API keys stay
   server-side and usage is metered per organization.

## Deployment

**Required in every environment:** an `AUTH_SECRET` environment variable
(generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
— see `.env.example`). Without it, sign-in will fail or use an insecure
default depending on the host.

**SQLite persistence — read this before deploying to Hostinger or any host
that deploys by uploading/replacing files (rather than a git pull on the
server):** the database is a single file at `./data/app.db` by default. If a
"redeploy" on your host re-uploads the app's files, it can silently wipe or
replace that file, deleting every registered account. Point `DATABASE_PATH`
(see `.env.example`) at a location *outside* the app's deploy directory —
e.g. a persistent storage path your host doesn't touch on redeploy — and run
`npm run db:seed` again after the very first deploy only. Confirm with your
host which paths survive a redeploy before relying on this in production.

Vercel (serverless) is the exception: its filesystem is ephemeral on every
request, so a file-based SQLite database does **not** work there at all —
either deploy to a host with a persistent filesystem (Hostinger's Node.js
app, a VPS, Railway, Fly.io, Render), or swap `src/lib/db.ts` for a hosted
database (Postgres, Turso/libSQL) before deploying to Vercel.

This is otherwise a stock Next.js app:

```bash
npm install -g vercel   # if you don't have it
vercel                  # first deploy, follow prompts
vercel --prod            # production deploy
```

Or connect the GitHub repo directly in your host's dashboard for automatic
deploys on push. Set `AUTH_SECRET` (required, see above) and, once real SEO
data is wired in, `STRIPE_SECRET_KEY`, `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD`,
`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, Google OAuth credentials — as
environment variables in your host's project settings. Never commit these,
or the `.env` file, to the repo.

## Naming

The app is placeholder-branded "Rankwell" (logo mark + name in
`src/components/layout/Sidebar.tsx` and `src/components/layout/MobileNav.tsx`,
plus `metadata.title` in `src/app/layout.tsx`). Swap the name and add a real
logo before launch — this was deliberately not named or styled to match any
specific competitor's brand.
