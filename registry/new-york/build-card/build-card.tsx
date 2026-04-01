"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorBuildItemData = {
  id: string;
  slot: string;
  label: string;
  imageUrl: string | null;
  description: string | null;
};

export type CreatorBuildData = {
  id: string;
  game: string;
  title: string;
  role: string | null;
  characterImageUrl: string | null;
  description: string | null;
  items: CreatorBuildItemData[];
};

export interface BuildCardProps {
  /** Array of builds to display */
  builds: CreatorBuildData[];
  /** Whether the viewer is the owner of this profile */
  isOwner: boolean;
  /** Additional CSS classes for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: string }) {
  const isKiller = role.toLowerCase() === "killer";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        isKiller
          ? "bg-red-500/15 text-red-400"
          : "bg-emerald-500/15 text-emerald-400",
      )}
    >
      {role}
    </span>
  );
}

function ItemSlot({ item }: { item: CreatorBuildItemData }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative flex flex-col items-center gap-1.5"
      title={item.description ?? item.label}
    >
      <div className="flex size-14 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-border group-hover:bg-muted">
        {item.imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.label}
            className="size-full rounded-lg object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="px-0.5 text-center leading-tight">{item.label.slice(0, 3)}</span>
        )}
      </div>
      <span className="w-full truncate text-center text-[11px] leading-tight text-muted-foreground">
        {item.label}
      </span>
      {item.description && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden w-40 -translate-x-1/2 rounded-lg border border-border bg-popover px-2.5 py-2 text-[11px] text-popover-foreground shadow-lg group-hover:block">
          <p className="font-semibold">{item.label}</p>
          <p className="mt-0.5 text-muted-foreground">{item.description}</p>
        </div>
      )}
    </div>
  );
}

function BuildEntry({ build }: { build: CreatorBuildData }) {
  const [imgError, setImgError] = useState(false);
  const perks = build.items.filter((i) => i.slot.startsWith("perk")).slice(0, 4);
  const addons = build.items.filter((i) => i.slot.startsWith("addon")).slice(0, 2);
  const otherItems = build.items.filter(
    (i) => !i.slot.startsWith("perk") && !i.slot.startsWith("addon"),
  );
  const displayItems = [...perks, ...addons, ...otherItems];

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/10">
      {/* Character image */}
      <div className="relative h-44 bg-muted/50 @sm:h-52">
        {build.characterImageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={build.characterImageUrl}
            alt={build.title}
            className="size-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <svg className="size-16 text-muted-foreground/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}
        {build.role && (
          <div className="absolute right-2 top-2">
            <RoleBadge role={build.role} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 truncate text-sm font-bold text-foreground" title={build.title}>{build.title}</h3>
        {build.description && (
          <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">{build.description}</p>
        )}

        {/* Item grid */}
        {displayItems.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Build
            </p>
            <div className="grid grid-cols-3 gap-3 @xs:grid-cols-4">
              {displayItems.map((item) => (
                <ItemSlot key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {build.items.length === 0 && (
          <p className="mt-2 text-xs text-muted-foreground/50">No items added yet</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Grid of character build cards with a large character image, role badge,
 * item grid with tooltips, and optional description.
 *
 * Items are grouped: perks (up to 4) shown first, then addons (up to 2),
 * then any remaining items. Each item slot shows a tooltip on hover with
 * the item's description.
 *
 * @example
 * ```tsx
 * <BuildCard
 *   builds={[{ id: "1", game: "dbd", title: "Main Killer", role: "killer", characterImageUrl: null, description: null, items: [] }]}
 *   isOwner={false}
 * />
 * ```
 */
export function BuildCard({ builds, isOwner, className }: BuildCardProps) {
  if (builds.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          {isOwner ? "Add your builds to share your favorite loadouts." : "No builds added yet."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6",
        builds.length === 1 && "@sm:grid-cols-1",
        builds.length === 2 && "@sm:grid-cols-2",
        builds.length >= 3 && "@sm:grid-cols-2 @2xl:grid-cols-3",
        className,
      )}
    >
      {builds.map((build) => (
        <BuildEntry key={build.id} build={build} />
      ))}
    </div>
  );
}
