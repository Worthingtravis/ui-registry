import type { ComponentType } from "react";

/**
 * Row split ratio — how left/right columns divide the available width.
 * "2-1" = left gets 2/3, right gets 1/3 (current default)
 * "1-1" = equal halves
 * "1-2" = left gets 1/3, right gets 2/3
 */
export type RowSplit = "2-1" | "1-1" | "1-2";

/** Configuration for a single section instance in a saved layout */
export interface SectionConfig {
  sectionKey: string;
  variant: string;
  visible: boolean;
  column: "left" | "right" | "full";
  /**
   * Row split ratio (only meaningful for left/right sections).
   * When set on a left or right section, determines the grid template
   * for the column group it belongs to. Defaults to "2-1" if unset.
   */
  split?: RowSplit;
}

/** A persisted page layout */
export interface PageLayout {
  schemaVersion: number;
  pageKey: string;
  sections: SectionConfig[];
}

/**
 * Approximate visual height when placed in a side column.
 * Used by randomizeLayout to pair sections of compatible size.
 *   sm — fixed/compact, roughly 1-2 rows (~100-200px)
 *   md — moderate, 3-5 rows (~200-350px)
 *   lg — tall/growing, 6+ rows or unbounded list (~400px+)
 */
export type SizeHint = "sm" | "md" | "lg";

/** Metadata for a single variant (used by editor UI) */
export interface VariantMeta {
  label: string;
  description?: string;
  /** Approximate visual height — used for smart pairing in shuffle. Defaults to "md". */
  sizeHint?: SizeHint;
}

/** Definition of a section type (registered at build time) */
export interface SectionDefinition<TVM extends Record<string, unknown> = Record<string, unknown>> {
  key: string;
  label: string;
  column: "left" | "right" | "full";
  /** Which columns this section may be placed in. undefined = all allowed. */
  allowedColumns?: ("left" | "right" | "full")[];
  variants: Record<string, ComponentType<TVM>>;
  defaultVariant: string;
  variantMeta?: Record<string, VariantMeta>;
  /** When true, PageRenderer skips rendering section headers (component renders its own). */
  hideHeader?: boolean;
  /** When true, the section cannot be hidden via the visibility toggle. */
  alwaysVisible?: boolean;
}

/** Registry of all section definitions for a page */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SectionRegistry = Record<string, SectionDefinition<any>>;

/** Actions exposed from the editor to individual section wrappers */
export interface EditorActions {
  onVariantChange: (sectionKey: string, variant: string) => void;
  onColumnChange: (sectionKey: string, column: "left" | "right" | "full") => void;
  onVisibilityChange: (sectionKey: string, visible: boolean) => void;
  /** Move section up/down in the global layout order (across all columns) */
  onMoveUp?: (sectionKey: string) => void;
  onMoveDown?: (sectionKey: string) => void;
  onToggleLock?: (sectionKey: string) => void;
}
