"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorRecommendationData = {
  id: string;
  name: string;
  twitchLogin: string;
  description: string | null;
  imageUrl: string | null;
};

export interface CreatorCardProps {
  /** Array of recommended creators */
  recommendations: CreatorRecommendationData[];
  /** Optional intro text displayed above the grid */
  introText: string | null;
  /** Whether the viewer is the owner of this profile */
  isOwner: boolean;
  /** Additional CSS classes for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function AvatarFallback({ name }: { name: string }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
      {getInitials(name)}
    </div>
  );
}

function CreatorEntry({ rec }: { rec: CreatorRecommendationData }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={`https://twitch.tv/${rec.twitchLogin}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-3.5 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/10",
      )}
    >
      {/* Profile image */}
      <div className="size-14 shrink-0 overflow-hidden rounded-full border border-border/60">
        {rec.imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={rec.imageUrl}
            alt={rec.name}
            className="size-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <AvatarFallback name={rec.name} />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold leading-snug text-foreground">{rec.name}</p>
          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-xs text-muted-foreground/60">@{rec.twitchLogin}</p>
        {rec.description && (
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{rec.description}</p>
        )}
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Intro text + grid of recommended creator cards. Each card shows a rounded
 * profile image (or initials fallback), the creator's display name, an
 * optional description, and a link to their Twitch channel.
 *
 * @example
 * ```tsx
 * <CreatorCard
 *   recommendations={[{ id: "1", name: "Otzdarva", twitchLogin: "otzdarva", description: "Best DBD content", imageUrl: null }]}
 *   introText="Some of my favorite creators!"
 *   isOwner={false}
 * />
 * ```
 */
export function CreatorCard({ recommendations, introText, isOwner, className }: CreatorCardProps) {
  if (recommendations.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          {isOwner ? "Add creators you recommend to your community." : "No recommended creators yet."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {introText && (
        <p className="text-sm leading-relaxed text-muted-foreground">{introText}</p>
      )}

      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @xl:grid-cols-3">
        {recommendations.map((rec) => (
          <CreatorEntry key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}
