"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PerkPickerDialog } from "@/registry/new-york/perk-picker/perk-picker-dialog";
import type { SelectedPerk, Perk } from "@/registry/new-york/perk-picker/perk-picker";
import perksData from "@/registry/new-york/perk-picker/perks.json";

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
  /** Called when a build's perks are updated (owner only) */
  onPerksChange?: (buildId: string, perks: SelectedPerk[]) => void;
  /** Called when the owner adds a new build from the empty state */
  onAddBuild?: (role: "killer" | "survivor") => void;
  /** Additional CSS classes for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Perk lookup
// ---------------------------------------------------------------------------

const ALL_PERKS = perksData as Perk[];
const PERK_BY_NAME = new Map(ALL_PERKS.map((p) => [p.name.toLowerCase(), p]));

/** Look up a real Perk by label, with fuzzy fallback for common aliases */
function lookupPerk(label: string, role: "killer" | "survivor"): Perk {
  const key = label.toLowerCase();
  // Exact match first
  const exact = PERK_BY_NAME.get(key);
  if (exact) return exact;
  // Fuzzy: find a perk whose name contains the label or vice versa
  const fuzzy = ALL_PERKS.find(
    (p) => p.name.toLowerCase().includes(key) || key.includes(p.name.toLowerCase()),
  );
  if (fuzzy) return fuzzy;
  return {
    name: label,
    role,
    type: "unique",
    character: null,
    description: "",
    tierValues: null,
    quote: null,
    iconFile: null,
    iconPath: null,
  };
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

function ItemSlot({
  item,
  interactive,
  onClick,
}: {
  item: CreatorBuildItemData;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  const Wrapper = interactive ? "button" : "div";

  return (
    <Wrapper
      {...(interactive ? { type: "button" as const, onClick } : {})}
      className={cn(
        "group relative flex flex-col items-center gap-1.5",
        interactive && "cursor-pointer",
      )}
      title={item.description ?? item.label}
    >
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-border group-hover:bg-muted",
          interactive && "ring-primary/0 transition-all group-hover:ring-2 group-hover:ring-primary/40",
        )}
      >
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
    </Wrapper>
  );
}

function EmptySlot({ index, onClick }: { index: number; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center gap-1.5 cursor-pointer"
    >
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-lg border-2 border-dashed border-border/40 bg-muted/20",
          "text-muted-foreground/30 transition-all",
          "group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/50",
        )}
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <span className="text-[11px] text-muted-foreground/30">
        Perk {index + 1}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// BuildEntry
// ---------------------------------------------------------------------------

function BuildEntry({
  build,
  isOwner,
  onPerksChange,
}: {
  build: CreatorBuildData;
  isOwner: boolean;
  onPerksChange?: (buildId: string, perks: SelectedPerk[]) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const perks = build.items.filter((i) => i.slot.startsWith("perk")).slice(0, 4);
  const addons = build.items.filter((i) => i.slot.startsWith("addon")).slice(0, 2);
  const otherItems = build.items.filter(
    (i) => !i.slot.startsWith("perk") && !i.slot.startsWith("addon"),
  );

  const role = build.role?.toLowerCase() as "killer" | "survivor" | undefined;
  const validRole = role === "killer" || role === "survivor" ? role : undefined;

  // Build initial value for the picker — look up real perk data for icons
  const initialPickerValue: SelectedPerk[] = perks.map((item, index) => ({
    slot: index,
    perk: lookupPerk(item.label, validRole ?? "killer"),
  }));

  const handleOpenPicker = useCallback(() => {
    if (isOwner) setPickerOpen(true);
  }, [isOwner]);

  const handleConfirm = useCallback(
    (selected: SelectedPerk[]) => {
      onPerksChange?.(build.id, selected);
      setPickerOpen(false);
    },
    [build.id, onPerksChange],
  );

  // Fill 4 perk slots — show existing perks + empty slots for owner
  const perkSlots = Array.from({ length: 4 }, (_, i) => perks[i] ?? null);

  return (
    <>
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

          {/* Perk slots — interactive for owner */}
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Build
              </p>
              {isOwner && perks.length > 0 && (
                <button
                  type="button"
                  onClick={handleOpenPicker}
                  className="text-[10px] font-medium text-primary/60 transition-colors hover:text-primary"
                >
                  Edit perks
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {isOwner
                ? perkSlots.map((item, i) =>
                    item ? (
                      <ItemSlot
                        key={item.id}
                        item={item}
                        interactive
                        onClick={handleOpenPicker}
                      />
                    ) : (
                      <EmptySlot key={`empty-${i}`} index={i} onClick={handleOpenPicker} />
                    ),
                  )
                : perks.map((item) => (
                    <ItemSlot key={item.id} item={item} />
                  ))
              }
            </div>
          </div>

          {/* Addons + other items (non-interactive, below perks) */}
          {[...addons, ...otherItems].length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Other
              </p>
              <div className="grid grid-cols-3 gap-3 @xs:grid-cols-4">
                {[...addons, ...otherItems].map((item) => (
                  <ItemSlot key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {build.items.length === 0 && isOwner && (
            <button
              type="button"
              onClick={handleOpenPicker}
              className={cn(
                "mt-2 w-full rounded-lg border-2 border-dashed border-border/40 py-4 text-xs text-muted-foreground/50",
                "transition-colors hover:border-primary/40 hover:text-primary/60",
              )}
            >
              Add perks to this build
            </button>
          )}

          {build.items.length === 0 && !isOwner && (
            <p className="mt-2 text-xs text-muted-foreground/50">No items added yet</p>
          )}
        </div>
      </div>

      {/* Perk picker dialog */}
      {isOwner && (
        <PerkPickerDialog
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onConfirm={handleConfirm}
          initialValue={initialPickerValue}
          role={validRole}
          title={`Edit Perks — ${build.title}`}
        />
      )}
    </>
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
 * When `isOwner` is true, perk slots become interactive — clicking opens
 * a perk picker dialog pre-filtered to the build's role.
 *
 * @example
 * ```tsx
 * <BuildCard
 *   builds={[{ id: "1", game: "dbd", title: "Main Killer", role: "killer", characterImageUrl: null, description: null, items: [] }]}
 *   isOwner={false}
 * />
 * ```
 */
export function BuildCard({ builds, isOwner, onPerksChange, onAddBuild, className }: BuildCardProps) {
  if (builds.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center", className)}>
        {isOwner ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Add a build to share your favorite loadouts.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onAddBuild?.("killer")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5",
                  "text-sm font-medium text-red-400 transition-all",
                  "hover:border-red-500/50 hover:bg-red-500/10",
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">+ Killer Build</span>
              </button>
              <button
                type="button"
                onClick={() => onAddBuild?.("survivor")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5",
                  "text-sm font-medium text-emerald-400 transition-all",
                  "hover:border-emerald-500/50 hover:bg-emerald-500/10",
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">+ Survivor Build</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No builds added yet.</p>
        )}
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
        <BuildEntry
          key={build.id}
          build={build}
          isOwner={isOwner}
          onPerksChange={onPerksChange}
        />
      ))}
    </div>
  );
}
