"use client";

import { useCallback, useMemo, useState } from "react";
import { Eye, EyeOff, ChevronUp, ChevronDown, ArrowLeftRight, X, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageLayout, SectionConfig, SectionRegistry, RowSplit } from "@/registry/new-york/page-builder-lib/types";
import {
  computeSlots,
  dedup,
  moveSection,
  changeColumn,
  changeVariant,
  changeVisibility,
  changeSplit,
  placeSection,
  swapSections,
  canFitInColumn,
  allowedColumnsFor,
  SPLIT_GRID_TEMPLATES,
  SPLIT_LABELS,
  ALL_SPLITS,
  type Column,
  type LayoutSlot,
} from "@/registry/new-york/page-builder-lib/layout-operations";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LayoutGridEditorProps {
  layout: PageLayout;
  registry: SectionRegistry;
  lockedKeys: ReadonlySet<string>;
  onLayoutChange: (layout: PageLayout) => void;
  onToggleLock: (key: string) => void;
}

/** Slots grouped by visual row, with the row's split ratio */
interface SlotRowGroup {
  rowIndex: number;
  slots: LayoutSlot[];
  split: RowSplit;
  /** Whether all slots in this row are full-width */
  isFullRow: boolean;
  /** A section key from this row (for split change targeting) */
  anySectionKey: string | null;
  /** True for the first visual row in a column group — show split picker here only */
  isGroupStart: boolean;
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const CELL_BASE = cn(
  "rounded-lg border p-3 transition-all duration-150 min-h-[56px]",
  "flex flex-col gap-1.5",
);

const CELL_OCCUPIED = cn(
  CELL_BASE,
  "border-border/50 bg-card/40 group/cell",
);

const CELL_EMPTY = cn(
  CELL_BASE,
  "border-dashed border-border/50 bg-muted/10",
  "items-center justify-center text-muted-foreground/70",
);

const CELL_SELECTED = cn(
  "ring-2 ring-primary/50 border-primary/40 bg-primary/5",
);

const CELL_SWAP_TARGET = cn(
  "ring-2 ring-amber-500/50 border-amber-500/40 bg-amber-500/5 cursor-pointer",
);

const ICON_BUTTON = cn(
  "flex items-center justify-center size-7 rounded transition-colors",
  "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/40",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
);

const SELECT_CLASSES = cn(
  "text-[11px] rounded border border-border/50 bg-background px-1.5 py-0.5",
  "text-foreground hover:border-border transition-colors",
  "focus:outline-none focus:ring-1 focus:ring-ring/50 cursor-pointer",
);

// ---------------------------------------------------------------------------
// GridSlotCell — one occupied cell in the grid
// ---------------------------------------------------------------------------

interface GridSlotCellProps {
  config: SectionConfig;
  registry: SectionRegistry;
  isSelected: boolean;
  isSwapTarget: boolean;
  isFirst: boolean;
  isLast: boolean;
  isLocked: boolean;
  onSelect: (key: string) => void;
  onMoveUp: (key: string) => void;
  onMoveDown: (key: string) => void;
  onVariantChange: (key: string, variant: string) => void;
  onColumnChange: (key: string, column: Column) => void;
  onVisibilityChange: (key: string, visible: boolean) => void;
  onToggleLock: (key: string) => void;
}

function GridSlotCell({
  config,
  registry,
  isSelected,
  isSwapTarget,
  isFirst,
  isLast,
  isLocked,
  onSelect,
  onMoveUp,
  onMoveDown,
  onVariantChange,
  onColumnChange,
  onVisibilityChange,
  onToggleLock,
}: GridSlotCellProps) {
  const def = registry[config.sectionKey];
  if (!def) return null;

  const variants = Object.keys(def.variants);
  const variantMeta = def.variantMeta;
  const allowed = allowedColumnsFor(config.sectionKey, registry);

  return (
    <div
      className={cn(
        CELL_OCCUPIED,
        isSelected && CELL_SELECTED,
        isSwapTarget && CELL_SWAP_TARGET,
        !config.visible && !def.alwaysVisible && "opacity-50",
      )}
      onClick={() => onSelect(config.sectionKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(config.sectionKey);
        }
      }}
      aria-label={`${def.label} section${isSelected ? " (selected)" : ""}`}
      aria-pressed={isSelected}
    >
      {/* Top row: label + controls */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex-1 truncate">
          {def.label}
          {variants.length > 1 && variantMeta?.[config.variant] && (
            <span className="ml-1.5 font-normal normal-case tracking-normal text-muted-foreground/50">
              · {variantMeta[config.variant]!.label}
            </span>
          )}
        </span>

        {/* Move up/down */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMoveUp(config.sectionKey); }}
          disabled={isFirst}
          className={cn(ICON_BUTTON, isFirst && "opacity-30 cursor-not-allowed")}
          aria-label={`Move ${def.label} up`}
        >
          <ChevronUp className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMoveDown(config.sectionKey); }}
          disabled={isLast}
          className={cn(ICON_BUTTON, isLast && "opacity-30 cursor-not-allowed")}
          aria-label={`Move ${def.label} down`}
        >
          <ChevronDown className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleLock(config.sectionKey); }}
          className={cn(
            ICON_BUTTON,
            isLocked ? "text-primary" : "text-muted-foreground/50",
          )}
          aria-label={
            isLocked
              ? `Unlock ${def.label} for shuffle`
              : `Lock ${def.label} from shuffle`
          }
        >
          {isLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
        </button>

        {/* Visibility toggle — hidden for alwaysVisible sections */}
        {!def.alwaysVisible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityChange(config.sectionKey, !config.visible);
            }}
            className={cn(ICON_BUTTON)}
            aria-label={config.visible ? `Hide ${def.label}` : `Show ${def.label}`}
          >
            {config.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          </button>
        )}
      </div>

      {/* Bottom row: pickers */}
      <div className="flex flex-wrap items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {/* Variant picker */}
        {variants.length > 1 && (
          <select
            value={config.variant}
            onChange={(e) => onVariantChange(config.sectionKey, e.target.value)}
            className={SELECT_CLASSES}
            aria-label={`Variant for ${def.label}`}
          >
            {variants.map((v) => (
              <option key={v} value={v}>
                {variantMeta?.[v]?.label ?? v}
              </option>
            ))}
          </select>
        )}

        {/* Column picker — button group (or locked label) */}
        {allowed.length > 1 ? (
          <div
            className="flex items-center rounded border border-border/30 overflow-hidden"
            role="group"
            aria-label={`Column for ${def.label}`}
          >
            {allowed.map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => onColumnChange(config.sectionKey, col)}
                className={cn(
                  "px-1.5 py-0.5 text-[10px] transition-colors",
                  col === config.column
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted/30",
                )}
                aria-pressed={col === config.column}
              >
                {col === "full" ? "Full" : col === "left" ? "Left" : "Right"}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-[10px] text-muted-foreground/60 px-1">
            {config.column === "full"
              ? "Full only"
              : config.column === "left"
              ? "Left only"
              : "Right only"}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptySlotCell — placeholder for unoccupied column positions
// ---------------------------------------------------------------------------

interface EmptySlotCellProps {
  column: Column;
  isSwapTarget: boolean;
  onClick: () => void;
}

function EmptySlotCell({ column, isSwapTarget, onClick }: EmptySlotCellProps) {
  return (
    <div
      className={cn(CELL_EMPTY, isSwapTarget && CELL_SWAP_TARGET)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Empty ${column} slot`}
    >
      <span className="text-[10px] uppercase tracking-wider">
        {isSwapTarget ? "Place here" : "+ open slot"}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SplitPicker — row split ratio control
// ---------------------------------------------------------------------------

interface SplitPickerProps {
  split: RowSplit;
  onChange: (split: RowSplit) => void;
}

function SplitPicker({ split, onChange }: SplitPickerProps) {
  return (
    <div className="flex items-center gap-1 py-1">
      {ALL_SPLITS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            "px-2 py-0.5 rounded text-[10px] transition-colors",
            s === split
              ? "bg-primary/10 text-primary border border-primary/30 font-semibold"
              : "text-muted-foreground/60 hover:text-muted-foreground border border-transparent hover:border-border/40",
          )}
          aria-label={`Set split to ${SPLIT_LABELS[s]}`}
          aria-pressed={s === split}
        >
          {SPLIT_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Group a flat list of slots by row index, attaching split and metadata.
 * Reads split values directly from each section's stored `split` field.
 */
function groupSlotsByRow(
  slots: LayoutSlot[],
  sections: SectionConfig[],
): SlotRowGroup[] {
  const rowMap = new Map<number, LayoutSlot[]>();
  for (const slot of slots) {
    const existing = rowMap.get(slot.row);
    if (existing) {
      existing.push(slot);
    } else {
      rowMap.set(slot.row, [slot]);
    }
  }

  const splitByKey = new Map<string, RowSplit>();
  for (const s of sections) {
    if (s.split) splitByKey.set(s.sectionKey, s.split);
  }

  const groups: SlotRowGroup[] = [];
  const sortedRows = Array.from(rowMap.entries()).sort((a, b) => a[0] - b[0]);

  let groupSplit: RowSplit = "2-1";

  for (const [rowIndex, rowSlots] of sortedRows) {
    const isFullRow = rowSlots.every((s) => s.column === "full");

    if (isFullRow) {
      groupSplit = "2-1";
    }

    let split: RowSplit = groupSplit;
    let anySectionKey: string | null = null;
    for (const s of rowSlots) {
      if (s.sectionKey) {
        if (!anySectionKey) anySectionKey = s.sectionKey;
        const found = splitByKey.get(s.sectionKey);
        if (found) {
          split = found;
          groupSplit = found;
          break;
        }
      }
    }

    // Sort slots within a row: left before right
    const sorted = [...rowSlots].sort((a, b) => {
      const order: Record<Column, number> = { full: 0, left: 0, right: 1 };
      return order[a.column] - order[b.column];
    });

    const prevGroup = groups[groups.length - 1];
    const isGroupStart = !isFullRow && (!prevGroup || prevGroup.isFullRow);

    groups.push({ rowIndex, slots: sorted, split, isFullRow, anySectionKey, isGroupStart });
  }

  return groups;
}

/**
 * Compute the target index in the flat sections array for an empty slot.
 */
function targetIndexForEmptySlot(
  emptySlot: LayoutSlot,
  rowSlots: LayoutSlot[],
  sectionCount: number,
): number {
  const occupied = rowSlots.filter((s) => !s.isEmpty);

  if (occupied.length === 0) {
    return sectionCount;
  }

  if (emptySlot.column === "right") {
    const maxIdx = Math.max(...occupied.map((s) => s.index));
    return maxIdx + 1;
  }

  if (emptySlot.column === "left") {
    const minIdx = Math.min(...occupied.map((s) => s.index));
    return minIdx;
  }

  return sectionCount;
}

// ---------------------------------------------------------------------------
// LayoutGridEditor — main component
// ---------------------------------------------------------------------------

/**
 * Visual grid editor for page layouts.
 *
 * Renders a two-column grid representing the page layout. Each occupied cell
 * shows section name, variant/column pickers, visibility toggle, and lock.
 *
 * Click a section to select it, then click a destination section or empty
 * slot to swap/place it. Use up/down arrows for sequential reordering.
 *
 * Split ratio pickers appear at the start of each two-column group.
 *
 * @example
 * ```tsx
 * <LayoutGridEditor
 *   layout={draftLayout}
 *   registry={MY_REGISTRY}
 *   lockedKeys={lockedKeys}
 *   onLayoutChange={setDraftLayout}
 *   onToggleLock={handleToggleLock}
 * />
 * ```
 */
export function LayoutGridEditor({
  layout,
  registry,
  lockedKeys,
  onLayoutChange,
  onToggleLock,
}: LayoutGridEditorProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const sections = useMemo(() => dedup(layout.sections), [layout.sections]);

  const slots = useMemo(() => computeSlots(sections, registry), [sections, registry]);
  const rowGroups = useMemo(() => groupSlotsByRow(slots, sections), [slots, sections]);

  const emit = useCallback(
    (newSections: SectionConfig[]) => {
      onLayoutChange({ ...layout, sections: newSections });
    },
    [layout, onLayoutChange],
  );

  const handleMoveUp = useCallback(
    (key: string) => {
      const result = moveSection(sections, key, "up");
      if (result !== sections) emit(result);
    },
    [sections, emit],
  );

  const handleMoveDown = useCallback(
    (key: string) => {
      const result = moveSection(sections, key, "down");
      if (result !== sections) emit(result);
    },
    [sections, emit],
  );

  const handleVariantChange = useCallback(
    (key: string, variant: string) => {
      emit(changeVariant(sections, key, variant));
    },
    [sections, emit],
  );

  const handleColumnChange = useCallback(
    (key: string, column: Column) => {
      emit(changeColumn(sections, key, column));
    },
    [sections, emit],
  );

  const handleVisibilityChange = useCallback(
    (key: string, visible: boolean) => {
      emit(changeVisibility(sections, key, visible));
    },
    [sections, emit],
  );

  const handleSplitChange = useCallback(
    (anySectionInGroup: string, split: RowSplit) => {
      emit(changeSplit(sections, anySectionInGroup, split, registry));
    },
    [sections, registry, emit],
  );

  const handleSelect = useCallback(
    (key: string) => {
      if (!selectedKey) {
        setSelectedKey(key);
        return;
      }
      if (selectedKey === key) {
        setSelectedKey(null);
        return;
      }

      const result = swapSections(sections, selectedKey, key, registry);
      if (result.ok) emit(result.sections);
      setSelectedKey(null);
    },
    [selectedKey, sections, registry, emit],
  );

  const handlePlaceInEmpty = useCallback(
    (slot: LayoutSlot, rowSlots: LayoutSlot[]) => {
      if (!selectedKey) return;

      const targetIndex = targetIndexForEmptySlot(slot, rowSlots, sections.length);

      const effectiveColumn = canFitInColumn(selectedKey, slot.column, registry)
        ? slot.column
        : (allowedColumnsFor(selectedKey, registry)[0] ?? slot.column);

      const result = placeSection(sections, selectedKey, targetIndex, effectiveColumn, registry);
      if (result.ok) emit(result.sections);
      setSelectedKey(null);
    },
    [selectedKey, sections, registry, emit],
  );

  const handleDeselect = useCallback(() => {
    setSelectedKey(null);
  }, []);

  const globalCount = sections.length;

  return (
    <div className="rounded-xl border border-border/40 bg-card/10 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Layout Editor
        </p>
        <p className="text-xs text-muted-foreground">
          {selectedKey ? "Select a destination" : "Select a section to move it"}
        </p>
      </div>

      {/* Selection indicator */}
      {selectedKey && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary">
          <ArrowLeftRight className="size-3.5 shrink-0" />
          <span className="truncate">
            Moving <strong>{registry[selectedKey]?.label ?? selectedKey}</strong> — tap a slot
            or section to place it
          </span>
          <button
            type="button"
            onClick={handleDeselect}
            className="ml-auto shrink-0 hover:bg-primary/10 rounded p-0.5"
            aria-label="Cancel move"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Grid rows */}
      {rowGroups.map((group) => {
        if (group.isFullRow) {
          return (
            <div key={group.rowIndex} className="space-y-2">
              {group.slots.map((slot) => {
                if (slot.isEmpty) {
                  return (
                    <EmptySlotCell
                      key={`empty-full-${group.rowIndex}`}
                      column="full"
                      isSwapTarget={selectedKey !== null}
                      onClick={() => handlePlaceInEmpty(slot, group.slots)}
                    />
                  );
                }

                const config = sections[slot.index];
                if (!config) return null;

                return (
                  <GridSlotCell
                    key={config.sectionKey}
                    config={config}
                    registry={registry}
                    isSelected={selectedKey === config.sectionKey}
                    isSwapTarget={selectedKey !== null && selectedKey !== config.sectionKey}
                    isFirst={slot.index === 0}
                    isLast={slot.index === globalCount - 1}
                    onSelect={handleSelect}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onVariantChange={handleVariantChange}
                    onColumnChange={handleColumnChange}
                    onVisibilityChange={handleVisibilityChange}
                    isLocked={lockedKeys.has(config.sectionKey)}
                    onToggleLock={onToggleLock}
                  />
                );
              })}
            </div>
          );
        }

        // Two-column row
        const leftSlot = group.slots.find((s) => s.column === "left");
        const rightSlot = group.slots.find((s) => s.column === "right");

        return (
          <div key={group.rowIndex} className="space-y-2">
            {/* Split ratio picker — shown once per column group, hidden on mobile */}
            {group.isGroupStart && group.anySectionKey && (
              <div className="hidden sm:flex justify-center">
                <SplitPicker
                  split={group.split}
                  onChange={(s) => handleSplitChange(group.anySectionKey!, s)}
                />
              </div>
            )}

            {/* Two-column grid — stacks on small screens */}
            <div
              className="grid grid-cols-1 sm:grid-cols-[var(--split)] gap-2 items-start"
              style={{ "--split": SPLIT_GRID_TEMPLATES[group.split] } as React.CSSProperties}
            >
              {/* Left cell */}
              {leftSlot && !leftSlot.isEmpty ? (
                <GridSlotCell
                  config={sections[leftSlot.index]!}
                  registry={registry}
                  isSelected={selectedKey === leftSlot.sectionKey}
                  isSwapTarget={selectedKey !== null && selectedKey !== leftSlot.sectionKey}
                  isFirst={leftSlot.index === 0}
                  isLast={leftSlot.index === globalCount - 1}
                  onSelect={handleSelect}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onVariantChange={handleVariantChange}
                  onColumnChange={handleColumnChange}
                  onVisibilityChange={handleVisibilityChange}
                  isLocked={lockedKeys.has(leftSlot.sectionKey!)}
                  onToggleLock={onToggleLock}
                />
              ) : (
                <EmptySlotCell
                  column="left"
                  isSwapTarget={selectedKey !== null}
                  onClick={() => {
                    if (leftSlot) handlePlaceInEmpty(leftSlot, group.slots);
                  }}
                />
              )}

              {/* Right cell */}
              {rightSlot && !rightSlot.isEmpty ? (
                <GridSlotCell
                  config={sections[rightSlot.index]!}
                  registry={registry}
                  isSelected={selectedKey === rightSlot.sectionKey}
                  isSwapTarget={selectedKey !== null && selectedKey !== rightSlot.sectionKey}
                  isFirst={rightSlot.index === 0}
                  isLast={rightSlot.index === globalCount - 1}
                  onSelect={handleSelect}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onVariantChange={handleVariantChange}
                  onColumnChange={handleColumnChange}
                  onVisibilityChange={handleVisibilityChange}
                  isLocked={lockedKeys.has(rightSlot.sectionKey!)}
                  onToggleLock={onToggleLock}
                />
              ) : (
                <EmptySlotCell
                  column="right"
                  isSwapTarget={selectedKey !== null}
                  onClick={() => {
                    if (rightSlot) handlePlaceInEmpty(rightSlot, group.slots);
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
