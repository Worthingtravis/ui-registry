"use client";

import React from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  FlaskConical,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditorActions } from "@/registry/new-york/page-builder-lib/types";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const COLUMN_LABELS: Record<"full" | "left" | "right", string> = {
  full: "Full Width",
  left: "Left Column",
  right: "Right Column",
};

const ICON_BUTTON = cn(
  "flex items-center justify-center size-6 rounded transition-colors",
);

const SELECT_CLASSES = cn(
  "text-xs rounded-md border border-border/40 bg-background/50 px-2 py-1",
  "text-muted-foreground hover:border-border transition-colors",
  "focus:outline-none focus:ring-1 focus:ring-ring/50 cursor-pointer",
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type { EditorActions };

export interface SortableSectionProps {
  id: string;
  editMode: boolean;
  /** Preview mode — shows variant switcher on hover, no drag/column/visibility controls */
  previewMode?: boolean;
  label: string;
  variant: string;
  variantOptions: string[];
  /** Human-readable labels keyed by variant name (from variantMeta) */
  variantLabels?: Record<string, string>;
  column: "left" | "right" | "full";
  columnOptions: ("left" | "right" | "full")[];
  visible: boolean;
  /** When true, treats as always-visible (no hide button in preview mode) */
  disabled?: boolean;
  editorActions: EditorActions;
  isFirst?: boolean;
  isLast?: boolean;
  /** Available preview fixture labels for this section (omit if none) */
  fixtureOptions?: string[];
  /** Currently selected fixture label (empty string = live data) */
  activeFixture?: string;
  onFixtureChange?: (sectionKey: string, fixture: string) => void;
  /** Whether this section is locked from shuffle */
  isLocked?: boolean;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// SortableSection
// ---------------------------------------------------------------------------

/**
 * Per-section wrapper that renders editor controls (toolbar, drag handle,
 * variant/column/visibility pickers) in edit mode, a hover overlay in
 * preview mode, or a plain wrapper in view mode.
 *
 * Note: drag reordering uses the up/down arrow buttons. @dnd-kit is NOT
 * required — use `editorActions.onMoveUp` / `onMoveDown` instead.
 *
 * @example
 * ```tsx
 * <SortableSection
 *   id="my-section"
 *   editMode={editMode}
 *   label="My Section"
 *   variant="default"
 *   variantOptions={["default", "compact"]}
 *   column="full"
 *   columnOptions={["full", "left", "right"]}
 *   visible={visible}
 *   editorActions={editorActions}
 * >
 *   <MySectionContent />
 * </SortableSection>
 * ```
 */
export function SortableSection({
  id,
  editMode,
  previewMode = false,
  label,
  variant,
  variantOptions,
  column,
  columnOptions,
  visible,
  disabled = false,
  variantLabels,
  editorActions,
  isFirst = false,
  isLast = false,
  fixtureOptions,
  activeFixture = "",
  onFixtureChange,
  isLocked = false,
  children,
}: SortableSectionProps) {
  const {
    onVariantChange,
    onColumnChange,
    onVisibilityChange,
    onMoveUp,
    onMoveDown,
    onToggleLock,
  } = editorActions;

  // View mode: minimal wrapper
  if (!editMode && !previewMode) {
    return (
      <div id={id}>
        {children}
      </div>
    );
  }

  // Preview mode: variant switcher + visibility toggle on hover
  if (previewMode && !editMode) {
    const hasVariants = variantOptions.length > 1;
    const isAlwaysVisible = disabled;

    // Hidden section — collapsed placeholder
    if (!visible) {
      return (
        <div
          id={id}
          className="rounded-xl border border-dashed border-border/40 bg-card/20 group/preview"
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 flex-1">
              {label}
            </span>
            <span className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.15em]">
              Hidden
            </span>
            <button
              type="button"
              onClick={() => onVisibilityChange(id, true)}
              className={cn(
                "flex items-center justify-center size-7 rounded transition-colors",
                "text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-muted/30",
              )}
              aria-label={`Show ${label}`}
            >
              <EyeOff className="size-4" />
            </button>
          </div>
        </div>
      );
    }

    const variantIndex = variantOptions.indexOf(variant);
    const prevVariant = variantIndex > 0 ? variantOptions[variantIndex - 1] : undefined;
    const nextVariant =
      variantIndex < variantOptions.length - 1 ? variantOptions[variantIndex + 1] : undefined;

    return (
      <div id={id} className="group/preview relative">
        {children}
        <div
          className={cn(
            "absolute top-2 right-2 z-30 flex flex-col gap-1 px-2 py-1.5 rounded-lg",
            "bg-card/90 backdrop-blur-sm border border-border/40 shadow-lg",
            "opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200",
          )}
        >
          {/* Title row + action icons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex-1">
              {label}
            </span>
            {!isAlwaysVisible && (
              <button
                type="button"
                onClick={() => onVisibilityChange(id, false)}
                className={cn(
                  ICON_BUTTON,
                  "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50",
                )}
                aria-label={`Hide ${label}`}
              >
                <Eye className="size-3.5" />
              </button>
            )}
            {onToggleLock && (
              <button
                type="button"
                onClick={() => onToggleLock(id)}
                className={cn(
                  ICON_BUTTON,
                  isLocked
                    ? "text-primary hover:text-primary/80 hover:bg-primary/10"
                    : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50",
                )}
                aria-label={
                  isLocked ? `Unlock ${label} for shuffle` : `Lock ${label} from shuffle`
                }
              >
                {isLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
              </button>
            )}
          </div>

          {/* Variant selector row: prev [dropdown] next */}
          {hasVariants && (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => prevVariant && onVariantChange(id, prevVariant)}
                disabled={!prevVariant}
                className={cn(
                  ICON_BUTTON,
                  prevVariant
                    ? "text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/50"
                    : "text-muted-foreground/20 cursor-not-allowed",
                )}
                aria-label={`Previous ${label} variant`}
              >
                <ChevronUp className="size-3.5 -rotate-90" />
              </button>
              <select
                value={variant}
                onChange={(e) => onVariantChange(id, e.target.value)}
                className={cn(SELECT_CLASSES, "flex-1 min-w-0")}
                aria-label={`Switch ${label} variant`}
              >
                {variantOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {variantLabels?.[opt] ?? opt}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => nextVariant && onVariantChange(id, nextVariant)}
                disabled={!nextVariant}
                className={cn(
                  ICON_BUTTON,
                  nextVariant
                    ? "text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/50"
                    : "text-muted-foreground/20 cursor-not-allowed",
                )}
                aria-label={`Next ${label} variant`}
              >
                <ChevronDown className="size-3.5 -rotate-90" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit mode: toolbar + optional content
  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        "border-border/40 bg-card/20",
        disabled && "opacity-40 pointer-events-none",
        !visible && "border-dashed",
      )}
    >
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label={`${label} section controls`}
        className={cn(
          "border-b",
          visible ? "border-border/30" : "border-transparent",
        )}
      >
        {/* Top row: drag handle indicator + label + visibility */}
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Reorder controls: drag handle icon (decorative) + up/down arrows */}
          <div className="flex items-center gap-0.5">
            <div
              className={cn(
                "flex items-center justify-center size-7 rounded text-muted-foreground/30",
                "cursor-default select-none",
              )}
              aria-hidden="true"
            >
              <GripVertical className="size-4" />
            </div>

            {onMoveUp && (
              <button
                type="button"
                onClick={() => onMoveUp(id)}
                disabled={isFirst}
                className={cn(
                  "flex items-center justify-center size-7 rounded transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isFirst
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50",
                )}
                aria-label={`Move ${label} up`}
              >
                <ChevronUp className="size-3.5" />
              </button>
            )}

            {onMoveDown && (
              <button
                type="button"
                onClick={() => onMoveDown(id)}
                disabled={isLast}
                className={cn(
                  "flex items-center justify-center size-7 rounded transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isLast
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50",
                )}
                aria-label={`Move ${label} down`}
              >
                <ChevronDown className="size-3.5" />
              </button>
            )}
          </div>

          {/* Section label */}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 whitespace-nowrap flex-1">
            {label}
          </span>

          {/* Preview indicator icon — shown when a fixture is active */}
          {activeFixture && (
            <FlaskConical
              className="size-3.5 text-yellow-500 shrink-0"
              aria-label="Preview fixture active"
            />
          )}

          {/* Visibility toggle */}
          <button
            type="button"
            onClick={() => onVisibilityChange(id, !visible)}
            className={cn(
              "flex items-center justify-center size-7 rounded transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              visible
                ? "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50"
                : "text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-muted/30",
            )}
            aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          >
            {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </button>
        </div>

        {/* Bottom row: pickers */}
        {(variantOptions.length > 1 ||
          columnOptions.length > 1 ||
          (fixtureOptions && fixtureOptions.length > 0)) && (
          <div className="flex flex-wrap items-center gap-1.5 px-3 pb-2">
            {/* Variant picker */}
            {variantOptions.length > 1 && (
              <select
                value={variant}
                onChange={(e) => onVariantChange(id, e.target.value)}
                className={SELECT_CLASSES}
                aria-label={`Choose variant for ${label}`}
              >
                {variantOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {variantLabels?.[opt] ?? opt}
                  </option>
                ))}
              </select>
            )}

            {/* Column picker */}
            {columnOptions.length > 1 && (
              <select
                value={column}
                onChange={(e) =>
                  onColumnChange(id, e.target.value as "left" | "right" | "full")
                }
                className={SELECT_CLASSES}
                aria-label={`Choose column for ${label}`}
              >
                {columnOptions.map((col) => (
                  <option key={col} value={col}>
                    {COLUMN_LABELS[col]}
                  </option>
                ))}
              </select>
            )}

            {/* Preview fixture picker */}
            {fixtureOptions && fixtureOptions.length > 0 && onFixtureChange && (
              <select
                value={activeFixture}
                onChange={(e) => onFixtureChange(id, e.target.value)}
                className={cn(
                  SELECT_CLASSES,
                  activeFixture && "border-yellow-500/40 bg-yellow-500/5 text-yellow-600",
                )}
                aria-label={`Preview example data for ${label}`}
              >
                <option value="">Live Data</option>
                {fixtureOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Content — hidden when not visible */}
      {visible && <div className="p-3">{children}</div>}

      {/* Collapsed state label */}
      {!visible && (
        <div className="px-3 py-2 text-[10px] text-muted-foreground/30 uppercase tracking-[0.15em]">
          Hidden
        </div>
      )}
    </div>
  );
}
