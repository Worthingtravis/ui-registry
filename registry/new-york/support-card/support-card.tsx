"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Heart, ShoppingBag, ExternalLink } from "lucide-react";
import { useCopy } from "@/registry/new-york/use-copy/use-copy";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SupportLinkType = "donation" | "affiliate" | "merch" | "creator-code";

export type CreatorSupportData = {
  id: string;
  type: SupportLinkType;
  label: string;
  url: string | null;
  code: string | null;
  description: string | null;
  imageUrl: string | null;
};

export interface SupportCardProps {
  /** Array of support links */
  links: CreatorSupportData[];
  /** Whether the viewer is the owner of this profile */
  isOwner: boolean;
  /** Additional CSS classes for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CreatorCodeCard({ link }: { link: CreatorSupportData }) {
  const [copied, copy] = useCopy();

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border/60 bg-card/50 p-3 backdrop-blur-sm @xs:gap-3 @xs:p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-foreground">{link.label}</p>
          <p className="text-xs text-muted-foreground">Creator Code</p>
        </div>
      </div>

      {link.description && (
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{link.description}</p>
      )}

      {link.code && (
        <button
          type="button"
          onClick={() => copy(link.code!)}
          className={cn(
            "flex min-h-[44px] items-center justify-between rounded-lg border border-border/80 bg-muted/50 px-3.5 py-2.5",
            "transition-all duration-150 hover:bg-muted",
          )}
          aria-label={`Copy creator code ${link.code}`}
        >
          <span className="truncate font-mono text-sm font-bold tracking-wider text-foreground @xs:text-base">
            {link.code}
          </span>
          <span className="relative ml-2 flex size-5 shrink-0 items-center justify-center @xs:ml-3">
            <svg
              className="absolute inset-0 text-muted-foreground transition-all duration-200"
              style={{ opacity: copied ? 0 : 1, transform: copied ? "scale(0.5)" : "scale(1)" }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <svg
              className="absolute inset-0 text-green-500 transition-all duration-300"
              style={{
                opacity: copied ? 1 : 0,
                transform: copied ? "scale(1)" : "scale(0.5)",
                strokeDasharray: 24,
                strokeDashoffset: copied ? 0 : 24,
                transitionProperty: "opacity, transform, stroke-dashoffset",
              }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </button>
      )}

      {copied && (
        <p className="text-xs font-medium text-green-500">Copied to clipboard!</p>
      )}
    </div>
  );
}

function DonationCard({ link }: { link: CreatorSupportData }) {
  return (
    <a
      href={link.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex min-h-[44px] flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/10",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
            <Heart className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">{link.label}</p>
            <p className="text-xs text-muted-foreground">Donation</p>
          </div>
        </div>
        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" aria-hidden="true" />
      </div>
      {link.description && (
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{link.description}</p>
      )}
    </a>
  );
}

function AffiliateCard({ link }: { link: CreatorSupportData }) {
  return (
    <a
      href={link.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex min-h-[44px] flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/10",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <ExternalLink className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">{link.label}</p>
            <p className="text-xs text-muted-foreground">Affiliate</p>
          </div>
        </div>
        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" aria-hidden="true" />
      </div>
      {link.description && (
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{link.description}</p>
      )}
      {link.code && (
        <p className="text-xs text-muted-foreground">
          Code: <span className="font-mono font-semibold text-foreground">{link.code}</span>
        </p>
      )}
    </a>
  );
}

function MerchCard({ link }: { link: CreatorSupportData }) {
  return (
    <a
      href={link.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex min-h-[44px] flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/10",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <ShoppingBag className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">{link.label}</p>
            <p className="text-xs text-muted-foreground">Merch</p>
          </div>
        </div>
        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" aria-hidden="true" />
      </div>
      {link.description && (
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{link.description}</p>
      )}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Grid of support cards, rendered by type. Donation cards show a heart icon.
 * Affiliate cards show an external link icon with optional code. Merch cards
 * show a shopping bag. Creator-code cards show the code with a copy button.
 *
 * @example
 * ```tsx
 * <SupportCard
 *   links={[{ id: "1", type: "creator-code", label: "Dead by Daylight", url: null, code: "MYCREATOR", description: null, imageUrl: null }]}
 *   isOwner={false}
 * />
 * ```
 */
export function SupportCard({ links, isOwner, className }: SupportCardProps) {
  if (links.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          {isOwner ? "Add support links to help viewers support your content." : "No support links added yet."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3", className)}>
      {links.map((link) => {
        if (link.type === "creator-code") return <CreatorCodeCard key={link.id} link={link} />;
        if (link.type === "donation") return <DonationCard key={link.id} link={link} />;
        if (link.type === "merch") return <MerchCard key={link.id} link={link} />;
        return <AffiliateCard key={link.id} link={link} />;
      })}
    </div>
  );
}
