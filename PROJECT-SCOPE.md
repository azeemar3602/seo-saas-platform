# Rankwell (seo-saas-platform) — Project Scope

Repo: https://github.com/azeemar3602/seo-saas-platform
Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, recharts, lucide-react

## What this is

A working front-end for a multi-tenant SEO SaaS product — competitor to "Beacon."
Every screen in the product is built and fully responsive (desktop/tablet/mobile).
It currently runs entirely on mock data (`src/lib/mock-data.ts`) — there is no
database, no auth, no billing, and no live API calls yet. This document is the
scope for the next phase: turning it into a real, sellable, multi-tenant product.

## What's already built (done, do not redesign)

- Dashboard — portfolio stats, health trend chart, activity feed, today's digest
- Projects list + Project detail (tabs: Overview, Audit, Keywords, Competitors, Backlinks)
- Research tool (keyword ideas — currently a server action returning mock results)
- AI Agents page (Outreach Writer, Content Optimizer, Competitor Spy, Keyword Scout —
  currently returns a placeholder response client-side, no real LLM call)
- Pricing page (Starter / Growth / Agency, 3 tiers)
- Learn (glossary) and Help (per-CMS troubleshooting) pages
- Responsive layout: sidebar (desktop/tablet) + slide-over drawer nav (mobile)

Full breakdown is in `README.md` in the repo root — read that first, it has the
file structure and a table mapping every mock function to the real API that
should replace it.

## What needs to be built next (in priority order)

1. **Database** — Postgres + Prisma. Core tables: `Organization`, `User`,
   `Project`, `AuditRun`, `Keyword`, `KeywordRanking` (time series), `Competitor`,
   `Backlink`, `AgentRun`, `Subscription`. Every table scoped by `Organization`.

2. **Auth** — NextAuth (or Clerk). Multi-tenant: a logged-in user belongs to an
   Organization, and every query must be scoped to it so customers never see
   each other's data. Needs signup, login, and an invite flow for team members.

3. **Replace mock data with real APIs** — one function at a time in
   `src/lib/mock-data.ts` (or split into real server calls), same order as the
   README table:
   - Site audits → DataForSEO + Google PageSpeed Insights + Google Search Console API
   - Keywords/rankings → DataForSEO SERP + Keywords Data API
   - Competitors → DataForSEO Labs (Competitors Domain, Domain Intersection)
   - Backlinks → DataForSEO Backlinks API
   - Traffic estimates → GA4 Data API (connected properties) or DataForSEO fallback
   - AI Agents → server-side calls to Anthropic/OpenAI/Gemini, fed by the data above

4. **Job scheduler** — BullMQ + Redis, or cron-triggered serverless functions,
   to run audits and refresh keyword rankings automatically per plan tier
   (e.g. daily for Agency, weekly for Starter).

5. **Billing** — Stripe subscriptions matching the 3 pricing tiers, enforcing
   the usage limits already modeled in `PricingPlan` (projects, keywords,
   agentRuns per plan).

6. **API routes** — one per external service (DataForSEO, Google, LLM), so API
   keys stay server-side only and usage can be metered per organization for
   billing/limits enforcement.

## Explicit constraints

- Do not touch or reference the `beacon-seo` Claude Code plugin repo
  (`azeemar3602/SEO-claude-plugin`) — this is a separate, standalone product.
- Keep main content width ~1200px, consistent section padding, matching the
  existing design tokens in `src/app/globals.css`.
- Branding is placeholder ("Rankwell") — deliberately not styled to match Beacon
  or any competitor; can be renamed later.
- Prefer lightweight, framework-native solutions — avoid adding heavy
  dependencies where Next.js/Tailwind already covers it.

## Suggested next conversation with Claude Code

Start with step 1 (database + Prisma schema) and step 2 (auth) together, since
every other step depends on Organization-scoped data existing. Then tackle the
mock-data replacements one function at a time — each one is isolated and
testable without touching the pages that call it.
