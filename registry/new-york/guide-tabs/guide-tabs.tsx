"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, PlayCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorGuideLinkData = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  description: string | null;
};

export type CreatorGuideCategoryData = {
  id: string;
  title: string;
  description: string | null;
  links: CreatorGuideLinkData[];
};

export interface GuideTabsProps {
  /** Array of guide categories, each with their own list of video links */
  categories: CreatorGuideCategoryData[];
  /** Intro text displayed above the tabs */
  introText: string | null;
  /** Whether the viewer is the owner of this profile */
  isOwner: boolean;
  /** Additional CSS classes for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function VideoCard({ link }: { link: CreatorGuideLinkData }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/10"
    >
      {/* 16:9 thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted/50">
        {link.thumbnailUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnailUrl}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <PlayCircle className="size-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <PlayCircle className="size-8 text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {link.title}
          </h4>
          <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" aria-hidden="true" />
        </div>
        {link.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{link.description}</p>
        )}
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Tabbed guide viewer with video cards in a responsive grid.
 * Intro text is shown above the tabs. Each tab shows a category of videos
 * with 16:9 thumbnails and a hover play overlay.
 *
 * This is a client component — it uses useState for the active tab.
 *
 * @example
 * ```tsx
 * <GuideTabs
 *   categories={[{ id: "1", title: "Killer Guides", description: null, links: [...] }]}
 *   introText="My guide collection"
 *   isOwner={false}
 * />
 * ```
 */
export function GuideTabs({ categories, introText, isOwner, className }: GuideTabsProps) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");

  if (categories.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          {isOwner ? "Add guide categories to organize your content." : "No guides added yet."}
        </p>
      </div>
    );
  }

  const activeCategory = categories.find((c) => c.id === activeId) ?? categories[0]!;

  return (
    <div className={cn("@container", className)}>
      <div className="flex flex-col gap-5">
        {introText && (
          <p className="text-sm leading-relaxed text-muted-foreground">{introText}</p>
        )}

        {/* Tab bar */}
        <div className="flex flex-wrap gap-1.5 border-b border-border pb-0" role="tablist" aria-label="Guide categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={cat.id === activeCategory.id}
              onClick={() => setActiveId(cat.id)}
              className={cn(
                "relative min-h-[44px] rounded-t-lg px-4 py-2 text-sm font-medium transition-all duration-150",
                cat.id === activeCategory.id
                  ? "text-foreground after:absolute after:inset-x-0 after:bottom-[-1px] after:h-px after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {cat.title}
              {cat.links.length > 0 && (
                <span className="ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {cat.links.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        <div role="tabpanel">
          {activeCategory.description && (
            <p className="mb-4 text-xs text-muted-foreground">{activeCategory.description}</p>
          )}
          {activeCategory.links.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground/60">
              No guides in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @xl:grid-cols-3">
              {activeCategory.links.map((link) => (
                <VideoCard key={link.id} link={link} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
