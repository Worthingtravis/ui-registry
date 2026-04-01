import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { Perk } from "@/registry/new-york/perk-picker/perk-picker";
import { PERK_BY_ID, PERK_BY_NAME, getPerkIconUrl } from "@/registry/new-york/perk-picker/perk-picker";

// ---------------------------------------------------------------------------
// Perk lookup — prefers ID, falls back to name (for legacy data)
// ---------------------------------------------------------------------------

function resolvePerk(perkId?: string | null, name?: string | null): Perk | null {
  if (perkId) {
    const byId = PERK_BY_ID.get(perkId);
    if (byId) return byId;
  }
  if (name) {
    const byName = PERK_BY_NAME.get(name.toLowerCase());
    if (byName) return byName;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const SIZES = {
  sm: "size-6",
  md: "size-9",
  lg: "size-14",
} as const;

export interface PerkIconProps {
  /** Stable perk ID (kebab-case slug) — preferred lookup */
  perkId?: string | null;
  /** Perk name — fallback lookup when perkId is absent (legacy support) */
  name?: string | null;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes for the root element */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a Dead by Daylight perk icon by ID or name. Looks up the perk
 * from the embedded database, resolves the icon file, and renders it.
 * Falls back to a text abbreviation if the perk or icon is not found.
 *
 * @example
 * ```tsx
 * <PerkIcon perkId="barbecue-and-chilli" size="md" />
 * <PerkIcon name="Sprint Burst" size="lg" />
 * ```
 */
export function PerkIcon({ perkId, name, size = "md", className }: PerkIconProps) {
  const [imgError, setImgError] = useState(false);
  const perk = resolvePerk(perkId, name);
  const iconUrl = perk ? getPerkIconUrl(perk) : "";
  const label = perk?.name ?? name ?? perkId ?? "?";

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-lg bg-muted/30",
        SIZES[size],
        className,
      )}
      title={label}
    >
      {iconUrl && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconUrl}
          alt={label}
          className="size-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-[8px] font-bold text-muted-foreground/50">
          {label.slice(0, 3)}
        </div>
      )}
    </div>
  );
}

export { resolvePerk };
