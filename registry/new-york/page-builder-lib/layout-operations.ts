/**
 * Pure functions for layout manipulation.
 * No React, no side effects — fully testable.
 */

import type { SectionConfig, SectionRegistry, RowSplit, SizeHint } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Column = "left" | "right" | "full";

/** A render row: either a full-width group or a two-column group */
export type RenderRow =
  | { type: "full"; sections: SectionConfig[] }
  | { type: "columns"; left: SectionConfig[]; right: SectionConfig[]; split: RowSplit };

/** CSS grid template columns for each split ratio */
export const SPLIT_GRID_TEMPLATES: Record<RowSplit, string> = {
  "2-1": "1fr 384px",      // current default: left gets ~2/3, right gets fixed 384px
  "1-1": "1fr 1fr",        // equal halves
  "1-2": "384px 1fr",      // left gets fixed 384px, right gets ~2/3
};

export const SPLIT_LABELS: Record<RowSplit, string> = {
  "2-1": "Wide Left",
  "1-1": "Equal",
  "1-2": "Wide Right",
};

export const ALL_SPLITS: RowSplit[] = ["2-1", "1-1", "1-2"];

/** Numeric weight for each size hint — used for pairing and split assignment */
const SIZE_WEIGHT: Record<SizeHint, number> = { sm: 0, md: 1, lg: 2 };

/** Result of a swap operation */
export type SwapResult =
  | { ok: true; sections: SectionConfig[] }
  | { ok: false; reason: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Resolve a section's effective column (config value, falling back to registry default) */
export function resolveColumn(section: SectionConfig, registry: SectionRegistry): Column {
  return section.column ?? registry[section.sectionKey]?.column ?? "full";
}

/** Check whether a section can be placed in a given column */
export function canFitInColumn(sectionKey: string, column: Column, registry: SectionRegistry): boolean {
  const def = registry[sectionKey];
  if (!def) return true; // unknown section = no constraint
  if (!def.allowedColumns) return true; // no restriction = any column
  return def.allowedColumns.includes(column);
}

/** Get all columns a section is allowed in */
export function allowedColumnsFor(sectionKey: string, registry: SectionRegistry): Column[] {
  const def = registry[sectionKey];
  if (!def?.allowedColumns) return ["full", "left", "right"];
  return def.allowedColumns;
}

/** Deduplicate sections — first occurrence wins */
export function dedup(sections: SectionConfig[]): SectionConfig[] {
  const seen = new Set<string>();
  return sections.filter((s) => {
    if (seen.has(s.sectionKey)) return false;
    seen.add(s.sectionKey);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Row building (for interleaved rendering)
// ---------------------------------------------------------------------------

/**
 * Group a flat section array into interleaved render rows.
 * Consecutive full sections → one full row.
 * Consecutive left/right sections → paired column rows (one pair per row,
 * each with its own split ratio).
 * Preserves array order.
 */
export function buildRows(sections: SectionConfig[], registry: SectionRegistry): RenderRow[] {
  const rows: RenderRow[] = [];
  let pendingLeft: SectionConfig[] = [];
  let pendingRight: SectionConfig[] = [];

  function flushColumns() {
    // Scan all sections in the group for the first explicit split
    const split = resolveGroupSplit(pendingLeft, pendingRight);
    rows.push({ type: "columns", left: [...pendingLeft], right: [...pendingRight], split });
    pendingLeft = [];
    pendingRight = [];
  }

  for (const section of sections) {
    const col = resolveColumn(section, registry);

    if (col === "full") {
      if (pendingLeft.length > 0 || pendingRight.length > 0) flushColumns();
      const lastRow = rows[rows.length - 1];
      if (lastRow?.type === "full") {
        lastRow.sections.push(section);
      } else {
        rows.push({ type: "full", sections: [section] });
      }
    } else {
      if (col === "left") pendingLeft.push(section);
      else pendingRight.push(section);
    }
  }

  if (pendingLeft.length > 0 || pendingRight.length > 0) flushColumns();

  return rows;
}

/** Scan all sections in a column group for the first explicit split */
function resolveGroupSplit(left: SectionConfig[], right: SectionConfig[]): RowSplit {
  for (const s of left) if (s.split) return s.split;
  for (const s of right) if (s.split) return s.split;
  return "2-1";
}

// ---------------------------------------------------------------------------
// Mutations (all return new arrays, never mutate)
// ---------------------------------------------------------------------------

/** Move a section up or down by one position in the flat array */
export function moveSection(
  sections: SectionConfig[],
  sectionKey: string,
  direction: "up" | "down",
): SectionConfig[] {
  const idx = sections.findIndex((s) => s.sectionKey === sectionKey);
  if (idx < 0) return sections;

  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= sections.length) return sections;

  const result = [...sections];
  const temp = result[idx]!;
  result[idx] = result[targetIdx]!;
  result[targetIdx] = temp;
  return result;
}

/** Change a section's column assignment in-place (preserves array position) */
export function changeColumn(
  sections: SectionConfig[],
  sectionKey: string,
  column: Column,
): SectionConfig[] {
  return sections.map((s) =>
    s.sectionKey === sectionKey ? { ...s, column } : s,
  );
}

/**
 * Change the split ratio for the column group containing the given section.
 * Updates all left/right sections in the same group since the split applies
 * to the masonry column widths.
 */
export function changeSplit(
  sections: SectionConfig[],
  sectionKey: string,
  split: RowSplit,
  registry: SectionRegistry,
): SectionConfig[] {
  // Find the column group containing this section
  const rows = buildRows(sections, registry);
  const targetRow = rows.find(
    (r) => r.type === "columns" && (
      r.left.some((s) => s.sectionKey === sectionKey) ||
      r.right.some((s) => s.sectionKey === sectionKey)
    ),
  );
  if (!targetRow || targetRow.type !== "columns") return sections;

  const rowKeys = new Set([
    ...targetRow.left.map((s) => s.sectionKey),
    ...targetRow.right.map((s) => s.sectionKey),
  ]);

  return sections.map((s) =>
    rowKeys.has(s.sectionKey) ? { ...s, split } : s,
  );
}

/** Change a section's variant */
export function changeVariant(
  sections: SectionConfig[],
  sectionKey: string,
  variant: string,
): SectionConfig[] {
  return sections.map((s) =>
    s.sectionKey === sectionKey ? { ...s, variant } : s,
  );
}

/** Toggle a section's visibility */
export function changeVisibility(
  sections: SectionConfig[],
  sectionKey: string,
  visible: boolean,
): SectionConfig[] {
  return sections.map((s) =>
    s.sectionKey === sectionKey ? { ...s, visible } : s,
  );
}

/**
 * Swap two sections' positions in the array.
 * If the swap would violate column constraints, the displaced section
 * keeps its own column (stays in-place column-wise, just moves position).
 */
export function swapSections(
  sections: SectionConfig[],
  keyA: string,
  keyB: string,
  registry: SectionRegistry,
): SwapResult {
  const idxA = sections.findIndex((s) => s.sectionKey === keyA);
  const idxB = sections.findIndex((s) => s.sectionKey === keyB);
  if (idxA < 0 || idxB < 0) return { ok: false, reason: "Section not found" };
  if (idxA === idxB) return { ok: true, sections };

  const a = sections[idxA]!;
  const b = sections[idxB]!;

  // Can A fit in B's column?
  const aFitsInBCol = canFitInColumn(a.sectionKey, b.column, registry);
  // Can B fit in A's column?
  const bFitsInACol = canFitInColumn(b.sectionKey, a.column, registry);

  const result = [...sections];

  if (aFitsInBCol && bFitsInACol) {
    // Clean swap: exchange positions and columns
    result[idxA] = { ...b, column: a.column };
    result[idxB] = { ...a, column: b.column };
  } else if (aFitsInBCol) {
    // A can go to B's slot. B can't fit in A's column — keep B's column, just swap positions.
    result[idxA] = { ...b }; // B keeps its own column
    result[idxB] = { ...a, column: b.column }; // A takes B's column
  } else if (bFitsInACol) {
    // B can go to A's slot. A can't fit in B's column — keep A's column, just swap positions.
    result[idxA] = { ...b, column: a.column }; // B takes A's column
    result[idxB] = { ...a }; // A keeps its own column
  } else {
    // Neither can fit in the other's column — just swap positions, keep own columns
    result[idxA] = { ...b };
    result[idxB] = { ...a };
  }

  return { ok: true, sections: result };
}

/**
 * Place a section into a specific slot (position + column).
 * The section moves to the target index and takes the target column.
 * Other sections shift to fill the gap.
 * If the section can't fit in the target column, returns an error.
 */
export function placeSection(
  sections: SectionConfig[],
  sectionKey: string,
  targetIndex: number,
  targetColumn: Column,
  registry: SectionRegistry,
): SwapResult {
  if (!canFitInColumn(sectionKey, targetColumn, registry)) {
    return { ok: false, reason: `${sectionKey} cannot be placed in ${targetColumn} column` };
  }

  const currentIdx = sections.findIndex((s) => s.sectionKey === sectionKey);
  if (currentIdx < 0) return { ok: false, reason: "Section not found" };

  // Remove from current position
  const without = sections.filter((s) => s.sectionKey !== sectionKey);
  const updated = { ...sections[currentIdx]!, column: targetColumn };

  // Clamp target index
  const insertIdx = Math.max(0, Math.min(targetIndex, without.length));

  const result = [
    ...without.slice(0, insertIdx),
    updated,
    ...without.slice(insertIdx),
  ];

  return { ok: true, sections: result };
}

// ---------------------------------------------------------------------------
// Slot computation (for grid editor)
// ---------------------------------------------------------------------------

/** A slot represents a position in the grid where a section can be placed */
export interface LayoutSlot {
  /** Index in the flat sections array (or -1 for empty slots) */
  index: number;
  /** Which column this slot occupies */
  column: Column;
  /** The section currently in this slot, if any */
  sectionKey: string | null;
  /** Row index in the grid (for visual placement) */
  row: number;
  /** Whether this slot is empty and can accept a section */
  isEmpty: boolean;
}

/**
 * Compute the visual grid of slots from a section array.
 * Returns a flat list of slots representing the rendered grid.
 *
 * Rules:
 * - Full sections each occupy their own row (spanning both columns)
 * - Left/right sections pair up into rows when adjacent
 * - If a column row has only left or only right, the other side is an empty slot
 */
export function computeSlots(sections: SectionConfig[], registry: SectionRegistry): LayoutSlot[] {
  const rows = buildRows(sections, registry);
  const slots: LayoutSlot[] = [];
  let rowIdx = 0;

  // Pre-build index map to avoid O(n) findIndex per section
  const indexMap = new Map<string, number>();
  sections.forEach((s, i) => indexMap.set(s.sectionKey, i));

  for (const row of rows) {
    if (row.type === "full") {
      for (const section of row.sections) {
        slots.push({
          index: indexMap.get(section.sectionKey) ?? -1,
          column: "full",
          sectionKey: section.sectionKey,
          row: rowIdx,
          isEmpty: false,
        });
        rowIdx++;
      }
    } else {
      // Two-column row: pair up left and right sections
      const maxLen = Math.max(row.left.length, row.right.length);
      for (let i = 0; i < maxLen; i++) {
        const left = row.left[i];
        const right = row.right[i];

        if (left) {
          slots.push({
            index: indexMap.get(left.sectionKey) ?? -1,
            column: "left",
            sectionKey: left.sectionKey,
            row: rowIdx,
            isEmpty: false,
          });
        } else {
          slots.push({
            index: -1,
            column: "left",
            sectionKey: null,
            row: rowIdx,
            isEmpty: true,
          });
        }

        if (right) {
          slots.push({
            index: indexMap.get(right.sectionKey) ?? -1,
            column: "right",
            sectionKey: right.sectionKey,
            row: rowIdx,
            isEmpty: false,
          });
        } else {
          slots.push({
            index: -1,
            column: "right",
            sectionKey: null,
            row: rowIdx,
            isEmpty: true,
          });
        }

        rowIdx++;
      }
    }
  }

  return slots;
}

/** Count total grid rows */
export function countRows(slots: LayoutSlot[]): number {
  if (slots.length === 0) return 0;
  return Math.max(...slots.map((s) => s.row)) + 1;
}

/** Move a section to a specific index in one pass (no intermediate arrays) */
export function moveSectionToIndex(
  sections: SectionConfig[],
  sectionKey: string,
  targetIndex: number,
): SectionConfig[] {
  const fromIdx = sections.findIndex((s) => s.sectionKey === sectionKey);
  if (fromIdx < 0 || fromIdx === targetIndex) return sections;
  const result = [...sections];
  const [item] = result.splice(fromIdx, 1);
  result.splice(targetIndex, 0, item!);
  return result;
}

/** Pick the first fixture label for each section — used to auto-activate demo data on edit mode entry */
export function buildAutoFixtures(
  fixtures: Record<string, Record<string, Record<string, unknown>>>,
): Record<string, string> {
  const auto: Record<string, string> = {};
  for (const [key, sectionFixtures] of Object.entries(fixtures)) {
    const firstLabel = Object.keys(sectionFixtures)[0];
    if (firstLabel) auto[key] = firstLabel;
  }
  return auto;
}

/** Get all sections that could be placed in a given column (respects allowedColumns) */
export function sectionsForColumn(
  sections: SectionConfig[],
  column: Column,
  registry: SectionRegistry,
): SectionConfig[] {
  return sections.filter((s) => canFitInColumn(s.sectionKey, column, registry));
}

// ---------------------------------------------------------------------------
// Randomize — roll the dice on layout composition
// ---------------------------------------------------------------------------

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Generate a random layout from the registry.
 * Respects section constraints (allowedColumns, alwaysVisible).
 * Randomizes: variant selection, section order, column placement, split ratios.
 * Preserves user visibility choices from `currentSections`. Hidden sections
 * are sorted to the bottom.
 */
export function randomizeLayout(
  registry: SectionRegistry,
  currentSections?: SectionConfig[],
  lockedKeys?: ReadonlySet<string>,
): SectionConfig[] {
  // Build visibility map from current layout — preserve user's show/hide choices
  const visibilityMap = new Map<string, boolean>();
  if (currentSections) {
    for (const s of currentSections) visibilityMap.set(s.sectionKey, s.visible);
  }
  const keys = Object.keys(registry);

  // Separate full-only from sections that can move around
  const fullOnly: string[] = [];
  const flexible: string[] = [];
  for (const key of keys) {
    const def = registry[key];
    if (!def) continue;
    // Locked sections are preserved as-is — skip them from randomization
    if (lockedKeys?.has(key)) continue;
    if (def.allowedColumns && def.allowedColumns.length === 1 && def.allowedColumns[0] === "full") {
      fullOnly.push(key);
    } else {
      flexible.push(key);
    }
  }

  const randomized: SectionConfig[] = [];

  // Full-only sections stay full, get random variant
  for (const key of fullOnly) {
    const def = registry[key]!;
    const variants = Object.keys(def.variants);
    const visible = def.alwaysVisible ? true : (visibilityMap.get(key) ?? true);
    randomized.push({
      sectionKey: key,
      variant: pick(variants),
      visible,
      column: "full",
    });
  }

  // Pick a random variant for each flexible section, then decide columns
  // based on size compatibility so paired sections have similar height.
  type Candidate = {
    key: string;
    variant: string;
    visible: boolean;
    size: SizeHint;
    canSide: boolean; // can go left or right
  };

  const candidates: Candidate[] = shuffle(flexible).map((key) => {
    const def = registry[key]!;
    const variant = pick(Object.keys(def.variants));
    const visible = def.alwaysVisible ? true : (visibilityMap.get(key) ?? true);
    const size: SizeHint = def.variantMeta?.[variant]?.sizeHint ?? "md";
    const allowed = def.allowedColumns ?? (["full", "left", "right"] as Column[]);
    const canSide = allowed.includes("left") || allowed.includes("right");
    return { key, variant, visible, size, canSide };
  });

  // Single-pass partition: sideable vs full-destined, and bucket by size
  const sideable: Candidate[] = [];
  const fullDestined: Candidate[] = [];
  const sizeBuckets: Record<SizeHint, Candidate[]> = { sm: [], md: [], lg: [] };
  for (const c of candidates) {
    if (c.canSide && c.visible) {
      sideable.push(c);
      sizeBuckets[c.size].push(c);
    } else {
      fullDestined.push(c);
    }
  }

  // Avoid TS "unused variable" warning on sideable
  void sideable;

  // Pair sections by size — same size first, then adjacent sizes
  const bySizeOrder: SizeHint[] = shuffle(["sm", "md", "lg"] as SizeHint[]);
  const paired: Candidate[] = [];
  const unpaired: Candidate[] = [];

  for (const size of bySizeOrder) {
    const bucket = shuffle(sizeBuckets[size]);
    // Pair up: take two at a time
    let i = 0;
    for (; i + 1 < bucket.length; i += 2) {
      paired.push(bucket[i]!, bucket[i + 1]!);
    }
    // Odd one out — try to pair with adjacent size later
    if (i < bucket.length) unpaired.push(bucket[i]!);
  }

  // Try to pair remaining unpaired sections with each other (adjacent sizes)
  // sm+md or md+lg is acceptable; sm+lg is not
  const stillUnpaired: Candidate[] = [];
  const unpairedShuffled = shuffle(unpaired);
  const used = new Set<number>();

  for (let i = 0; i < unpairedShuffled.length; i++) {
    if (used.has(i)) continue;
    let matched = false;
    for (let j = i + 1; j < unpairedShuffled.length; j++) {
      if (used.has(j)) continue;
      const dist = Math.abs(
        SIZE_WEIGHT[unpairedShuffled[i]!.size] - SIZE_WEIGHT[unpairedShuffled[j]!.size],
      );
      if (dist <= 1) {
        paired.push(unpairedShuffled[i]!, unpairedShuffled[j]!);
        used.add(i);
        used.add(j);
        matched = true;
        break;
      }
    }
    if (!matched) stillUnpaired.push(unpairedShuffled[i]!);
  }

  // Emit paired sections as left/right rows, each with its own random split.
  // For asymmetric splits, put the smaller section on the narrow side.
  for (let i = 0; i + 1 < paired.length; i += 2) {
    const [a, b] = [paired[i]!, paired[i + 1]!];
    const split = pick(ALL_SPLITS);

    const aWeight = SIZE_WEIGHT[a.size];
    const bWeight = SIZE_WEIGHT[b.size];

    let leftCandidate: Candidate;
    let rightCandidate: Candidate;

    if (split === "1-1" || aWeight === bWeight) {
      // Equal split or same size — random assignment
      const side = pick(["left", "right"] as const);
      leftCandidate = side === "left" ? a : b;
      rightCandidate = side === "left" ? b : a;
    } else if (split === "2-1") {
      // Wide left, narrow right — smaller goes right
      leftCandidate = aWeight >= bWeight ? a : b;
      rightCandidate = aWeight >= bWeight ? b : a;
    } else {
      // "1-2": narrow left, wide right — smaller goes left
      leftCandidate = aWeight <= bWeight ? a : b;
      rightCandidate = aWeight <= bWeight ? b : a;
    }

    randomized.push(
      { sectionKey: leftCandidate.key, variant: leftCandidate.variant, visible: leftCandidate.visible, column: "left", split },
      { sectionKey: rightCandidate.key, variant: rightCandidate.variant, visible: rightCandidate.visible, column: "right", split },
    );
  }

  // Unpaired sections (odd one out, or sm+lg mismatch) go full width
  for (const c of [...stillUnpaired, ...fullDestined]) {
    randomized.push({
      sectionKey: c.key,
      variant: c.variant,
      visible: c.visible,
      column: "full",
    });
  }

  // Merge: walk original order, keep locked sections in place, fill gaps with randomized
  let rIdx = 0;
  const merged: SectionConfig[] = [];

  if (lockedKeys?.size && currentSections) {
    for (const s of currentSections) {
      if (lockedKeys.has(s.sectionKey)) {
        merged.push({ ...s });
      } else if (rIdx < randomized.length) {
        merged.push(randomized[rIdx++]!);
      }
    }
    while (rIdx < randomized.length) merged.push(randomized[rIdx++]!);
  } else {
    merged.push(...randomized);
  }

  // Sort hidden sections to the bottom so they don't fragment the visible layout
  const vis: SectionConfig[] = [];
  const hid: SectionConfig[] = [];
  for (const s of merged) (s.visible ? vis : hid).push(s);
  return [...vis, ...hid];
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Validates and upgrades a stored layout JSON to the current schema.
 * If the raw value is invalid or on an unknown schema version, returns the provided default.
 */
export function migrateLayout(raw: unknown, defaultLayout: import("./types").PageLayout): import("./types").PageLayout {
  if (
    raw == null ||
    typeof raw !== "object" ||
    !("schemaVersion" in raw) ||
    (raw as { schemaVersion: unknown }).schemaVersion !== CURRENT_SCHEMA_VERSION
  ) {
    return defaultLayout;
  }

  // Schema version 1 — validate required fields then return as-is
  const candidate = raw as Record<string, unknown>;
  if (
    typeof candidate["pageKey"] !== "string" ||
    !Array.isArray(candidate["sections"])
  ) {
    return defaultLayout;
  }

  const layout = raw as import("./types").PageLayout;

  // Backfill: append sections from default that are missing in the saved layout.
  // This ensures existing users get new features without resetting.
  const existingKeys = new Set(layout.sections.map((s) => s.sectionKey));
  const missing = defaultLayout.sections.filter((s) => !existingKeys.has(s.sectionKey));
  if (missing.length > 0) {
    return { ...layout, sections: [...layout.sections, ...missing] };
  }

  return layout;
}
