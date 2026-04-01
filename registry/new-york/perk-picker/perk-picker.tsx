"use client";

import React, { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, Search } from "lucide-react";
import perksData from "./perks.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Perk = {
  id: string;
  name: string;
  role: "killer" | "survivor";
  type: "unique" | "general";
  character: string | null;
  description: string;
  tierValues: { t1: string; t2: string; t3: string; unit: string }[] | null;
  quote: string | null;
  iconFile: string | null;
  iconPath: string | null;
};

export type SelectedPerk = {
  slot: number;
  perk: Perk;
};

export interface PerkPickerProps {
  /** Currently selected perks (up to maxSlots) */
  value: SelectedPerk[];
  /** Called when selection changes */
  onChange: (perks: SelectedPerk[]) => void;
  /** Role filter — limits available perks to killer or survivor */
  role?: "killer" | "survivor";
  /** Maximum perk slots (default 4) */
  maxSlots?: number;
  /** Additional CSS classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const ALL_PERKS: Perk[] = perksData as Perk[];
const PERK_BY_ID = new Map(ALL_PERKS.map((p) => [p.id, p]));

export { ALL_PERKS, PERK_BY_ID, getPerkIconUrl };

function getPerkIconUrl(perk: Perk): string {
  if (!perk.iconFile) return "";
  const decoded = decodeURIComponent(perk.iconFile);
  return `/dbd-perks/icons/${decoded}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type RoleFilter = "all" | "killer" | "survivor";

function PerkSlot({
  perk,
  index,
  onClear,
}: {
  perk: Perk | null;
  index: number;
  onClear: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex size-16 items-center justify-center rounded-lg border-2 transition-all @xs:size-20",
        perk
          ? "border-border/80 bg-card/80"
          : "border-dashed border-border/40 bg-muted/20",
      )}
    >
      {perk ? (
        <>
          {perk.iconFile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getPerkIconUrl(perk)}
              alt={perk.name}
              className="size-full rounded-lg object-cover"
            />
          ) : (
            <span className="px-1 text-center text-[9px] font-bold leading-tight text-muted-foreground">
              {perk.name.slice(0, 8)}
            </span>
          )}
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full",
              "bg-destructive text-destructive-foreground opacity-0 shadow-sm transition-opacity",
              "group-hover:opacity-100 hover:bg-destructive/90",
            )}
            aria-label={`Remove ${perk.name}`}
          >
            <X className="size-3" />
          </button>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-muted-foreground">
            {perk.name.length > 12 ? perk.name.slice(0, 11) + "…" : perk.name}
          </span>
        </>
      ) : (
        <span className="text-[10px] font-medium text-muted-foreground/40">
          {index + 1}
        </span>
      )}
    </div>
  );
}

function PerkGridItem({
  perk,
  isSelected,
  isDisabled,
  onSelect,
}: {
  perk: Perk;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isSelected || isDisabled}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg border p-2 text-left transition-all",
        isSelected
          ? "border-primary/40 bg-primary/5 opacity-50"
          : isDisabled
            ? "cursor-not-allowed border-border/30 opacity-30"
            : "border-border/50 bg-card/30 hover:border-border hover:bg-card/60",
      )}
    >
      <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted/30">
        {perk.iconFile ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getPerkIconUrl(perk)}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[8px] font-bold text-muted-foreground/40">
            ?
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold leading-snug text-foreground">
          {perk.name}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">
          {perk.character ?? perk.type}
        </p>
      </div>
      {isSelected && (
        <span className="shrink-0 text-[9px] font-bold uppercase text-primary">
          Equipped
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Perk picker for Dead by Daylight builds. Search, filter by role, and
 * select up to `maxSlots` perks. Shows selected perks as icon slots at the
 * top, with a searchable grid below.
 *
 * @example
 * ```tsx
 * const [perks, setPerks] = useState<SelectedPerk[]>([]);
 * <PerkPicker value={perks} onChange={setPerks} role="killer" />
 * ```
 */
export function PerkPicker({
  value,
  onChange,
  role,
  maxSlots = 4,
  className,
}: PerkPickerProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(role ?? "all");

  const selectedIds = useMemo(
    () => new Set(value.map((s) => s.perk.id)),
    [value],
  );

  const isFull = value.length >= maxSlots;

  const filtered = useMemo(() => {
    let result = ALL_PERKS;
    if (roleFilter !== "all") result = result.filter((p) => p.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.character?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [roleFilter, search]);

  const killerCount = useMemo(
    () => ALL_PERKS.filter((p) => p.role === "killer").length,
    [],
  );
  const survivorCount = useMemo(
    () => ALL_PERKS.filter((p) => p.role === "survivor").length,
    [],
  );

  const handleSelect = useCallback(
    (perk: Perk) => {
      if (selectedIds.has(perk.id) || isFull) return;
      // Find first empty slot
      const usedSlots = new Set(value.map((s) => s.slot));
      let slot = 0;
      while (usedSlots.has(slot)) slot++;
      onChange([...value, { slot, perk }]);
    },
    [value, onChange, selectedIds, isFull],
  );

  const handleClear = useCallback(
    (slot: number) => {
      onChange(value.filter((s) => s.slot !== slot));
    },
    [value, onChange],
  );

  const handleClearAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  // Build slot array for display
  const slots: (Perk | null)[] = Array.from({ length: maxSlots }, (_, i) => {
    const entry = value.find((s) => s.slot === i);
    return entry?.perk ?? null;
  });

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Selected perk slots */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
            Build ({value.length}/{maxSlots})
          </span>
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[10px] font-medium text-muted-foreground/60 transition-colors hover:text-destructive"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex gap-4 pb-4">
          {slots.map((perk, i) => (
            <PerkSlot key={i} perk={perk} index={i} onClear={() => handleClear(i)} />
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search perks…"
            className={cn(
              "h-9 w-full rounded-lg border border-border/60 bg-muted/30 pl-9 pr-3 text-sm text-foreground",
              "placeholder:text-muted-foreground/40 focus:border-border focus:outline-none focus:ring-1 focus:ring-ring",
            )}
          />
        </div>

        {/* Role filter — hidden when a fixed role is provided */}
        {!role && (
          <div className="flex gap-1">
            {(
              [
                { value: "all" as const, label: `All (${ALL_PERKS.length})` },
                { value: "killer" as const, label: `Killer (${killerCount})` },
                { value: "survivor" as const, label: `Survivor (${survivorCount})` },
              ] as const
            ).map(({ value: v, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => setRoleFilter(v)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all border",
                  roleFilter === v
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground/60 border-border/60 hover:border-border hover:text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Perk grid */}
      <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2 @lg:grid-cols-3">
        {filtered.map((perk) => (
          <PerkGridItem
            key={perk.id}
            perk={perk}
            isSelected={selectedIds.has(perk.id)}
            isDisabled={isFull && !selectedIds.has(perk.id)}
            onSelect={() => handleSelect(perk)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No perks match your search.</p>
        </div>
      )}

      {/* Count */}
      <p className="text-[10px] text-muted-foreground/40">
        {filtered.length} perks available
      </p>
    </div>
  );
}
