"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const platforms = [
  {
    id: "wordpress",
    name: "WordPress",
    issues: [
      {
        title: "Site connection fails / \"could not verify ownership\"",
        fix: "Install and activate the Rankwell connector plugin, then paste the verification code into Settings → General → Site verification. If you use a caching plugin (WP Rocket, W3 Total Cache), purge the cache after activating — cached pages can hide the verification meta tag from our crawler.",
      },
      {
        title: "Auto-fix couldn't update meta titles/descriptions",
        fix: "Auto-Fix writes through your active SEO plugin's API (Yoast, RankMath, or All in One SEO). Confirm one of these is active and that Rankwell has been granted \"Editor\" or higher capability in Users → your connected account.",
      },
      {
        title: "Audit shows pages that don't exist on the live site",
        fix: "Usually stale XML sitemap entries. Regenerate your sitemap from your SEO plugin's settings, then re-run the audit — we recrawl from the sitemap plus internal links.",
      },
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    issues: [
      {
        title: "Product schema errors won't clear after Auto-Fix",
        fix: "Shopify caches theme files on their CDN for up to 24 hours. Changes from Auto-Fix are applied immediately in the theme editor but may take up to a day to reflect for Google's crawler. If it's been over 24 hours, check that your theme doesn't have a duplicate Product schema block from an installed SEO app conflicting with ours.",
      },
      {
        title: "Backlink or traffic numbers look low right after connecting",
        fix: "New connections take 24–48 hours to backfill historical data from Search Console and our backlink index. Numbers will keep filling in — this isn't a live-traffic drop.",
      },
      {
        title: "Collection pages flagged as duplicate content",
        fix: "This is expected for filter/sort URL variants (?sort_by=price). Set canonical tags in Shopify's theme.liquid to point back to the base collection URL, or mark these as \"ignore\" in Rankwell's audit settings if they're already canonicalized.",
      },
    ],
  },
  {
    id: "webflow",
    name: "Webflow",
    issues: [
      {
        title: "Can't connect — no plugin option available",
        fix: "Webflow doesn't support third-party plugins, so connection is via the Webflow API using a site token from Project Settings → Apps & Integrations → API access. Rankwell reads content and can suggest changes, but Auto-Fix requires you to publish accepted changes manually inside the Webflow Designer.",
      },
      {
        title: "Structured data suggestions aren't appearing on the live site",
        fix: "Webflow requires custom code embeds for JSON-LD. Copy the generated schema from the Audit tab into Page Settings → Custom Code → before </body> tag for the specific page, then republish the site.",
      },
    ],
  },
  {
    id: "custom",
    name: "Custom / other CMS",
    issues: [
      {
        title: "No native connector available",
        fix: "Add the Rankwell verification snippet manually to your <head>, and connect Google Search Console + GA4 directly under Settings → Integrations. Auto-Fix isn't available without a supported CMS connector — you'll get the exact code changes to apply yourself instead.",
      },
      {
        title: "Crawl keeps timing out",
        fix: "Check that your server isn't rate-limiting or blocking our crawler user agent (RankwellBot). Whitelist it in your firewall/CDN (e.g. Cloudflare) rules if you're seeing repeated crawl failures.",
      },
    ],
  },
];

export function HelpClient() {
  const [platform, setPlatform] = useState(platforms[0].id);
  const [openIssue, setOpenIssue] = useState<string | null>(null);
  const active = platforms.find((p) => p.id === platform)!;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPlatform(p.id);
              setOpenIssue(null);
            }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
              platform === p.id
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border text-muted hover:text-foreground"
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{active.name} troubleshooting</h3>
          <Badge variant="neutral">{active.issues.length} common issues</Badge>
        </div>
        <div className="divide-y divide-border">
          {active.issues.map((issue) => {
            const isOpen = openIssue === issue.title;
            return (
              <div key={issue.title}>
                <button
                  onClick={() => setOpenIssue(isOpen ? null : issue.title)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium">{issue.title}</span>
                  <ChevronDown className={cn("w-4 h-4 text-muted transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <div className="bg-surface-muted rounded-lg p-4 text-sm text-muted">{issue.fix}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 mt-4">
        <h3 className="text-sm font-semibold">Still stuck?</h3>
        <p className="text-sm text-muted mt-1">
          Email <span className="text-foreground font-medium">support@rankwell.app</span> with your project domain
          and a screenshot — most tickets are answered within a few hours on paid plans.
        </p>
      </Card>
    </>
  );
}
